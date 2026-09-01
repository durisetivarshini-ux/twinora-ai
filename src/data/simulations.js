// Simulation lab scenarios and defaults

export const PRESET_SIMULATION_SCENARIOS = [
  {
    id: 'scen-inactive-15',
    title: 'Offer 15% discount to 43 inactive customers',
    promptText: 'Offer 15% discount to inactive customers',
    category: 'Retention',
    discountPct: 15,
    targetSegment: 'inactive',
    segmentSize: 43,
    campaignType: 'discount',
    priceChangePct: 0,
    bundleDiscount: 0,
    durationDays: 7,
    baselineRevenue: 124500,
    baselineConversion: 4.8,
    baselineAOV: 850,
    baselineRetention: 72
  },
  {
    id: 'scen-price-5',
    title: 'Increase SonicBuds Pro price by 5%',
    promptText: 'Increase Product A price by 5%',
    category: 'Margin Optimization',
    discountPct: 0,
    targetSegment: 'all',
    segmentSize: 1240,
    campaignType: 'price_increase',
    priceChangePct: 5,
    bundleDiscount: 0,
    durationDays: 30,
    baselineRevenue: 124500,
    baselineConversion: 4.8,
    baselineAOV: 850,
    baselineRetention: 72
  },
  {
    id: 'scen-bundle-cross',
    title: 'Bundle SonicBuds Pro + Leather Case (12% off)',
    promptText: 'Create a product bundle',
    category: 'AOV Expansion',
    discountPct: 0,
    targetSegment: 'active',
    segmentSize: 156,
    campaignType: 'bundle',
    priceChangePct: 0,
    bundleDiscount: 12,
    durationDays: 14,
    baselineRevenue: 124500,
    baselineConversion: 4.8,
    baselineAOV: 850,
    baselineRetention: 72
  },
  {
    id: 'scen-weekend-flash',
    title: 'Run a 24-hour weekend flash campaign',
    promptText: 'Run a weekend promotion',
    category: 'Revenue Velocity',
    discountPct: 10,
    targetSegment: 'at_risk',
    segmentSize: 71,
    campaignType: 'flash_sale',
    priceChangePct: 0,
    bundleDiscount: 0,
    durationDays: 2,
    baselineRevenue: 124500,
    baselineConversion: 4.8,
    baselineAOV: 850,
    baselineRetention: 72
  }
];

export const STRATEGY_COMPARISON_MATRIX = [
  {
    id: 'strat-10-disc',
    name: '10% Comeback Discount',
    revenueImpact: 6200,
    revenueImpactPct: 5.0,
    conversion: 5.1,
    conversionDelta: '+0.3%',
    risk: 'Low',
    confidence: 89,
    marginImpact: '-1.8%',
    affectedCustomers: 43
  },
  {
    id: 'strat-15-disc',
    name: '15% Comeback Discount',
    revenueImpact: 9400,
    revenueImpactPct: 7.5,
    conversion: 5.6,
    conversionDelta: '+0.8%',
    risk: 'Medium',
    confidence: 84,
    marginImpact: '-3.2%',
    affectedCustomers: 43
  },
  {
    id: 'strat-bundle-opt',
    name: 'Product Bundle (Earbuds + Case)',
    revenueImpact: 11100,
    revenueImpactPct: 8.9,
    conversion: 5.8,
    conversionDelta: '+1.0%',
    risk: 'Low',
    confidence: 87,
    marginImpact: '+2.4%',
    affectedCustomers: 180,
    isRecommended: true,
    recommendationReason: 'Highest predicted net profit with lower margin erosion risk.'
  }
];
