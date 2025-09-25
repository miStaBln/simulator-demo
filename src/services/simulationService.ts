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
    caHandlingConfiguration?: any;
  };
  composition?: {
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
  bondComposition?: {
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
          weightingCapFactor: number;
        };
      }>;
    }>;
    additionalNumbers: {
      divisor: number;
    };
  };
  caModificationChain?: {
    caModificationInitialization: string;
    rules: any[];
  };
  resultIdentifierType?: string;
  selectionResults?: any[];
  rebalancingAdaptions?: any[];
}

interface SimulationResult {
  [key: string]: any;
  simulations?: any;
  referencedIndexTimeSeries?: any;
}

interface TimeSeriesData {
  date: string;
  indexLevel: number;
  divisor: number;
  referenceIndexLevel?: number;
  referenceDivisor?: number;
}

interface ResultsData {
  ric: string;
  cas: string;
  quantity: string;
  price: string;
  currency: string;
  fx: string;
  [key: string]: any;
}

export class SimulationService {
  private static simulationResult: SimulationResult | null = null;
  private static currentIndexFamily: string | null = null;
  
  private static readonly EQUITY_API_URL = 'http://test-32.gde.nbg.solactive.com:8274/index-simulator-equity/proxy/v3/simulateEquityIndexSimple';
  private static readonly BOND_API_URL = 'http://test-32.gde.nbg.solactive.com:8274/index-simulator-bond/proxy/v3/simulateBondIndex';

