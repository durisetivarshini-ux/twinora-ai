// AI Agent Team details & activity log feed

export const AI_AGENTS_TEAM = [
  {
    id: 'agent-growth',
    name: 'Growth Agent',
    role: 'Opportunity Identification Engine',
    status: 'Analyzing',
    statusColor: 'emerald',
    icon: 'TrendingUp',
    description: 'Scans 3,400+ transactions to pinpoint underperforming cohorts and revenue uplift angles.',
    currentTask: 'Evaluating weekend sales surge patterns...',
    metricsProcessed: '3,482 txns'
  },
  {
    id: 'agent-customer',
    name: 'Customer Intelligence Agent',
    role: 'Behavioral & Churn Analyst',
    status: 'Ready',
    statusColor: 'brand',
    icon: 'Users',
    description: 'Tracks recency, frequency, monetary velocity and predicts customer churn probability.',
    currentTask: 'Monitoring 71 at-risk accounts',
    metricsProcessed: '1,240 customer profiles'
  },
  {
    id: 'agent-sim',
    name: 'Simulation Agent',
    role: 'Predictive Financial Modeler',
    status: 'Waiting for Approval',
    statusColor: 'amber',
    icon: 'Cpu',
    description: 'Runs Monte Carlo & elasticity models to test decisions without real-world financial risk.',
    currentTask: 'Product Bundle scenario simulated (+₹11.1K predicted)',
    metricsProcessed: '4 strategies evaluated'
  },
  {
    id: 'agent-action',
    name: 'Action Agent',
    role: 'Strategy Execution Synthesizer',
    status: 'Completed',
    statusColor: 'violet',
    icon: 'Zap',
    description: 'Converts approved MerchantTwin strategies into executable discount codes and promo broadcasts.',
    currentTask: 'Action plan #AP-882 ready for manual trigger',
    metricsProcessed: '1 campaign queued'
  }
];

export const AGENT_ACTIVITY_LOGS = [
  {
    id: 'log-1',
    time: '08:42 AM',
    agentId: 'agent-growth',
    agentName: 'Growth Agent',
    title: 'Analyzed 3,482 historical transactions',
    detail: 'Completed full 30-day velocity audit. Detected a 14% drop in repeat purchase velocity among tier-2 buyers.',
    badge: 'Audit Complete'
  },
  {
    id: 'log-2',
    time: '08:44 AM',
    agentId: 'agent-customer',
    agentName: 'Customer Intelligence Agent',
    title: 'Identified 43 high-value inactive customers',
    detail: 'Segment marked with >75% probability of permanent churn if no engagement occurs within 7 days.',
    badge: 'Anomaly Detected'
  },
  {
    id: 'log-3',
    time: '08:46 AM',
    agentId: 'agent-sim',
    agentName: 'Simulation Agent',
    title: 'Tested three recovery strategies',
    detail: 'Simulated 10% discount, 15% discount, and Product Bundle offer. Predicted net gains: ₹6.2K to ₹11.1K.',
    badge: 'Simulation Done'
  },
  {
    id: 'log-4',
    time: '08:47 AM',
    agentId: 'agent-growth',
    agentName: 'Growth Agent',
    title: 'Recommended Product Bundle Strategy',
    detail: 'Product Bundle selected due to highest net revenue impact (+₹11.1K) with minimal margin degradation.',
    badge: 'Action Required'
  }
];
