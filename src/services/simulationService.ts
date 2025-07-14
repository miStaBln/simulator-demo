
import { SimulationResult, TimeSeriesData, ResultsData } from '@/types/simulation';
import { buildSimulationPayload } from '@/utils/simulationPayloadBuilder';
import { processTimeSeriesData, processResultsData } from '@/utils/simulationDataProcessor';
import { DUMMY_SIMULATION_RESULT } from '@/data/dummySimulationData';

export class SimulationService {
  private static readonly EQUITY_API_URL = "http://test-32.gde.nbg.solactive.com:8274/index-simulator-equity/proxy/v3/simulateEquityIndexSimple";
  private static readonly BOND_API_URL = "http://test-32.gde.nbg.solactive.com:8274/index-simulator-equity/proxy/v3/simulateBondIndexSimple";
  private static simulationResult: SimulationResult | null = null;
  private static currentIndexFamily: string | null = null;

  static async runSimulation(
    startDate: string,
    endDate: string,
    currency: string,
    returnType: string,
    divisor: string,
    indexFamily: string,
    identifierType: string,
    referenceIndexId: string,
    stocks: any[],
    caHandlingOptions: any,
    priceOverrides: any[],
    initialLevel: string,
    previousRebalancingIndexValue: string,
    rebalancings: any[]
  ): Promise<SimulationResult> {
    try {
      // Store the current index family for bond detection
      SimulationService.currentIndexFamily = indexFamily;
      
      // Determine if this is a bond index
      const isBondIndex = indexFamily === 'BOND_DEFAULT' || indexFamily === 'BOND_BASEMARKETVALUE';
      const apiUrl = isBondIndex ? SimulationService.BOND_API_URL : SimulationService.EQUITY_API_URL;
      
      // Build the simulation payload
      const payload = buildSimulationPayload(
        startDate,
        endDate,
        currency,
        returnType,
        divisor,
        indexFamily,
        identifierType,
        referenceIndexId,
        stocks,
        caHandlingOptions,
        priceOverrides,
        initialLevel,
        previousRebalancingIndexValue,
        rebalancings
      );

      console.log('Calling simulation API with payload:', JSON.stringify(payload, null, 2));

      // Make the actual API call
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Simulation API response:', result);
      
      // Store the result
      SimulationService.simulationResult = result;
      
      return result;
    } catch (error) {
      console.error('Simulation failed:', error);
      // Fall back to dummy data in case of API failure
      console.log('Falling back to dummy data due to API error');
      SimulationService.simulationResult = DUMMY_SIMULATION_RESULT;
      return DUMMY_SIMULATION_RESULT;
    }
  }

  static getTimeSeriesData(): TimeSeriesData[] {
    if (!SimulationService.simulationResult) {
      return [];
    }
    return processTimeSeriesData(SimulationService.simulationResult);
  }

  static getResultsData(date: string, stateType: 'closing' | 'opening' = 'closing'): ResultsData[] {
    if (!SimulationService.simulationResult) {
      return [];
    }
    return processResultsData(SimulationService.simulationResult, date, stateType);
  }

  static getSimulationResult(): SimulationResult | null {
    return SimulationService.simulationResult;
  }

  static clearResults(): void {
    SimulationService.simulationResult = null;
    SimulationService.currentIndexFamily = null;
  }

  static isBondIndex(): boolean {
    return SimulationService.currentIndexFamily === 'BOND_DEFAULT' || 
           SimulationService.currentIndexFamily === 'BOND_BASEMARKETVALUE';
  }
}
