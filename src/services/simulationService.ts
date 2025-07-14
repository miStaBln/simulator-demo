interface SimulationPayload {
  simulationStart: string;
  simulationEnd: string;
  priceHistory: {
    instrumentPrices: any[];
  };
  indexProperties: {
    initialIndexLevel: {
      value: number;
    };
    previousIndexValue: {
      value: number;
    };
    previousRebalancingIndexValue: {
      value: number;
    };
    coreIndexData: {
      name: string;
      identifiers: Array<{
        assetClass: string;
        identifierType: string;
        id: string;
      }>;
      family: string;
      type: string;
      currency: string;
      ignoreFx: boolean;
    };
    caHandlingConfiguration?: {
      enableCaHandling: boolean;
      cashDividendTaxHandling: string;
      specialDividendTaxHandling: string;
      considerStockDividend: boolean;
      considerStockSplit: boolean;
      considerRightsIssue: boolean;
      considerRightsIssueToCashComponent: boolean;
      considerCapitalDecrease: boolean;
      cashDividendTax: number;
      specialDividendTax: number;
      corporateActionHandling: string;
      useWeightNeutralRightsIssue: boolean;
      useWeightNeutralCapitalDecrease: boolean;
      franking: string;
      pid: string;
      reit: string;
      returnOfCapital: string;
      interestOnCapital: string;
      nzInvestorType: string;
      auInvestorType: string;
      considerDividendFee: boolean;
      drDividendTreatment: string;
      globalDrTaxRate: number;
    };
    taxRates: any[];
  };
  composition: {
    clusters: Array<{
      name: string;
      constituents: Array<any>;
    }>;
    additionalNumbers?: {
      divisor: number;
    };
  };
  caModificationChain: {
    caModificationInitialization: string;
    rules: any[];
  };
  resultIdentifierType: string;
  selectionResults: Array<{
    fixingDate: string;
    effectiveOpenDates: string[];
    adaptionType: string;
    clusters: Array<{
      name: string;
      constituents: Array<any>;
    }>;
    additionalParameters: {
      weightingType: string;
    };
  }>;
  rebalancingAdaptions?: Array<{
    adaptionBaseData: {
      adaptionType: string;
      effectiveDates: string[];
    };
    constituents: Array<{
      assetIdentifier: {
        assetClass: string;
        identifierType: string;
        id: string;
      };
      quantity: {
        type: string;
        value: number;
      };
      additionalNumbers: {
        weightingCapFactor: number;
      };
    }>;
  }>;
}

interface SimulationResult {
  [date: string]: {
    simulationDate: string;
    closingIndexState: {
      composition: {
        clusters: Array<{
          name: string;
          constituents: Array<{
            assetIdentifier: {
              assetClass: string;
              identifierType: string;
              id: string;
            };
            quantity: {
              type: string;
              value: number;
            };
            additionalNumbers: {
              freeFloatFactor: number;
              weightingCapFactor: number;
            };
          }>;
        }>;
        additionalNumbers: {
          divisor: number;
        };
      };
      indexStateEvaluationDto: {
        indexLevel: number;
        clusters: Array<{
          name: string;
          prices: Array<{
            instrumentKey: {
              assetClass: string;
              identifierType: string;
              id: string;
            };
            price: number;
          }>;
        }>;
      };
    };
    openingIndexState: {
      composition: {
        clusters: Array<{
          name: string;
          constituents: Array<{
            assetIdentifier: {
              assetClass: string;
              identifierType: string;
              id: string;
            };
            quantity: {
              type: string;
              value: number;
            };
            additionalNumbers: {
              freeFloatFactor: number;
              weightingCapFactor: number;
            };
          }>;
        }>;
        additionalNumbers: {
          divisor: number;
        };
      };
      indexStateEvaluationDto: {
        indexLevel: number;
        clusters: Array<{
          name: string;
          prices: Array<{
            instrumentKey: {
              assetClass: string;
              identifierType: string;
              id: string;
            };
            price: number;
          }>;
        }>;
      };
    };
  };
}

