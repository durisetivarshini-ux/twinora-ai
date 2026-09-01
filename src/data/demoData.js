// Demo merchant dataset for NovaCart (Indian fintech e-commerce merchant)

export const MERCHANT_PROFILE = {
  name: 'NovaCart Electronics & Apparel',
  owner: 'Alex Vance',
  industry: 'D2C Retail & Electronics',
  currency: '₹',
  monthlyRevenue: 1245800,
  previousRevenue: 1448600, // Revenue dropped ~14%
  revenueChangePct: -14.0,
  totalTransactions: 3482,
  totalCustomers: 1240,
  averageOrderValue: 892,
  repeatPurchaseRate: 34,
  growthScore: 87,
  scoreHistory: [
    { month: 'May', score: 79 },
    { month: 'Jun', score: 82 },
    { month: 'Jul', score: 84 },
    { month: 'Aug', score: 87 }
  ],
  scoreBreakdown: {
    customerRetention: { score: 82, label: 'Customer Retention', detail: 'Slight churn in high-value segment (-8.4%)' },
    revenueMomentum: { score: 91, label: 'Revenue Velocity', detail: 'Strong weekend spike potential' },
    productPerformance: { score: 84, label: 'Product Margin Health', detail: 'Bundling opportunity detected' },
    paymentSuccess: { score: 94, label: 'UPI & Card Gateway Success', detail: 'Optimal checkout performance (94.2%)' },
    growthOpportunity: { score: 88, label: 'Growth Potential', detail: '₹47.8K total unrealized revenue' }
  },
  connectedIntegrations: [
    { name: 'Razorpay Payment Gateway', type: 'Payments', status: 'Connected', lastSync: '2 minutes ago' },
    { name: 'Shopify Storefront API', type: 'E-commerce', status: 'Connected', lastSync: 'Just now' },
    { name: 'WhatsApp Business API', type: 'Marketing', status: 'Connected', lastSync: '10 minutes ago' }
  ]
};

export const REVENUE_TIMESERIES = [
  { date: 'Aug 01', revenue: 41200, transactions: 114, baseline: 41200 },
  { date: 'Aug 03', revenue: 39800, transactions: 108, baseline: 39800 },
  { date: 'Aug 05', revenue: 44500, transactions: 125, baseline: 44500 },
  { date: 'Aug 07', revenue: 36200, transactions: 98, baseline: 36200 },
  { date: 'Aug 09', revenue: 38100, transactions: 102, baseline: 38100 },
  { date: 'Aug 11', revenue: 32400, transactions: 88, baseline: 32400 },
  { date: 'Aug 13', revenue: 31000, transactions: 84, baseline: 31000 },
  { date: 'Aug 15', revenue: 46800, transactions: 132, baseline: 46800 },
  { date: 'Aug 17', revenue: 39400, transactions: 106, baseline: 39400 },
  { date: 'Aug 19', revenue: 34100, transactions: 91, baseline: 34100 },
  { date: 'Aug 20', revenue: 35800, transactions: 96, baseline: 35800 }
];

export const CUSTOMER_SEGMENTS = [
  {
    id: 'vip',
    name: 'VIP Champions',
    count: 42,
    percent: 3.4,
    avgLTV: 18450,
    churnRisk: 'Low (8%)',
    color: '#10b981',
    description: 'High-frequency buyers with ₹15,000+ total spend.'
  },
  {
    id: 'active',
    name: 'Active Loyalists',
    count: 156,
    percent: 12.6,
    avgLTV: 6800,
    churnRisk: 'Low (14%)',
    color: '#3b82f6',
    description: 'Regular shoppers making at least 1 purchase every 30 days.'
  },
  {
    id: 'at_risk',
    name: 'At-Risk High Value',
    count: 71,
    percent: 5.7,
    avgLTV: 8900,
    churnRisk: 'High (68%)',
    color: '#f59e0b',
    description: 'Formerly frequent customers who have not bought in 45+ days.'
  },
  {
    id: 'inactive',
    name: 'Dormant Inactive',
    count: 43,
    percent: 3.5,
    avgLTV: 4200,
    churnRisk: 'Critical (84%)',
    color: '#f43f5e',
    description: 'High lifetime value, zero activity in 60+ days.'
  }
];

export const DISCOVERED_OPPORTUNITIES = [
  {
    id: 'opp-1',
    title: 'Re-engage 43 High-Value Inactive Customers',
    impact: 'HIGH',
    category: 'Retention',
    potentialRevenue: 18400,
    confidence: 87,
    effort: 'Low',
    risk: 'Low',
    affectedCustomers: 43,
    description: 'Send personalized 10-15% comeback incentive via WhatsApp & Email before customer churn becomes permanent.',
    suggestedAction: 'Offer 15% Comeback Discount on top product categories.'
  },
  {
    id: 'opp-2',
    title: 'Bundle Best-Sellers (Product A + Product B)',
    impact: 'MEDIUM',
    category: 'AOV Expansion',
    potentialRevenue: 12700,
    confidence: 89,
    effort: 'Medium',
    risk: 'Low',
    affectedCustomers: 180,
    description: 'Pair Wireless Earbuds (Product A) with Protective Leather Case (Product B) for a combined 12% saving.',
    suggestedAction: 'Create cross-sell popover on product checkout.'
  },
  {
    id: 'opp-3',
    title: 'Weekend Flash Campaign for Active Segment',
    impact: 'HIGH',
    category: 'Revenue Velocity',
    potentialRevenue: 16700,
    confidence: 84,
    effort: 'Low',
    risk: 'Medium',
    affectedCustomers: 310,
    description: 'Historical data shows 3.2x higher conversion on Saturday evening broadcasts between 6 PM - 9 PM.',
    suggestedAction: 'Schedule automated Saturday 6:00 PM promo nudge.'
  }
];

export const PRODUCTS_CATALOG = [
  { id: 'p1', name: 'SonicBuds Pro Wireless', salesCount: 840, price: 2499, margin: 42, growthTrend: '+18%' },
  { id: 'p2', name: 'Protective Leather Case', salesCount: 620, price: 799, margin: 68, growthTrend: '+8%' },
  { id: 'p3', name: 'UltraSync Smartband v2', salesCount: 410, price: 3999, margin: 35, growthTrend: '-5%' },
  { id: 'p4', name: 'Magnetic Fast Charger 65W', salesCount: 950, price: 1299, margin: 55, growthTrend: '+24%' }
];