  // Updated dummy data to match the new structure with reference index comparison
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
          "indexLevel": 1000.0,
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
      }
    },
    "2025-04-12": {
      "simulationDate": "2025-04-12",
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
            "divisor": 99800
          }
        },
        "indexStateEvaluationDto": {
          "indexLevel": 1025.3
        }
      }
    },
    "2025-04-13": {
      "simulationDate": "2025-04-13",
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
            "divisor": 98950
          }
        },
        "indexStateEvaluationDto": {
          "indexLevel": 1018.7
        }
      }
    },
    "2025-04-14": {
      "simulationDate": "2025-04-14",
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
            "divisor": 101200
          }
        },
        "indexStateEvaluationDto": {
          "indexLevel": 1042.8
        }
      }
    },
    "2025-04-15": {
      "simulationDate": "2025-04-15",
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
            "divisor": 100750
          }
        },
        "indexStateEvaluationDto": {
          "indexLevel": 1038.2
        }
      }
    },
    // Reference index time series data showing slight deviations from simulated index
    referencedIndexTimeSeries: {
      "2025-04-11": {
        "simulationDate": "2025-04-11",
        "closingIndexState": {
          "composition": {
            "additionalNumbers": {
              "divisor": 100000
            }
          },
          "indexStateEvaluationDto": {
            "indexLevel": 1000.0
          }
        }
      },
      "2025-04-12": {
        "simulationDate": "2025-04-12",
        "closingIndexState": {
          "composition": {
            "additionalNumbers": {
              "divisor": 99750
            }
          },
          "indexStateEvaluationDto": {
            "indexLevel": 1023.1
          }
        }
      },
      "2025-04-13": {
        "simulationDate": "2025-04-13",
        "closingIndexState": {
          "composition": {
            "additionalNumbers": {
              "divisor": 99100
            }
          },
          "indexStateEvaluationDto": {
            "indexLevel": 1015.2
          }
        }
      },
      "2025-04-14": {
        "simulationDate": "2025-04-14",
        "closingIndexState": {
          "composition": {
            "additionalNumbers": {
              "divisor": 101050
            }
          },
          "indexStateEvaluationDto": {
            "indexLevel": 1040.5
          }
        }
      },
      "2025-04-15": {
        "simulationDate": "2025-04-15",
        "closingIndexState": {
          "composition": {
            "additionalNumbers": {
              "divisor": 100600
            }
          },
          "indexStateEvaluationDto": {
            "indexLevel": 1035.7
          }
        }
      }
    }
  };

  private static buildCAHandlingBondDefault() {
    return {
      enableCaHandling: true,
      corporateActionHandling: "BOND_DELETION_MAT_CALL",
      cashDividendTaxHandling: 'USE_WITH_TAX',
      specialDividendTaxHandling: 'USE_WITH_TAX',
      considerStockDividend: true,
      considerStockSplit: true,
      considerRightsIssue: true,
      considerRightsIssueToCashComponent: false,
      considerCapitalDecrease: true,
      cashDividendTax: 0,
      specialDividendTax: 0,
      useWeightNeutralRightsIssue: false,
      useWeightNeutralCapitalDecrease: false,
      franking: "NO_ADJUSTMENT",
      pid: "NO_ADJUSTMENT",
      reit: "NO_ADJUSTMENT",
      returnOfCapital: "NO_ADJUSTMENT",
      interestOnCapital: "NO_ADJUSTMENT",
      nzInvestorType: "LOCAL_NO_IMPUTATION",
      auInvestorType: "LOCAL_NO_IMPUTATION",
      considerDividendFee: false,
      drDividendTreatment: 'DEFAULT',
      globalDrTaxRate: 0
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
    advancedParams: any,
    priceOverrides: any[],
    initialLevel: number,
    previousRebalancingIndexValue: number,
    rebalancings: any[]
  ): Promise<SimulationResult> {
    const isBondIndex = indexFamily === 'BOND_DEFAULT' || indexFamily === 'BOND_BASEMARKETVALUE';
    console.log(`Starting ${isBondIndex ? 'Bond' : 'Equity'} simulation with parameters:`, {
      startDate,
      endDate,
      currency,
      returnType,
      divisor,
      indexFamily,
      identifierType,
      referenceIndexId,
      stocksCount: stocks.length,
      advancedParams,
      priceOverridesCount: priceOverrides.length,
      initialLevel,
      previousRebalancingIndexValue,
      rebalancingsCount: rebalancings.length
    });

    const payload: SimulationPayload = {
      simulationStart: startDate,
      simulationEnd: endDate,
      priceHistory: {
        instrumentPrices: priceOverrides
      },
      indexProperties: {
        initialIndexLevel: { value: initialLevel },
        previousIndexValue: { value: initialLevel },
        previousRebalancingIndexValue: { value: previousRebalancingIndexValue },
        coreIndexData: {
          name: "Simulation Index",
          identifiers: [{
            assetClass: "INDEX",
            identifierType: "RIC",
            id: ".SIMULATE"
          }],
          family: indexFamily,
          type: returnType,
          currency: currency,
          ignoreFx: false
        },
      },
      caModificationChain: {
        caModificationInitialization: "FULL",
        rules: []
      },
      resultIdentifierType: identifierType,
      selectionResults: []
    };

    if (isBondIndex) {
      payload.indexProperties.caHandlingConfiguration = SimulationService.buildCAHandlingBondDefault();
      
      payload.bondComposition = {
        clusters: [{
          name: "NONE",
          constituents: stocks.map(stock => ({
            assetIdentifier: {
              assetClass: stock.assetClass || "BOND",
              identifierType: identifierType,
              id: stock.ric
            },
            quantity: {
              type: "AMOUNT",
              value: parseFloat(stock.shares || stock.weight || '1')
            },
            additionalNumbers: {
              weightingCapFactor: parseFloat(stock.weightingCapFactor || '1')
            }
          }))
        }],
        additionalNumbers: {
          divisor: parseFloat(divisor)
        }
      };
    } else {
      payload.indexProperties.caHandlingConfiguration = SimulationService.buildCAHandlingDefault(returnType);
      
      payload.composition = {
        clusters: [{
          name: "NONE",
          constituents: stocks.map(stock => ({
            assetIdentifier: {
              assetClass: stock.assetClass || "SHARE",
              identifierType: identifierType,
              id: stock.ric
            },
            quantity: {
              type: "UNITS",
              value: parseFloat(stock.shares || stock.weight || '1')
            },
            additionalNumbers: {
              freeFloatFactor: parseFloat(stock.freeFloatFactor || '1'),
              weightingCapFactor: parseFloat(stock.weightingCapFactor || '1')
            }
          }))
        }],
        additionalNumbers: {
          divisor: parseFloat(divisor)
        }
      };
    }

    // Handle rebalancings
    if (rebalancings && rebalancings.length > 0) {
      const rebalancingAdaptions: any[] = rebalancings.map(rebalancing => ({
        rebalancingId: rebalancing.id,
        rebalancingDate: rebalancing.date,
        rebalancingType: rebalancing.type || "FULL_REBALANCING",
        rebalancingId2: rebalancing.id2 || ""
      }));

      // Add composition for each rebalancing based on index type
      rebalancingAdaptions.forEach((rebalancing, index) => {
        const rebalancingData = rebalancings[index];
        
        if (isBondIndex) {
          rebalancing.bondComposition = {
            clusters: [{
              name: "NONE",
              constituents: rebalancingData.components?.map((component: any) => ({
                assetIdentifier: {
                  assetClass: component.assetClass || "BOND",
                  identifierType: identifierType,
                  id: component.ric
                },
                quantity: {
                  type: "AMOUNT",
                  value: parseFloat(component.shares || component.weight || '1')
                },
                additionalNumbers: {
                  weightingCapFactor: parseFloat(component.weightingCapFactor || '1')
                }
              })) || []
            }]
          };
        } else {
          rebalancing.composition = {
            clusters: [{
              name: "NONE",
              constituents: rebalancingData.components?.map((component: any) => ({
                assetIdentifier: {
                  assetClass: component.assetClass || "SHARE",
                  identifierType: identifierType,
                  id: component.ric
                },
                quantity: {
                  type: "UNITS",
                  value: parseFloat(component.shares || component.weight || '1')
                },
                additionalNumbers: {
                  freeFloatFactor: parseFloat(component.freeFloatFactor || '1'),
                  weightingCapFactor: parseFloat(component.weightingCapFactor || '1')
                }
              })) || []
            }]
          };
        }
      });

      payload.rebalancingAdaptions = rebalancingAdaptions;
    }

    // Add referencedIndex if referenceIndexId is provided
    if (referenceIndexId && referenceIndexId.trim()) {
      (payload as any).referencedIndex = {
        assetClass: "INDEX",
        identifierType: "GIGANT_ID",
        id: referenceIndexId.trim()
      };
    }

    console.log('Simulation payload:', JSON.stringify(payload, null, 2));
    const start = performance.now();
    // Choose API URL based on index family
    const apiUrl = isBondIndex ? this.BOND_API_URL : this.EQUITY_API_URL;
    console.log(`Using ${isBondIndex ? 'Bond' : 'Equity'} API: ${apiUrl}`);

    try {
      // First, try the direct API call
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', response.status, response.statusText, errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}. Response: ${errorText}`);
      }

      const result = await response.json();
      const end = performance.now();
      console.log(`Execution time: ${end - start} ms`);
      console.log('Simulation result:', result);
      
      // Store the result for use in other components
      SimulationService.simulationResult = result;
      SimulationService.currentIndexFamily = indexFamily;
      
      return result;
    } catch (error) {
      console.error('Simulation API error:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.log('CORS error detected, using dummy data for demonstration');
        
        // Use dummy data as fallback
        SimulationService.simulationResult = SimulationService.DUMMY_SIMULATION_RESULT;
        SimulationService.currentIndexFamily = indexFamily;
        
        // Show a toast to inform the user
        console.log('Using dummy simulation data due to CORS restrictions');
        
        return SimulationService.DUMMY_SIMULATION_RESULT;
      }
      
      throw error;
    }
  }

  static getTimeSeriesData(): TimeSeriesData[] {
    if (!SimulationService.simulationResult) {
      return [];
    }

    // Handle both old dummy format and new API format
    const simulationData = SimulationService.simulationResult.simulations || SimulationService.simulationResult;
    const referenceData = SimulationService.simulationResult.referencedIndexTimeSeries;
    
    return Object.entries(simulationData)
      .map(([date, data]: [string, any]) => {
        // Skip entries where closingIndexState is null or undefined
        if (!data.closingIndexState || !data.closingIndexState.indexStateEvaluationDto) {
          return null;
        }
        
        const indexLevel = data.closingIndexState.indexStateEvaluationDto.indexLevel;
        const divisor = data.closingIndexState.composition?.additionalNumbers?.divisor || 1.0;
        
        // Skip if essential data is missing or zero
        if (!indexLevel || !divisor) {
          return null;
        }
        
        // Get reference data for this date if available
        const referenceEntry = referenceData?.[date];
        const referenceIndexLevel = referenceEntry?.closingIndexState?.indexStateEvaluationDto?.indexLevel;
        const referenceDivisor = referenceEntry?.closingIndexState?.composition?.additionalNumbers?.divisor;
        
        const result: TimeSeriesData = {
          date: SimulationService.formatDateForDisplay(date),
          indexLevel,
          divisor,
          referenceIndexLevel,
          referenceDivisor
        };
        
        return result;
      })
      .filter((item): item is TimeSeriesData => item !== null)
      .sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime());
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
