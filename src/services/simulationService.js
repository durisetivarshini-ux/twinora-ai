// MerchantTwin Simulation Engine
// Performs deterministic financial modelling based on customer elasticity, AOV, and margin assumptions.

export function runSimulation({
  discountPct = 0,
  priceChangePct = 0,
  bundleDiscount = 0,
  targetSegment = 'inactive',
  campaignType = 'discount',
  durationDays = 7,
  customPrompt = ''
}) {
  const BASELINE = {
    revenue: 124500,
    orders: 146,
    conversionRate: 4.8,
    aov: 852,
    retentionRate: 72,
    marginRate: 45
  };

  let targetCohortSize = 43; // Inactive cohort by default
  let baseElasticity = 1.6; // High responsiveness for discounts

  if (targetSegment === 'vip') {
    targetCohortSize = 42;
    baseElasticity = 0.9;
  } else if (targetSegment === 'active') {
    targetCohortSize = 156;
    baseElasticity = 1.2;
  } else if (targetSegment === 'at_risk') {
    targetCohortSize = 71;
    baseElasticity = 1.4;
  } else if (targetSegment === 'all') {
    targetCohortSize = 1240;
    baseElasticity = 1.1;
  }

  // Calculate effects
  let predictedOrdersDelta = 0;
  let simulatedAov = BASELINE.aov;
  let simulatedConversion = BASELINE.conversionRate;
  let simulatedRetention = BASELINE.retentionRate;
  let riskLevel = 'Low';
  let confidenceScore = 88;

  if (campaignType === 'discount' || discountPct > 0) {
    const effectiveDisc = discountPct || 15;
    // Higher discount -> more orders, but lower margin & diminishing returns
    const orderBoostPct = (effectiveDisc * baseElasticity * 0.95);
    predictedOrdersDelta = Math.round(targetCohortSize * (orderBoostPct / 100));
    simulatedAov = Math.round(BASELINE.aov * (1 - (effectiveDisc * 0.3) / 100));
    simulatedConversion = Number((BASELINE.conversionRate + (effectiveDisc * 0.12)).toFixed(1));
    simulatedRetention = Math.min(94, Math.round(BASELINE.retentionRate + (effectiveDisc * 0.25)));

    if (effectiveDisc > 20) {
      riskLevel = 'High';
      confidenceScore = 76;
    } else if (effectiveDisc > 12) {
      riskLevel = 'Medium';
      confidenceScore = 84;
    }
  } else if (campaignType === 'price_increase' || priceChangePct > 0) {
    const effectiveInc = priceChangePct || 5;
    // Price hike -> higher AOV, slightly reduced order volume
    predictedOrdersDelta = -Math.round(targetCohortSize * (effectiveInc * 0.3 / 100));
    simulatedAov = Math.round(BASELINE.aov * (1 + (effectiveInc / 100)));
    simulatedConversion = Number(Math.max(2.1, BASELINE.conversionRate - (effectiveInc * 0.1)).toFixed(1));
    simulatedRetention = Math.max(50, BASELINE.retentionRate - Math.round(effectiveInc * 0.4));
    riskLevel = 'Medium';
    confidenceScore = 86;
  } else if (campaignType === 'bundle' || bundleDiscount > 0) {
    const effectiveBundleDisc = bundleDiscount || 12;
    // Bundling -> higher AOV, higher conversion, low risk
    predictedOrdersDelta = Math.round(targetCohortSize * 0.35);
    simulatedAov = Math.round(BASELINE.aov * 1.14); // Cross sell boosts total cart
    simulatedConversion = Number((BASELINE.conversionRate + 1.1).toFixed(1));
    simulatedRetention = Math.min(96, BASELINE.retentionRate + 4);
    riskLevel = 'Low';
    confidenceScore = 89;
  } else if (campaignType === 'flash_sale') {
    predictedOrdersDelta = Math.round(targetCohortSize * 0.45);
    simulatedAov = Math.round(BASELINE.aov * 0.92);
    simulatedConversion = Number((BASELINE.conversionRate + 1.4).toFixed(1));
    simulatedRetention = Math.min(90, BASELINE.retentionRate + 3);
    riskLevel = 'Medium';
    confidenceScore = 83;
  }

  const totalSimulatedOrders = BASELINE.orders + Math.max(-10, predictedOrdersDelta);
  const simulatedRevenue = Math.round(totalSimulatedOrders * simulatedAov);
  const revenueDelta = simulatedRevenue - BASELINE.revenue;
  const revenueDeltaPct = Number(((revenueDelta / BASELINE.revenue) * 100).toFixed(1));

  // Time-series breakdown for comparison chart
  const timeSeriesComparison = [
    { day: 'Day 1', baseline: Math.round(BASELINE.revenue / 7 * 0.9), simulated: Math.round(simulatedRevenue / 7 * 0.85) },
    { day: 'Day 2', baseline: Math.round(BASELINE.revenue / 7 * 0.95), simulated: Math.round(simulatedRevenue / 7 * 1.1) },
    { day: 'Day 3', baseline: Math.round(BASELINE.revenue / 7 * 1.05), simulated: Math.round(simulatedRevenue / 7 * 1.3) },
    { day: 'Day 4', baseline: Math.round(BASELINE.revenue / 7 * 1.0), simulated: Math.round(simulatedRevenue / 7 * 1.25) },
    { day: 'Day 5', baseline: Math.round(BASELINE.revenue / 7 * 1.1), simulated: Math.round(simulatedRevenue / 7 * 1.15) },
    { day: 'Day 6', baseline: Math.round(BASELINE.revenue / 7 * 0.98), simulated: Math.round(simulatedRevenue / 7 * 1.05) },
    { day: 'Day 7', baseline: Math.round(BASELINE.revenue / 7 * 1.02), simulated: Math.round(simulatedRevenue / 7 * 1.0) },
  ];

  return {
    isPrototypeSimulation: true,
    scenarioTitle: customPrompt || `Simulation (${campaignType} - ${targetSegment})`,
    targetCohortSize,
    baseline: BASELINE,
    simulated: {
      revenue: simulatedRevenue,
      orders: totalSimulatedOrders,
      conversionRate: simulatedConversion,
      aov: simulatedAov,
      retentionRate: simulatedRetention,
    },
    deltas: {
      revenueDelta,
      revenueDeltaPct: (revenueDeltaPct >= 0 ? `+${revenueDeltaPct}%` : `${revenueDeltaPct}%`),
      ordersDelta: predictedOrdersDelta,
      conversionDelta: (simulatedConversion - BASELINE.conversionRate).toFixed(1),
      aovDelta: simulatedAov - BASELINE.aov,
      retentionDelta: simulatedRetention - BASELINE.retentionRate
    },
    risk: riskLevel,
    confidence: confidenceScore,
    aiRationale: `The MerchantTwin model predicts customers in the ${targetSegment.toUpperCase()} cohort exhibit strong price responsiveness. Applying this campaign projects an additional ${predictedOrdersDelta} transactions with an estimated ${revenueDelta >= 0 ? 'net gain' : 'net loss'} of ₹${Math.abs(revenueDelta).toLocaleString('en-IN')}.`,
    factors: [
      { factor: 'Historical Cohort Elasticity', impact: '+4.2%' },
      { factor: 'Average Cart Size Impact', impact: `${simulatedAov - BASELINE.aov >= 0 ? '+' : ''}₹${simulatedAov - BASELINE.aov}` },
      { factor: 'Churn Rate Mitigation', impact: `-${Math.abs(simulatedRetention - BASELINE.retentionRate)}% Churn` }
    ],
    timeSeriesComparison
  };
}
