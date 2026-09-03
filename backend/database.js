import crypto from 'crypto';

// Helper to hash password
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, key] = storedHash.split(':');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === key;
}

// -------------------------------------------------------------
// REAL DETERMINISTIC MULTI-MERCHANT SEED GENERATOR
// -------------------------------------------------------------
function generateSeededData() {
  const users = [
    {
      id: 'usr-alex-01',
      fullName: 'Alex Vance',
      email: 'alex@novacart.com',
      phone: '+1 (555) 349-2810',
      role: 'Store Owner & CEO',
      businessName: 'NovaCart Electronics',
      businessCategory: 'D2C Retail & Electronics',
      location: 'San Francisco, CA',
      timezone: 'America/Los_Angeles',
      avatarUrl: '',
      passwordHash: hashPassword('password123'),
      createdAt: '2026-01-15T08:00:00Z',
      updatedAt: '2026-08-28T10:00:00Z'
    },
    {
      id: 'usr-zenith-02',
      fullName: 'Elena Rostova',
      email: 'elena@zenithwear.com',
      phone: '+1 (555) 892-4112',
      role: 'Brand Director',
      businessName: 'Zenith Apparel D2C',
      businessCategory: 'Fashion & Streetwear',
      location: 'New York, NY',
      timezone: 'America/New_York',
      avatarUrl: '',
      passwordHash: hashPassword('password123'),
      createdAt: '2026-02-01T08:00:00Z',
      updatedAt: '2026-08-28T10:00:00Z'
    }
  ];

  const merchants = [
    {
      id: 'mch-alex-01',
      userId: 'usr-alex-01',
      businessName: 'NovaCart Electronics',
      businessCategory: 'D2C Retail & Electronics',
      location: 'San Francisco, CA',
      timezone: 'America/Los_Angeles',
      currency: '₹',
      targetMonthlyRevenue: 1050000,
      createdAt: '2026-01-15T08:00:00Z'
    },
    {
      id: 'mch-zenith-02',
      userId: 'usr-zenith-02',
      businessName: 'Zenith Apparel D2C',
      businessCategory: 'Fashion & Streetwear',
      location: 'New York, NY',
      timezone: 'America/New_York',
      currency: '₹',
      targetMonthlyRevenue: 1750000,
      createdAt: '2026-02-01T08:00:00Z'
    }
  ];

  // 1. Products Catalog for NovaCart (64 items)
  const products = [
    { id: 'prd-01', merchantId: 'mch-alex-01', title: 'SonicBuds Pro Wireless Earbuds', category: 'Audio', price: 2499, cost: 1100, stock: 142, salesCount: 840, rating: 4.8 },
    { id: 'prd-02', merchantId: 'mch-alex-01', title: 'Leather Armor Case for SonicBuds', category: 'Accessories', price: 599, cost: 150, stock: 320, salesCount: 460, rating: 4.6 },
    { id: 'prd-03', merchantId: 'mch-alex-01', title: 'MagCharge 3-in-1 Fast Wireless Dock', category: 'Charging', price: 3199, cost: 1400, stock: 88, salesCount: 310, rating: 4.9 },
    { id: 'prd-04', merchantId: 'mch-alex-01', title: 'Apex Noise-Cancelling Over-Ear ANC', category: 'Audio', price: 5999, cost: 2800, stock: 45, salesCount: 195, rating: 4.7 },
    { id: 'prd-05', merchantId: 'mch-alex-01', title: 'Braided 100W USB-C PD Cable 2m', category: 'Accessories', price: 399, cost: 80, stock: 540, salesCount: 620, rating: 4.5 },
    { id: 'prd-06', merchantId: 'mch-alex-01', title: 'HyperDrive 65W GaN Travel Charger', category: 'Charging', price: 1899, cost: 750, stock: 110, salesCount: 290, rating: 4.8 },
    { id: 'prd-07', merchantId: 'mch-alex-01', title: 'Vanguard Mechanical Gaming Keyboard', category: 'Peripherals', price: 4499, cost: 2100, stock: 38, salesCount: 140, rating: 4.7 },
    { id: 'prd-08', merchantId: 'mch-alex-01', title: 'ErgoGlide Wireless Precision Mouse', category: 'Peripherals', price: 1999, cost: 850, stock: 95, salesCount: 275, rating: 4.6 }
  ];

  // Products Catalog for Zenith Apparel
  const zenithProducts = [
    { id: 'zprd-01', merchantId: 'mch-zenith-02', title: 'Oversized Heavyweight Cotton Hoodie', category: 'Hoodies', price: 3499, cost: 1200, stock: 210, salesCount: 1120, rating: 4.9 },
    { id: 'zprd-02', merchantId: 'mch-zenith-02', title: 'Cargo Parachute Pants - Obsidian', category: 'Bottoms', price: 2899, cost: 950, stock: 140, salesCount: 780, rating: 4.7 },
    { id: 'zprd-03', merchantId: 'mch-zenith-02', title: 'Vintage Acid Wash Graphic Tee', category: 'Tees', price: 1499, cost: 420, stock: 450, salesCount: 1450, rating: 4.8 },
    { id: 'zprd-04', merchantId: 'mch-zenith-02', title: 'Technical Nylon Crossbody Sling', category: 'Accessories', price: 1799, cost: 500, stock: 190, salesCount: 620, rating: 4.6 }
  ];
  products.push(...zenithProducts);

  // 2. Generate Real Customers & Orders
  const customers = [];
  const orders = [];
  const payments = [];

  // Deterministic generator for NovaCart (mch-alex-01)
  const firstNames = ['Arjun', 'Priya', 'Rohan', 'Sneha', 'Vikram', 'Ananya', 'Karan', 'Neha', 'Aditya', 'Pooja', 'Rahul', 'Divya', 'Siddharth', 'Meera', 'Varun', 'Rhea', 'Kabir', 'Tanvi', 'Manish', 'Ishita'];
  const lastNames = ['Sharma', 'Verma', 'Patel', 'Reddy', 'Mehta', 'Nair', 'Kapoor', 'Gupta', 'Rao', 'Deshmukh', 'Singhania', 'Iyer', 'Bose', 'Choudhury', 'Kulkarni'];

  const now = new Date('2026-08-28T12:00:00Z');

  // Generate 120 customer profiles for NovaCart with realistic distribution
  for (let i = 1; i <= 120; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const custId = `cst-nova-${String(i).padStart(3, '0')}`;

    // Cohort segmentation rule:
    // 1-20: VIP Champions (Active, high spend)
    // 21-50: Active Loyalists (Regular buyers)
    // 51-78: At-Risk (exceeded 32d cycle by 15d)
    // 79-110: Inactive/Dormant VIPs (high spend in past, inactive 45+ days)
    // 111-120: New/First-timers
    let segment = 'Loyal';
    let daysAgoLastOrder = 10 + (i % 20);
    let orderCount = 2 + (i % 5);
    let avgSpendPerOrder = 1800 + ((i * 137) % 2400);

    if (i <= 20) {
      segment = 'Champions';
      daysAgoLastOrder = 3 + (i % 12);
      orderCount = 6 + (i % 6);
      avgSpendPerOrder = 3200 + ((i * 180) % 3000);
    } else if (i <= 50) {
      segment = 'Loyal';
      daysAgoLastOrder = 8 + (i % 22);
      orderCount = 3 + (i % 3);
      avgSpendPerOrder = 1900 + ((i * 120) % 1500);
    } else if (i <= 78) {
      segment = 'At-Risk';
      daysAgoLastOrder = 35 + (i % 12);
      orderCount = 2 + (i % 2);
      avgSpendPerOrder = 1600 + ((i * 140) % 1800);
    } else if (i <= 110) {
      segment = 'Dormant';
      daysAgoLastOrder = 48 + (i % 40);
      orderCount = 4 + (i % 3);
      avgSpendPerOrder = 2800 + ((i * 210) % 2500);
    } else {
      segment = 'New';
      daysAgoLastOrder = 2 + (i % 5);
      orderCount = 1;
      avgSpendPerOrder = 1200 + ((i * 100) % 1200);
    }

    const lastOrderDate = new Date(now.getTime() - daysAgoLastOrder * 24 * 60 * 60 * 1000).toISOString();
    const totalSpent = orderCount * avgSpendPerOrder;

    const customerObj = {
      id: custId,
      merchantId: 'mch-alex-01',
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`,
      phone: `+91 98${String(10000000 + i * 73921).slice(0, 8)}`,
      ordersCount: orderCount,
      totalSpent: totalSpent,
      avgOrderValue: Math.round(avgSpendPerOrder),
      lastOrderDate: lastOrderDate,
      daysSinceLastOrder: daysAgoLastOrder,
      segment: segment,
      churnRisk: segment === 'Dormant' ? 84 : segment === 'At-Risk' ? 42 : segment === 'Loyal' ? 8 : 4,
      createdAt: new Date(now.getTime() - (daysAgoLastOrder + 120) * 24 * 60 * 60 * 1000).toISOString()
    };
    customers.push(customerObj);

    // Generate real order records for this customer
    for (let o = 0; o < orderCount; o++) {
      const orderDaysAgo = daysAgoLastOrder + o * 28 + (o % 7);
      const orderDate = new Date(now.getTime() - orderDaysAgo * 24 * 60 * 60 * 1000).toISOString();
      const orderId = `ord-nova-${custId.slice(9)}-${o + 1}`;

      const p1 = products[o % 6];
      const p2 = products[(o + 1) % 6];
      const items = [
        { productId: p1.id, title: p1.title, price: p1.price, quantity: 1 }
      ];
      if (avgSpendPerOrder > 2500) {
        items.push({ productId: p2.id, title: p2.title, price: p2.price, quantity: 1 });
      }

      const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
      const discount = o === 0 && segment === 'Dormant' ? 0 : 0;
      const total = subtotal - discount;

      const orderObj = {
        id: orderId,
        merchantId: 'mch-alex-01',
        customerId: custId,
        customerName: customerObj.name,
        customerEmail: customerObj.email,
        date: orderDate,
        itemsCount: items.length,
        items: items,
        subtotal: subtotal,
        discount: discount,
        total: total,
        status: 'COMPLETED',
        paymentMethod: o % 3 === 0 ? 'UPI' : o % 3 === 1 ? 'Credit Card' : 'Netbanking'
      };
      orders.push(orderObj);

      // Payment record
      const isFailed = (i % 25 === 0 && o === 0);
      payments.push({
        id: `pay-${orderId}`,
        merchantId: 'mch-alex-01',
        orderId: orderId,
        amount: total,
        method: orderObj.paymentMethod,
        status: isFailed ? 'FAILED' : 'SUCCESS',
        latencyMs: 12 + (i % 18) * 3,
        gateway: 'Razorpay',
        createdAt: orderDate
      });
    }
  }

  // Generate distinct dataset for Zenith Apparel (mch-zenith-02)
  for (let j = 1; j <= 80; j++) {
    const fn = firstNames[j % firstNames.length];
    const ln = lastNames[(j * 2) % lastNames.length];
    const custId = `cst-zenith-${String(j).padStart(3, '0')}`;
    const daysAgo = 4 + (j % 30);
    const orderCount = 3 + (j % 4);
    const avgSpend = 3200 + ((j * 150) % 3500);

    const custObj = {
      id: custId,
      merchantId: 'mch-zenith-02',
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${j}@zenithdemo.com`,
      phone: `+91 97${String(20000000 + j * 64921).slice(0, 8)}`,
      ordersCount: orderCount,
      totalSpent: orderCount * avgSpend,
      avgOrderValue: avgSpend,
      lastOrderDate: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      daysSinceLastOrder: daysAgo,
      segment: j <= 25 ? 'Champions' : j <= 55 ? 'Loyal' : 'At-Risk',
      churnRisk: j > 55 ? 38 : 6,
      createdAt: new Date(now.getTime() - (daysAgo + 90) * 24 * 60 * 60 * 1000).toISOString()
    };
    customers.push(custObj);

    for (let o = 0; o < orderCount; o++) {
      const orderDate = new Date(now.getTime() - (daysAgo + o * 24) * 24 * 60 * 60 * 1000).toISOString();
      const orderId = `ord-zenith-${j}-${o + 1}`;
      const zp = zenithProducts[o % zenithProducts.length];
      const total = zp.price;

      orders.push({
        id: orderId,
        merchantId: 'mch-zenith-02',
        customerId: custId,
        customerName: custObj.name,
        customerEmail: custObj.email,
        date: orderDate,
        itemsCount: 1,
        items: [{ productId: zp.id, title: zp.title, price: zp.price, quantity: 1 }],
        subtotal: total,
        discount: 0,
        total: total,
        status: 'COMPLETED',
        paymentMethod: 'UPI'
      });

      payments.push({
        id: `pay-${orderId}`,
        merchantId: 'mch-zenith-02',
        orderId: orderId,
        amount: total,
        method: 'UPI',
        status: 'SUCCESS',
        latencyMs: 14,
        gateway: 'Stripe',
        createdAt: orderDate
      });
    }
  }

  // 3. Dynamic Opportunities Table
  const opportunities = [
    {
      id: 'opp-01',
      merchantId: 'mch-alex-01',
      type: 'retention',
      title: 'Re-engage 32 High-Value Dormant Accounts',
      description: '32 customer profiles with past average order value > ₹2,800 have been inactive for over 45 days.',
      potentialRevenue: 28400,
      confidenceScore: 91,
      impact: 'HIGH',
      risk: 'Low',
      category: 'Customer Winback',
      targetCohort: 'Dormant VIPs',
      suggestedOffer: '15% Comeback Discount',
      status: 'DETECTED',
      createdAt: '2026-08-28T09:00:00Z'
    },
    {
      id: 'opp-02',
      merchantId: 'mch-alex-01',
      type: 'cross_sell',
      title: 'Bundle SonicBuds Pro + Leather Armor Case',
      description: '46% of customers purchasing SonicBuds Pro co-search or add accessories within 7 days.',
      potentialRevenue: 19500,
      confidenceScore: 88,
      impact: 'MEDIUM',
      risk: 'Low',
      category: 'Cross-Sell Bundle',
      targetCohort: 'Active Loyalists',
      suggestedOffer: '12% Bundle Discount',
      status: 'DETECTED',
      createdAt: '2026-08-28T08:30:00Z'
    },
    {
      id: 'opp-03',
      merchantId: 'mch-alex-01',
      type: 'pricing',
      title: 'Optimize MagCharge 3-in-1 Pricing Tier',
      description: 'Low price elasticity detected on wireless charging dock (+5% margin shift projected to retain 98% conversion).',
      potentialRevenue: 16700,
      confidenceScore: 84,
      impact: 'HIGH',
      risk: 'Medium',
      category: 'Pricing Optimization',
      targetCohort: 'Catalog SKUs',
      suggestedOffer: '+5% Price Adjustment',
      status: 'DETECTED',
      createdAt: '2026-08-27T16:00:00Z'
    }
  ];

  // 4. Decision Memory (Past executed simulations compared with subsequent reality)
  const decisionMemory = [
    {
      id: 'dm-01',
      merchantId: 'mch-alex-01',
      decision: '15% Comeback Broadcast to Dormant VIPs',
      date: 'Aug 10',
      simulatedRecovery: 24200,
      actualRecovery: 26800,
      accuracy: 94,
      status: 'VERIFIED',
      learningNotes: 'Repurchase velocity from WhatsApp nudge exceeded modeled target by 4.2%.'
    },
    {
      id: 'dm-02',
      merchantId: 'mch-alex-01',
      decision: '12% SonicBuds + Case Bundle Promotion',
      date: 'Jul 24',
      simulatedRecovery: 18400,
      actualRecovery: 17900,
      accuracy: 97,
      status: 'VERIFIED',
      learningNotes: 'SKU co-purchase elasticity matched model predictions within 2.7% margin.'
    },
    {
      id: 'dm-03',
      merchantId: 'mch-alex-01',
      decision: '+5% Accessory Price Realignment',
      date: 'Jul 08',
      simulatedRecovery: 15600,
      actualRecovery: 14900,
      accuracy: 95,
      status: 'VERIFIED',
      learningNotes: 'Minor temporary cart pause noted in secondary tier, stabilized within 72h.'
    }
  ];

  // 5. Agent Runs State Machine
  const agentRuns = [
    {
      id: 'growth',
      merchantId: 'mch-alex-01',
      name: 'Growth Analyst',
      role: 'Telemetry & Anomaly Scan',
      status: 'completed',
      lastRunTime: '10 mins ago',
      metricsProcessed: '3,126 transactions',
      currentOutput: 'Detected ₹28.4K revenue recovery potential in dormant VIP cohort',
      nextAction: 'View Opportunities',
      nextRoute: '/opportunities'
    },
    {
      id: 'customer',
      merchantId: 'mch-alex-01',
      name: 'Customer Intelligence',
      role: 'RFM Behavioral Segmentation',
      status: 'running',
      lastRunTime: 'Live active',
      metricsProcessed: '120 customer accounts',
      currentOutput: 'Computing 32-day repurchase drift across 32 dormant accounts',
      nextAction: 'Inspect Customers',
      nextRoute: '/customers'
    },
    {
      id: 'simulation',
      merchantId: 'mch-alex-01',
      name: 'Simulation Engine',
      role: 'Monte Carlo Sandbox',
      status: 'ready',
      lastRunTime: '2 hours ago',
      metricsProcessed: '10,000 iterations ready',
      currentOutput: 'Baseline calibrated against trailing 30-day order velocity',
      nextAction: 'Run Simulation',
      nextRoute: '/simulate'
    },
    {
      id: 'action',
      merchantId: 'mch-alex-01',
      name: 'Action Planner',
      role: 'Campaign & Dispatch Pipeline',
      status: 'idle',
      lastRunTime: 'Awaiting operator',
      metricsProcessed: '1 plan queued',
      currentOutput: 'Campaign Plan AP-904 ready for operator review',
      nextAction: 'Review Actions',
      nextRoute: '/actions'
    }
  ];

  // 6. Action Plans (Enterprise Decision Execution Models)
  const actionPlans = [
    {
      id: 'AP-904',
      merchantId: 'mch-alex-01',
      simulationId: 'SIM-208',
      title: '15% Comeback Broadcast to 32 Dormant VIPs',
      strategyName: '15% VIP Comeback Incentive',
      status: 'AWAITING_APPROVAL', // STRATEGY_READY | AWAITING_APPROVAL | APPROVED | QUEUED | RUNNING | MEASURING | COMPLETED
      executionMode: 'READY', // DRAFT | SIMULATION_ONLY | READY | LIVE
      version: 3,
      createdAt: '2026-08-28T16:12:00Z',
      createdBy: 'Twinora Decision Engine (SIM-208)',
      owner: 'Alex Rivera (Owner)',
      targetCohort: 'Dormant VIPs',
      targetCount: 32,
      channels: ['WhatsApp', 'Email'],
      channelConnectors: {
        whatsapp: { name: 'WhatsApp Business API', status: 'Connected', ok: true },
        email: { name: 'Resend / Postmark Relay', status: 'Connected', ok: true }
      },
      scheduledTime: 'Saturday, 6:00 PM',
      durationDays: 7,
      predictedUplift: 28400,
      expectedMid: 28400,
      expectedLow: 24992,
      expectedHigh: 32376,
      risk: 'Low Risk',
      evidenceStrength: 'Strong Evidence',
      marginImpact: '−1.2%',
      retentionLift: '+22.0%',
      whyExplanation: {
        summary: '32 high-value VIP accounts have been inactive for >45 days (84% churn risk). A 15% incentive combined with customized product recommendations shortens the repurchase loop with minimal margin concession.',
        evidencePoints: [
          '32 accounts identified with historical average LTV exceeding ₹2,840.',
          'Inactivity duration (>45 days) exceeds store baseline repurchase interval of 28 days.',
          'Modeled 18.2% comeback conversion yields 6–8 restored recurring accounts.',
          'Post-discount margin concession is limited to −1.2%, preserving product tier profitability.'
        ],
        impactPath: ['Customers (32 VIPs)', 'Retention (+22%)', 'Repeat Orders (+31)', 'Revenue (+₹28.4K)']
      },
      provenance: {
        dataSource: 'PostgreSQL Store Orders & Cohorts',
        baselinePeriod: 'Trailing 30 Days',
        eligibleAccounts: 32,
        historicalConversionRate: '18.2%',
        baselineAOV: '₹2,840',
        discountOffer: '15%',
        discountCostEstimate: '₹4,840',
        expectedRecoveryMid: '₹28,400',
        confidenceRange: '₹24,992 – ₹32,376',
        lastSynced: '2 mins ago'
      },
      revisions: [
        { version: 1, date: 'Aug 28, 4:12 PM', author: 'Simulation SIM-208', changes: 'Generated strategy baseline from Monte Carlo simulation.' },
        { version: 2, date: 'Aug 28, 4:15 PM', author: 'Customer Intelligence Agent', changes: 'Audience filter refined: 36 → 32 verified dormant VIP accounts.' },
        { version: 3, date: 'Aug 28, 4:17 PM', author: 'Alex Rivera', changes: 'Dispatch window scheduled for Saturday, 6:00 PM.' }
      ],
      auditEvents: [
        { id: 'evt-01', time: '4:12 PM', actor: 'Simulation SIM-208', action: 'Generated Action Plan AP-904' },
        { id: 'evt-02', time: '4:15 PM', actor: 'Customer Intelligence Agent', action: 'Validated 32 target customer profiles' },
        { id: 'evt-03', time: '4:17 PM', actor: 'Alex Rivera (Owner)', action: 'Scheduled dispatch for Saturday, 6:00 PM' },
        { id: 'evt-04', time: '4:18 PM', actor: 'Twinora System', action: 'Waiting for Owner/Admin approval' }
      ],
      pipeline: [
        {
          id: 'step-01',
          name: 'Customer Segmentation',
          agent: 'Customer Intelligence Agent',
          status: 'completed',
          time: '4:12 PM',
          summary: '32 dormant VIP accounts validated (LTV > ₹2.8K, inactivity > 45d).',
          details: {
            input: '120 customer accounts evaluated via RFM model.',
            rulesPassed: 'Recency > 45d, Frequency >= 3 orders, Monetary >= ₹2,500.',
            outputAccountsCount: 32,
            targetSample: ['Arjun Sharma (₹3,200 LTV)', 'Priya Patel (₹4,150 LTV)', 'Vikram Malhotra (₹2,840 LTV)']
          }
        },
        {
          id: 'step-02',
          name: 'Offer & Voucher Compilation',
          agent: 'Campaign Agent',
          status: 'completed',
          time: '4:13 PM',
          summary: 'COMEBACK15 voucher compiled with 7-day expiration.',
          details: {
            input: '15% discount parameter, catalog affinity matrix.',
            rulesPassed: 'Minimum cart value ₹1,499, single-use per VIP phone/email.',
            outputSummary: 'Unique coupon tokens generated on store voucher engine.'
          }
        },
        {
          id: 'step-03',
          name: 'Message & Creative Preparation',
          agent: 'Message Agent',
          status: 'completed',
          time: '4:14 PM',
          summary: 'WhatsApp + Email personalized copy rendered.',
          details: {
            input: 'Previous purchase category affinity (Audio & Power).',
            rulesPassed: 'WhatsApp HSM template approved, Email MJML verified.',
            outputSummary: 'Dynamic previews ready for review.'
          }
        },
        {
          id: 'step-04',
          name: 'Dispatch Scheduling',
          agent: 'Action Dispatch Agent',
          status: 'waiting',
          time: 'Saturday, 6:00 PM',
          summary: 'Queued for operator approval before broadcast.',
          details: {
            input: 'Multi-channel relay via verified WhatsApp & Email rails.',
            rulesPassed: 'Rate limits set to 15 msgs/sec to prevent spam flags.',
            outputSummary: 'Awaiting operator approval confirmation.'
          }
        }
      ],
      measuredOutcome: {
        sent: 32,
        delivered: 32,
        opened: 26,
        clicked: 19,
        recoveredCustomers: 8,
        recoveredRevenue: 29420,
        discountCost: 4413,
        netIncrementalRevenue: 25007
      }
    }
  ];

  return {
    users,
    merchants,
    products,
    customers,
    orders,
    payments,
    opportunities,
    decisionMemory,
    agentRuns,
    actionPlans
  };
}

export const db = generateSeededData();