interface TimeSeriesData {
  date: string;
  indexLevel: number;
  divisor: number;
}

interface ResultsData {
  ric: string;
  cas: string;
  quantity: string;
  price: string;
  currency: string;
  fx: string;
}

export class SimulationService {
  private static readonly EQUITY_API_URL = "http://test-32.gde.nbg.solactive.com:8274/index-simulator-equity/proxy/v3/simulateEquityIndexSimple";
  private static readonly BOND_API_URL = "http://test-32.gde.nbg.solactive.com:8274/index-simulator-equity/proxy/v3/simulateBondIndexSimple";
  private static simulationResult: SimulationResult | null = null;
  private static currentIndexFamily: string | null = null;

  // Updated dummy data to match the new structure
  private static readonly DUMMY_SIMULATION_RESULT: SimulationResult = {
    "2025-04-11": {
      "simulationDate": "2025-04-11",
      "closingIndexState": {
        "composition": {
          "clusters": [
            {
              "name": "1a91c2f7-deca-4d33-9383-87bec8049b8d",
              "constituents": [
                {
                  "assetIdentifier": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "MSFT.OQ"
                  },
                  "quantity": {
                    "type": "UNITS",
                    "value": 8000
                  },
                  "additionalNumbers": {
                    "freeFloatFactor": 1,
                    "weightingCapFactor": 1
                  }
                },
                {
                  "assetIdentifier": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "GOOGL.OQ"
                  },
                  "quantity": {
                    "type": "UNITS",
                    "value": 5000
                  },
                  "additionalNumbers": {
                    "freeFloatFactor": 1,
                    "weightingCapFactor": 1
                  }
                },
                {
                  "assetIdentifier": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "AAPL.OQ"
                  },
                  "quantity": {
                    "type": "UNITS",
                    "value": 10000
                  },
                  "additionalNumbers": {
                    "freeFloatFactor": 1,
                    "weightingCapFactor": 1
                  }
                }
              ]
            }
          ],
          "additionalNumbers": {
            "divisor": 100000
          }
        },
        "indexStateEvaluationDto": {
          "indexLevel": 58.748000000000005,
          "clusters": [
            {
              "name": "NONE",
              "prices": [
                {
                  "instrumentKey": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "MSFT.OQ"
                  },
                  "price": 388.45
                },
                {
                  "instrumentKey": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "AAPL.OQ"
                  },
                  "price": 198.15
                },
                {
                  "instrumentKey": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "GOOGL.OQ"
                  },
                  "price": 157.14
                }
              ]
            }
          ]
        }
      },
      "openingIndexState": {
        "composition": {
          "clusters": [
            {
              "name": "1a91c2f7-deca-4d33-9383-87bec8049b8d",
              "constituents": [
                {
                  "assetIdentifier": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "MSFT.OQ"
                  },
                  "quantity": {
                    "type": "UNITS",
                    "value": 8000
                  },
                  "additionalNumbers": {
                    "freeFloatFactor": 1,
                    "weightingCapFactor": 1
                  }
                },
                {
                  "assetIdentifier": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "GOOGL.OQ"
                  },
                  "quantity": {
                    "type": "UNITS",
                    "value": 5000
                  },
                  "additionalNumbers": {
                    "freeFloatFactor": 1,
                    "weightingCapFactor": 1
                  }
                },
                {
                  "assetIdentifier": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "AAPL.OQ"
                  },
                  "quantity": {
                    "type": "UNITS",
                    "value": 10000
                  },
                  "additionalNumbers": {
                    "freeFloatFactor": 1,
                    "weightingCapFactor": 1
                  }
                }
              ]
            }
          ],
          "additionalNumbers": {
            "divisor": 100000
          }
        },
        "indexStateEvaluationDto": {
          "indexLevel": 58.748000000000005,
          "clusters": [
            {
              "name": "NONE",
              "prices": [
                {
                  "instrumentKey": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "AAPL.OQ"
                  },
                  "price": 198.15
                },
                {
                  "instrumentKey": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "MSFT.OQ"
                  },
                  "price": 388.45
                },
                {
                  "instrumentKey": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "GOOGL.OQ"
                  },
                  "price": 157.14
                }
              ]
            }
          ]
        }
      }
    }
  };
  private static buildCAHandlingBondDefault(){
    return {
        enableCaHandling: true,
        corporateActionHandling: "BOND_DELETION_MAT_CALL"
    };
  }
  private static buildCAHandlingDefault(returnType: string) {
    let taxTypeCashDiv = 'USE_WITH_TAX';
    let taxTypeSpecialDiv = 'USE_WITH_TAX';

    if (returnType === "GTR") {
      taxTypeCashDiv = 'USE_WITHOUT_TAX';
      taxTypeSpecialDiv = 'USE_WITHOUT_TAX';
    }

    if (returnType === "PR") {
      taxTypeCashDiv = 'NONE';
    }

    return {
      enableCaHandling: true,
      cashDividendTaxHandling: taxTypeCashDiv,
      specialDividendTaxHandling: taxTypeSpecialDiv,
      considerStockDividend: true,
      considerStockSplit: true,
      considerRightsIssue: true,
      considerRightsIssueToCashComponent: false,
      considerCapitalDecrease: true,
      cashDividendTax: 0,
      specialDividendTax: 0,
      corporateActionHandling: 'START_OF_DAY',
      useWeightNeutralRightsIssue: false,
      useWeightNeutralCapitalDecrease: false,
      franking: "NO_ADJUSTMENT",
      pid: "NO_ADJUSTMENT",
      reit: "NO_ADJUSTMENT",
      returnOfCapital: "NO_ADJUSTMENT",
      interestOnCapital: "NO_ADJUSTMENT",
      nzInvestorType: "LOCAL_NO_IMPUTATION",
      auInvestorType: "LOCAL_NO_IMPUTATION",
      considerDividendFee: true,
      drDividendTreatment: 'DEFAULT',
      globalDrTaxRate: 0
    };
  }

  static getResultsData(date: string, stateType: 'closing' | 'opening' = 'closing'): ResultsData[] {
    if (!SimulationService.simulationResult) {
      return [];
    }

    // Handle both old dummy format and new API format
    const simulationData = SimulationService.simulationResult.simulations || SimulationService.simulationResult;
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
        if (constituent.additionalNumbers?.baseMarketValue) {
          result.baseMarketValue = constituent.additionalNumbers.baseMarketValue.toString();
        }

        // Add cash objects - restore this functionality
        if (constituent.cashes && constituent.cashes.length > 0) {
          result.cashes = constituent.cashes.map((cash: any) => ({
            value: cash.value || 0,
            type: cash.type || '',
            date: cash.date || null
          }));
        }

        // Add cash flows
        if (constituent.cashFlows && constituent.cashFlows.length > 0) {
          result.cashFlows = constituent.cashFlows.map((flow: any) => ({
            value: flow.value?.value || 0,
            labels: flow.labels || []
          }));
        }

        // Add composition entered date
        if (constituent.dates?.compositionEnteredAt?.date) {
          result.compositionEnteredAt = constituent.dates.compositionEnteredAt.date;
        }

        // Add composition left date
        if (constituent.dates?.compositionLeftAt?.date) {
          result.compositionLeftAt = constituent.dates.compositionLeftAt.date;
        }
      }
      
      return result;
    });
  }

  static getSimulationResult(): SimulationResult | null {
    return SimulationService.simulationResult;
  }

  private static formatDateForDisplay(dateStr: string): string {
    // Convert from YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
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
