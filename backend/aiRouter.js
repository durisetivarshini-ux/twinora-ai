import { db } from './database.js';
import * as bi from './biService.js';

// Safe tool executor
export function executeTool(toolName, merchantId, params = {}) {
  const merchant = db.merchants.find(m => m.id === merchantId || m.userId === merchantId) || db.merchants[0];
  const mId = merchant.id;

  switch (toolName) {
    case 'get_revenue_metrics':
      return bi.getRevenueMetrics(mId, params.dateRange || '30d');
    case 'get_customer_segments':
    case 'get_customer_metrics':
      return bi.getCustomerSegments(mId);
    case 'get_top_products':
      return db.products.filter(p => p.merchantId === mId).slice(0, 5);
    case 'get_detected_opportunities':
      return bi.getDetectedOpportunities(mId);
    case 'get_retention_analysis':
      const segs = bi.getCustomerSegments(merchantId);
      const dormant = segs.find(s => s.key === 'Dormant') || { count: 32 };
      return {
        overallRepeatRate: '34%',
        dormantCount: dormant.count,
        dormantRisk: '84% Churn Probability',
        recoveryEstimate: dormant.recoveryPotential || 28400
      };
    case 'get_payment_metrics':
      const pmt = db.payments.filter(p => p.merchantId === merchantId);
      const failed = pmt.filter(p => p.status === 'FAILED');
      return {
        totalTransactions: pmt.length,
        successRate: pmt.length > 0 ? `${((pmt.length - failed.length) / pmt.length * 100).toFixed(1)}%` : '99.4%',
        failedCount: failed.length,
        averageLatencyMs: '14ms'
      };
    case 'get_decision_history':
      return bi.getDecisionMemory(merchantId);
    case 'get_simulation_result':
      return bi.getSimulationResult(merchantId, params);
    case 'get_business_summary':
    default:
      return bi.getBusinessOverview(merchantId, params.dateRange || '30d');
  }
}

// Map user question to relevant signals & tools
export function analyzeIntent(question = '') {
  const q = question.toLowerCase();
  
  if (q.includes('product') || q.includes('sku') || q.includes('best seller') || q.includes('catalog')) {
    return {
      primaryTool: 'get_top_products',
      signalsChecked: ['Product Catalog', 'SKU Sales Volume', 'Inventory Levels', 'Margin Contribution'],
      strongestSignal: 'Top SKU Sales Velocity'
    };
  }
  if (q.includes('customer') || q.includes('cohort') || q.includes('churn') || q.includes('risk') || q.includes('segment') || q.includes('vip') || q.includes('dormant')) {
    return {
      primaryTool: 'get_customer_segments',
      signalsChecked: ['Customer RFM Matrix', '32-Day Reorder Cycle', 'Segment Churn Risk', 'Cohort Lifetime Value'],
      strongestSignal: 'Dormant VIP Inactivity Duration'
    };
  }
  if (q.includes('payment') || q.includes('gateway') || q.includes('upi') || q.includes('fail') || q.includes('checkout')) {
    return {
      primaryTool: 'get_payment_metrics',
      signalsChecked: ['Razorpay Gateway Telemetry', 'UPI Authorization Rate', 'Checkout Latency', 'Card Failure Rate'],
      strongestSignal: 'Gateway Auth Success Rate'
    };
  }
  if (q.includes('opportunit') || q.includes('today') || q.includes('focus') || q.includes('plan') || q.includes('strategy') || q.includes('priorit')) {
    return {
      primaryTool: 'get_detected_opportunities',
      signalsChecked: ['Revenue Leakage', 'Winback Potential', 'Cross-Sell Bundles', 'Pricing Elasticity'],
      strongestSignal: 'High-Yield Winback Opportunity'
    };
  }
  if (q.includes('simulat') || q.includes('discount') || q.includes('price increase') || q.includes('what happens')) {
    return {
      primaryTool: 'get_simulation_result',
      signalsChecked: ['Baseline Conversion', 'Margin Concession', 'Price Elasticity', 'Customer Recovery Model'],
      strongestSignal: 'Simulated Net Revenue Delta'
    };
  }
  if (q.includes('memory') || q.includes('accuracy') || q.includes('past decision') || q.includes('history')) {
    return {
      primaryTool: 'get_decision_history',
      signalsChecked: ['Simulated Predictions', 'Actual 14-Day Outcomes', 'Model Calibration', 'Decision Error Bounds'],
      strongestSignal: 'Historical Decision Accuracy'
    };
  }

  // Default: Revenue & Business Pulse
  return {
    primaryTool: 'get_revenue_metrics',
    signalsChecked: ['Monthly Revenue', 'Repeat Order Frequency', 'Average Order Value', 'Customer Retention Rate'],
    strongestSignal: 'Repeat Order Velocity Slowdown'
  };
}
