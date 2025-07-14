
import { SimulationResult, TimeSeriesData, ResultsData } from '@/types/simulation';

export function processTimeSeriesData(simulationResult: SimulationResult): TimeSeriesData[] {
  const timeSeriesData: TimeSeriesData[] = [];
  
  // Handle both old dummy format and new API format
  const simulationData = (simulationResult as any).simulations || simulationResult;
  
  Object.keys(simulationData).forEach(date => {
    const dayData = simulationData[date];
    if (dayData && dayData.closingIndexState) {
      timeSeriesData.push({
        date: date,
        indexLevel: dayData.closingIndexState.indexStateEvaluationDto?.indexLevel || 0,
        divisor: dayData.closingIndexState.composition?.additionalNumbers?.divisor || 0
      });
    }
  });

  // Sort by date
  return timeSeriesData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function processResultsData(
  simulationResult: SimulationResult,
  date: string,
  stateType: 'closing' | 'opening' = 'closing'
): ResultsData[] {
  // Handle both old dummy format and new API format
  const simulationData = (simulationResult as any).simulations || simulationResult;
  if (!simulationData[date]) {
    return [];
  }

  const dayData = simulationData[date];
  const state = stateType === 'closing' ? dayData.closingIndexState : dayData.openingIndexState;
  
  // Return empty array if state is null or missing required data
  if (!state || !state.composition || !state.indexStateEvaluationDto) {
    return [];
  }
  
  // Get constituents from composition
  const constituents = state.composition.clusters?.flatMap(cluster => cluster.constituents) || [];
  
  // Get prices from evaluation data
  const prices = state.indexStateEvaluationDto.clusters?.flatMap(cluster => cluster.prices) || [];
  
  // Combine quantity and price data
  return constituents.map(constituent => {
    const priceData = prices.find(price => 
      price.instrumentKey.id === constituent.assetIdentifier.id
    );
    
    // Check if this is a bond constituent based on asset class
    const isBond = constituent.assetIdentifier?.assetClass === 'BOND';
    
    const result: any = {
      ric: constituent.assetIdentifier.id,
      cas: '',
      quantity: constituent.quantity.value.toString(),
      price: priceData ? priceData.price.toString() : '0',
      currency: '',
      fx: ''
    };

    // Add bond-specific fields if this is a bond
    if (isBond) {
      // Add additional numbers
      if (constituent.additionalNumbers?.weightingCapFactor) {
        result.weightingCapFactor = constituent.additionalNumbers.weightingCapFactor.toString();
      }
      if ((constituent.additionalNumbers as any)?.baseMarketValue) {
        result.baseMarketValue = (constituent.additionalNumbers as any).baseMarketValue.toString();
      }

      // Add cash objects - restore this functionality
      if ((constituent as any).cashes && (constituent as any).cashes.length > 0) {
        result.cashes = (constituent as any).cashes.map((cash: any) => ({
          value: cash.value || 0,
          type: cash.type || '',
          date: cash.date || null
        }));
      }

      // Add cash flows
      if ((constituent as any).cashFlows && (constituent as any).cashFlows.length > 0) {
        result.cashFlows = (constituent as any).cashFlows.map((flow: any) => ({
          value: flow.value?.value || 0,
          labels: flow.labels || []
        }));
      }

      // Add composition entered date
      if ((constituent as any).dates?.compositionEnteredAt?.date) {
        result.compositionEnteredAt = (constituent as any).dates.compositionEnteredAt.date;
      }

      // Add composition left date
      if ((constituent as any).dates?.compositionLeftAt?.date) {
        result.compositionLeftAt = (constituent as any).dates.compositionLeftAt.date;
      }
    }
    
    return result;
  });
}
