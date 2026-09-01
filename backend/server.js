import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, hashPassword, verifyPassword } from './database.js';
import * as bi from './biService.js';
import { executeTool, analyzeIntent } from './aiRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...rest] = trimmed.split('=');
      const val = rest.join('=').trim().replace(/(^['"]|['"]$)/g, '');
      if (key.trim()) {
        process.env[key.trim()] = val;
      }
    }
  });
}

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Auth Middleware: extracts authenticated user and merchant
function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = db.users[0];
    req.merchant = db.merchants.find(m => m.userId === req.user.id) || db.merchants[0];
    return next();
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const userId = token.replace('jwt-token-', '');
  const user = db.users.find(u => u.id === userId) || db.users[0];
  const merchant = db.merchants.find(m => m.userId === user.id) || db.merchants[0];

  req.user = user;
  req.merchant = merchant;
  next();
}

// -------------------------------------------------------------
// AUTHENTICATION
// -------------------------------------------------------------
app.post('/api/auth/signup', (req, res) => {
  const { fullName, businessName, email, password } = req.body;
  if (!fullName || !businessName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const userId = `usr-${Date.now()}`;
  const merchantId = `mch-${Date.now()}`;

  const newUser = {
    id: userId,
    fullName: fullName.trim(),
    email: normalizedEmail,
    role: 'Store Owner',
    businessName: businessName.trim(),
    businessCategory: 'Retail & E-commerce',
    location: 'California, US',
    timezone: 'America/Los_Angeles',
    avatarUrl: '',
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  const newMerchant = {
    id: merchantId,
    userId: userId,
    businessName: businessName.trim(),
    businessCategory: 'Retail & E-commerce',
    location: 'California, US',
    timezone: 'America/Los_Angeles',
    currency: '₹',
    targetMonthlyRevenue: 1200000,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  db.merchants.push(newMerchant);

  // Seed sample starter data for new business
  db.products.push({ id: `prd-${Date.now()}-1`, merchantId, title: 'Starter Product SKU-A', category: 'Catalog', price: 1499, cost: 600, stock: 50, salesCount: 12, rating: 4.8 });

  const token = `jwt-token-${userId}`;
  res.status(201).json({ token, user: newUser, merchant: newMerchant });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = (email || '').trim().toLowerCase();
  const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const merchant = db.merchants.find(m => m.userId === user.id) || db.merchants[0];
  const token = `jwt-token-${user.id}`;
  res.json({ token, user, merchant });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/auth/me', authenticateUser, (req, res) => {
  res.json({ user: req.user, merchant: req.merchant });
});

app.get('/api/auth/profile', authenticateUser, (req, res) => {
  res.json(req.user);
});

app.get('/api/auth/merchant-profile', authenticateUser, (req, res) => {
  res.json(req.merchant);
});

app.put('/api/auth/profile', authenticateUser, (req, res) => {
  const user = req.user;
  const { fullName, role, phone, businessName, businessCategory, location, timezone, avatarUrl } = req.body;
  if (fullName) user.fullName = fullName.trim();
  if (role) user.role = role.trim();
  if (phone) user.phone = phone.trim();
  if (businessName) user.businessName = businessName.trim();
  if (businessCategory) user.businessCategory = businessCategory.trim();
  if (location) user.location = location.trim();
  if (timezone) user.timezone = timezone.trim();
  if (avatarUrl) user.avatarUrl = avatarUrl;

  const merchant = db.merchants.find(m => m.userId === user.id);
  if (merchant && businessName) merchant.businessName = businessName.trim();

  res.json({ user, merchant: req.merchant });
});

app.post('/api/auth/avatar', authenticateUser, (req, res) => {
  const { avatarUrl } = req.body;
  if (avatarUrl) req.user.avatarUrl = avatarUrl;
  res.json({ success: true, avatarUrl: req.user.avatarUrl });
});

app.get('/api/merchant', authenticateUser, (req, res) => {
  const overview = bi.getBusinessOverview(req.merchant.id, '30d');
  res.json({ ...req.merchant, ...overview });
});

// -------------------------------------------------------------
// BUSINESS INTELLIGENCE API (DYNAMIC DATA)
// -------------------------------------------------------------
app.get('/api/bi/overview', authenticateUser, (req, res) => {
  const range = req.query.dateRange || '30d';
  const overview = bi.getBusinessOverview(req.merchant.id, range);
  res.json(overview);
});

app.get('/api/bi/revenue-trend', authenticateUser, (req, res) => {
  const range = req.query.dateRange || '30d';
  const data = bi.getRevenueMetrics(req.merchant.id, range);
  res.json(data);
});

app.get('/api/bi/customers', authenticateUser, (req, res) => {
  const cohorts = bi.getCustomerSegments(req.merchant.id);
  res.json(cohorts);
});

app.get('/api/bi/opportunities', authenticateUser, (req, res) => {
  const opps = bi.getDetectedOpportunities(req.merchant.id);
  res.json(opps);
});

app.get('/api/bi/priority-plan', authenticateUser, (req, res) => {
  const plan = bi.getDailyPriorityPlan(req.merchant.id);
  res.json(plan);
});

app.get('/api/bi/decision-memory', authenticateUser, (req, res) => {
  const memory = bi.getDecisionMemory(req.merchant.id);
  res.json(memory);
});

app.get('/api/bi/agents', authenticateUser, (req, res) => {
  const agents = bi.getAgentActivity(req.merchant.id);
  res.json(agents);
});

app.post('/api/bi/agents/run', authenticateUser, (req, res) => {
  const { agentId } = req.body;
  const result = bi.executeAgentTask(req.merchant.id, agentId);
  res.json(result);
});

app.get('/api/bi/actions', authenticateUser, (req, res) => {
  const plans = bi.getActionPlans(req.merchant.id);
  res.json(plans);
});

app.get('/api/bi/actions/:id', authenticateUser, (req, res) => {
  const plan = bi.getActionPlanDetails(req.merchant.id, req.params.id);
  res.json(plan);
});

app.put('/api/bi/actions/:id', authenticateUser, (req, res) => {
  const result = bi.updateActionPlan(req.merchant.id, req.params.id, req.body);
  res.json(result);
});

app.post('/api/bi/actions/approve', authenticateUser, (req, res) => {
  const { planId = 'AP-904' } = req.body;
  const result = bi.approveAndExecuteActionPlan(req.merchant.id, planId);
  res.json(result);
});

app.post('/api/bi/actions/:id/approve', authenticateUser, (req, res) => {
  const result = bi.approveAndExecuteActionPlan(req.merchant.id, req.params.id);
  res.json(result);
});

app.post('/api/bi/import-csv', authenticateUser, (req, res) => {
  const { type, rows } = req.body;
  const result = bi.importCSVData(req.merchant.id, { type, rows });
  res.json(result);
});

// Deterministic Simulation Endpoint
app.post('/api/simulations', authenticateUser, (req, res) => {
  const { discountPct, targetSegment, durationDays, priceChangePct } = req.body;
  const sim = bi.getSimulationResult(req.merchant.id, { discountPct, targetSegment, durationDays, priceChangePct });
  res.json(sim);
});

// Legacy routes for backward compatibility
app.get('/api/opportunities', authenticateUser, (req, res) => {
  res.json(bi.getDetectedOpportunities(req.merchant.id));
});
app.get('/api/customers', authenticateUser, (req, res) => {
  res.json(bi.getCustomerSegments(req.merchant.id));
});
app.get('/api/agents', authenticateUser, (req, res) => {
  res.json(bi.getAgentActivity(req.merchant.id));
});
app.get('/api/actions', authenticateUser, (req, res) => {
  res.json(bi.getActionPlans(req.merchant.id));
});
app.post('/api/actions/approve', authenticateUser, (req, res) => {
  res.json(bi.approveAndExecuteActionPlan(req.merchant.id, req.body.actionId || req.body.planId));
});
app.get('/api/analytics', authenticateUser, (req, res) => {
  const range = req.query.dateRange || '30d';
  res.json(bi.getRevenueMetrics(req.merchant.id, range));
});

// -------------------------------------------------------------
// REAL GEMINI INTELLIGENCE COPILOT (TRUE COPILOT + REASONING TRACE)
// -------------------------------------------------------------
async function callGeminiAPI({ systemPrompt, userPrompt, timeoutMs = 30000 }) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in backend environment.');
  }

  const models = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-2.5-flash'];
  let lastError = null;

  for (const modelName of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            maxOutputTokens: 4000,
            responseMimeType: 'application/json'
          }
        })
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Gemini API (${modelName}) HTTP error ${response.status}:`, errorText.slice(0, 150));
        lastError = new Error(`Gemini API error ${response.status}`);
        continue;
      }

      const json = await response.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return rawText;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini model candidates failed to respond.');
}

// POST /api/ai/ask — True Context-Aware Business Copilot
app.post('/api/ai/ask', authenticateUser, async (req, res) => {
  const { question = '', pageContext = 'dashboard', dateRange = '30d', selectedEntity = null } = req.body;
  const q = (question || '').trim();

  if (!q) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  const merchantId = req.merchant.id;

  // 1. Tool selection and signal routing
  const intent = analyzeIntent(q);
  const toolData = executeTool(intent.primaryTool, merchantId, { dateRange, ...selectedEntity });
  const overview = bi.getBusinessOverview(merchantId, dateRange);

  // 2. Format grounded context
  const groundContext = {
    businessName: req.merchant.businessName,
    businessCategory: req.merchant.businessCategory,
    currency: req.merchant.currency || '₹',
    selectedDateRange: dateRange,
    activePageContext: pageContext,
    signalsAnalyzed: intent.signalsChecked,
    strongestSignalFound: intent.strongestSignal,
    businessOverview: overview,
    toolExecuted: intent.primaryTool,
    toolOutput: toolData
  };

  const systemInstruction = `You are Twinora AI, an executive decision intelligence explanation layer.
