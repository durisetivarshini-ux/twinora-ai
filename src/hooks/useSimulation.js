import { useState, useCallback } from 'react';
import { runSimulation } from '../services/simulationService';
import { PRESET_SIMULATION_SCENARIOS } from '../data/simulations';

export function useSimulation() {
  const [params, setParams] = useState({
    discountPct: 15,
    priceChangePct: 0,
    bundleDiscount: 0,
    targetSegment: 'inactive',
    campaignType: 'discount',
    durationDays: 7,
    customPrompt: ''
  });

  const [isRunning, setIsRunning] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('');
  const [result, setResult] = useState(() => runSimulation(params));
  const [activeScenarioId, setActiveScenarioId] = useState('scen-inactive-15');

  const executeSimulation = useCallback(async (customParams = null) => {
    const activeParams = customParams || params;
    setIsRunning(true);

    const steps = [
      'Loading MerchantTwin...',
      'Selecting relevant customer cohorts...',
      'Analyzing historical transaction behavior...',
      'Modeling price elasticity & conversion strategy...',
      'Estimating margin & revenue outcomes...',
      'Evaluating financial risk...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStepText(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    const simOutput = runSimulation(activeParams);
    setResult(simOutput);
    setIsRunning(false);
  }, [params]);

  const selectPresetScenario = useCallback((scenarioId) => {
    const found = PRESET_SIMULATION_SCENARIOS.find((s) => s.id === scenarioId);
    if (found) {
      setActiveScenarioId(scenarioId);
      const newParams = {
        discountPct: found.discountPct,
        priceChangePct: found.priceChangePct,
        bundleDiscount: found.bundleDiscount,
        targetSegment: found.targetSegment,
        campaignType: found.campaignType,
        durationDays: found.durationDays,
        customPrompt: found.promptText
      };
      setParams(newParams);
      executeSimulation(newParams);
    }
  }, [executeSimulation]);

  return {
    params,
    setParams,
    isRunning,
    currentStepText,
    result,
    executeSimulation,
    activeScenarioId,
    selectPresetScenario
  };
}