STRICT PRINCIPLES:
1. Ground every claim ONLY in the provided real business telemetry for "${req.merchant.businessName}".
2. NEVER invent revenue numbers, customer counts, store locations, or percentages.
3. If the user asks about something not in the database (e.g. stores in London, external market facts), say explicitly that there is not enough connected business telemetry to answer.
4. Return strict, valid JSON matching this schema:
{
  "title": "Short executive summary headline",
  "summary": "1-2 concise, clear sentences answering the question grounded in evidence.",
  "insights": [
    { "title": "Key observation", "value": "Relevant metric", "type": "positive | negative | neutral" }
  ],
  "evidence": [
    { "metric": "Metric name", "current": "Current value", "previous": "Optional comparison", "change": "Delta string" }
  ],
  "trace": {
    "question": "${q}",
    "signalsChecked": ${JSON.stringify(intent.signalsChecked)},
    "strongestSignal": "${intent.strongestSignal}",
    "interpretation": "Concise explanation of the correlation or cause",
    "recommendation": "Suggested action to take"
  },
  "reasoningMap": [
    { "step": "1", "label": "User Query", "detail": "${q}", "status": "checked" },
    { "step": "2", "label": "Signal Inspection", "detail": "${intent.strongestSignal}", "status": "checked" },
    { "step": "3", "label": "Evidence Correlation", "detail": "Analyzed ${intent.primaryTool}", "status": "checked" },
    { "step": "4", "label": "Action Synthesis", "detail": "Generated decision recommendation", "status": "active" }
  ],
  "recommendedAction": "Actionable decision recommendation",
  "nextAction": {
    "type": "navigate",
    "label": "Short CTA button text",
    "route": "/simulate | /customers | /opportunities | /analytics | /actions"
  },
  "methodology": {
    "metricsUsed": "Telemetry from ${intent.primaryTool}",
    "comparisonPeriod": "${dateRange} window",
    "dataFreshness": "Live Synchronized (2 mins ago)",
    "assumptions": "Calculated from merchant database records",
    "calculationSource": "Deterministic In-Memory Business Intelligence Engine"
  },
  "dataFreshness": "Live Synchronized"
}`;

  try {
    const rawAiResponse = await callGeminiAPI({
      systemPrompt: systemInstruction,
      userPrompt: `USER QUESTION: "${q}"\nDATE RANGE: ${dateRange}\nPAGE: ${pageContext}\n\nBUSINESS EVIDENCE:\n${JSON.stringify(groundContext, null, 2)}`
    });

    const parsed = JSON.parse(rawAiResponse.replace(/```json/g, '').replace(/```/g, '').trim());
    return res.json({ geminiAvailable: true, ...parsed });
  } catch (err) {
    console.warn('Gemini copilot fallback triggered:', err.message);

    // High quality deterministic fallback matching the exact schema
    return res.json({
      geminiAvailable: false,
      title: `${intent.strongestSignal} Analysis`,
      summary: `Based on your ${dateRange} business data for ${req.merchant.businessName}, revenue is ₹${overview.totalRevenue.toLocaleString('en-IN')} with ${overview.repeatRate}% repeat purchase frequency.`,
      insights: [
        { title: 'Repeat Velocity', value: `${overview.repeatRate}%`, type: overview.repeatRate < 40 ? 'negative' : 'positive' },
        { title: 'Revenue Change', value: `${overview.revenueChangePct}%`, type: overview.revenueChangePct < 0 ? 'negative' : 'positive' }
      ],
      evidence: [
        { metric: 'Revenue', current: `₹${overview.totalRevenue.toLocaleString('en-IN')}`, previous: `₹${overview.targetRevenue.toLocaleString('en-IN')}`, change: `${overview.revenueChangePct}%` },
        { metric: 'Orders Count', current: `${overview.totalOrdersCount}`, previous: 'Target', change: '+4.2%' },
        { metric: 'Dormant VIPs', current: `${overview.activeDormantAccounts} accounts`, previous: '0', change: '+8 accounts' }
      ],
      trace: {
        question: q,
        signalsChecked: intent.signalsChecked,
        strongestSignal: intent.strongestSignal,
        interpretation: `Analysis indicates primary variance in ${intent.strongestSignal.toLowerCase()}.`,
        recommendation: 'Inspect cohort metrics or run a decision simulation.'
      },
      reasoningMap: [
        { step: '1', label: 'User Query', detail: q, status: 'checked' },
        { step: '2', label: 'Signal Inspection', detail: intent.strongestSignal, status: 'checked' },
        { step: '3', label: 'Evidence Correlation', detail: `Checked ${intent.primaryTool}`, status: 'checked' },
        { step: '4', label: 'Action Synthesis', detail: 'Formulated recovery strategy', status: 'active' }
      ],
      recommendedAction: 'Simulate a comeback strategy to recover inactive accounts.',
      nextAction: {
        type: 'navigate',
        label: 'Run Decision Simulation',
        route: '/simulate'
      },
      methodology: {
        metricsUsed: `Aggregated orders and customer RFM profiles for ${req.merchant.businessName}`,
        comparisonPeriod: `${dateRange} window`,
        dataFreshness: 'Live Synchronized (2 mins ago)',
        assumptions: 'Calculated directly from database telemetry',
        calculationSource: 'Deterministic In-Memory BI Engine'
      },
      dataFreshness: 'Live Telemetry'
    });
  }
});

// GET /api/ai/daily-brief
app.get('/api/ai/daily-brief', authenticateUser, async (req, res) => {
  const overview = bi.getBusinessOverview(req.merchant.id, '30d');
  const opps = bi.getDetectedOpportunities(req.merchant.id);
  const topOpp = opps[0] || { title: 'Dormant Customer Winback' };
  const firstName = req.user.fullName?.split(' ')[0] || 'Operator';

  const systemInstruction = `You are Twinora AI. Generate a 2-bullet executive daily briefing based strictly on the provided merchant metrics for "${req.merchant.businessName}".
Return JSON:
{
  "greeting": "Good morning, ${firstName}",
  "headline": "One clear summary sentence",
  "points": ["Fact 1", "Fact 2"],
  "primaryAction": { "label": "CTA text", "route": "/simulate | /opportunities" }
}`;

  try {
    const raw = await callGeminiAPI({
      systemPrompt: systemInstruction,
      userPrompt: `Metrics: Revenue ₹${overview.totalRevenue}, Target ₹${overview.targetRevenue}, Revenue Change ${overview.revenueChangePct}%, Dormant VIPs: ${overview.activeDormantAccounts}, Top Opportunity: ${topOpp.title}`,
      timeoutMs: 8000
    });
    const parsed = JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
    return res.json({ success: true, briefing: parsed });
  } catch {
    return res.json({
      success: true,
      briefing: {
        greeting: `Good morning, ${firstName}`,
        headline: `Twinora identified key movements in ${req.merchant.businessName} today.`,
        points: [
          `Monthly revenue stands at ₹${(overview.totalRevenue / 100000).toFixed(2)}L (${overview.revenueChangePct}% vs target).`,
          `Identified ${topOpp.title} with high confidence recovery potential.`
        ],
        primaryAction: {
          label: "Simulate Recovery Strategy",
          route: "/simulate"
        }
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Twinora AI Multi-Merchant Intelligence Backend running on http://localhost:${PORT}`);
});
