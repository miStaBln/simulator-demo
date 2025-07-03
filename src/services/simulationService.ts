interface SimulationPayload {
  simulationStart: string;
  simulationEnd: string;
  priceHistory: {
    instrumentPrices: any[];
  };
  indexProperties: {
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
    caHandlingConfiguration: {
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
  };
  composition: {
    clusters: Array<{
      name: string;
      constituents: Array<any>; // Updated to allow both bond and equity structures
    }>;
    additionalNumbers: {
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
            "divisor": 100000
          }
        },
        "indexStateEvaluationDto": {
          "indexLevel": 59.23030000000001,
          "clusters": [
            {
              "name": "NONE",
              "prices": [
                {
                  "instrumentKey": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "GOOGL.OQ"
                  },
                  "price": 159.07
                },
                {
                  "instrumentKey": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "MSFT.OQ"
                  },
                  "price": 387.81
                },
                {
                  "instrumentKey": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "AAPL.OQ"
                  },
                  "price": 202.52
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
          "indexLevel": 59.23030000000001,
          "clusters": [
            {
              "name": "NONE",
              "prices": [
                {
                  "instrumentKey": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "GOOGL.OQ"
                  },
                  "price": 159.07
                }
              ]
            }
          ]
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
            "divisor": 100000
          }
        },
        "indexStateEvaluationDto": {
          "indexLevel": 58.8879,
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
                  "price": 202.14
                },
                {
                  "instrumentKey": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "GOOGL.OQ"
                  },
                  "price": 156.31
                },
                {
                  "instrumentKey": {
                    "assetClass": "SHARE",
                    "identifierType": "RIC",
                    "id": "MSFT.OQ"
                  },
                  "price": 385.73
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
          "indexLevel": 58.8879,
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
                  "price": 385.73
                }
              ]
            }
          ]
        }
      }
    }
  };

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
    stocks: Array<{ ric: string; shares: string; weight: string; baseValue?: string }>,
    advancedParams: {
      cashDividendTaxHandling: string;
      specialDividendTaxHandling: string;
      considerStockDividend: boolean;
      considerStockSplit: boolean;
      considerRightsIssue: boolean;
      considerDividendFee: boolean;
      drDividendTreatment: string;
      globalDrTaxRate: string;
    },
    priceOverrides: Array<{ric: string, date: string, price: string}> = []
  ) {
    // Convert date format from DD.MM.YYYY to YYYY-MM-DD
    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split('.');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    // Map return type to API format
    const getIndexType = (returnType: string) => {
      switch (returnType) {
        default: return 'PERFORMANCE';
      }
    };

    // Determine if this is a bond index
    const isBondIndex = indexFamily === 'BOND_DEFAULT' || indexFamily === 'BOND_BASEMARKETVALUE';

    // Create constituents from stocks data
    const constituents = stocks
      .filter(stock => stock.ric && (stock.shares || stock.weight))
      .map((stock, index) => {
        if (isBondIndex) {
          return {
            assetIdentifier: {
              assetClass: "BOND",
              identifierType: identifierType,
              id: stock.ric
            },
            quantity: {
              type: "AMOUNT",
              value: parseFloat(stock.shares || stock.weight || '1')
            },
            additionalNumbers: {
              freeFloatFactor: 1,
              weightingCapFactor: 1,
              baseValue:parseFloat(stock.baseValue || '0')
            },
            dates: {
                compositionEnteredAt: {
                    date: "2025-03-03"
                }
            }
          };
        } else {
          return {
            assetIdentifier: {
              assetClass: "SHARE",
              identifierType: identifierType,
              id: stock.ric
            },
            quantity: {
              type: "UNITS",
              value: parseFloat(stock.shares || stock.weight || '1')
            },
            additionalNumbers: {
              freeFloatFactor: 1,
              weightingCapFactor: 1
            }
          };
        }
      });

    // Map price overrides to API format with nested date structure
    const instrumentPrices = priceOverrides
      .filter(override => override.ric && override.date && override.price)
      .map(override => ({
        instrumentKey: {
          assetClass: isBondIndex ? "BOND" : "SHARE",
          identifierType: identifierType,
          id: override.ric
        },
        date: {
          date: formatDate(override.date)
        },
        price: parseFloat(override.price)
      }));

    // Build CA handling configuration based on return type
    const caHandlingConfig = this.buildCAHandlingDefault(returnType);

    // Override with advanced parameters if they are not default values
    if (advancedParams.cashDividendTaxHandling !== 'None') {
      caHandlingConfig.cashDividendTaxHandling = advancedParams.cashDividendTaxHandling;
    }
    if (advancedParams.specialDividendTaxHandling !== 'None') {
      caHandlingConfig.specialDividendTaxHandling = advancedParams.specialDividendTaxHandling;
    }
    caHandlingConfig.considerStockDividend = advancedParams.considerStockDividend;
    caHandlingConfig.considerStockSplit = advancedParams.considerStockSplit;
    caHandlingConfig.considerRightsIssue = advancedParams.considerRightsIssue;
    caHandlingConfig.considerDividendFee = advancedParams.considerDividendFee;
    caHandlingConfig.drDividendTreatment = advancedParams.drDividendTreatment;
    caHandlingConfig.globalDrTaxRate = parseFloat(advancedParams.globalDrTaxRate) || 0;

    const payload: SimulationPayload = {
      simulationStart: formatDate(startDate),
      simulationEnd: formatDate(endDate),
      priceHistory: {
        instrumentPrices: instrumentPrices
      },
      indexProperties: {
        coreIndexData: {
          name: "Simulation Index",
          identifiers: [
            {
              assetClass: "INDEX",
              identifierType: identifierType,
              id: ".SIMULATE"
            }
          ],
          family: indexFamily,
          type: getIndexType(returnType),
          currency: currency,
          ignoreFx: false
        },
        caHandlingConfiguration: caHandlingConfig
      },
      composition: {
        type : "bond",
        clusters: [
          {
            name: "NONE",
            constituents: constituents
          }
        ],
        additionalNumbers: {
          divisor: parseFloat(divisor) || 1
        }
      },
      caModificationChain: {
        caModificationInitialization: "FULL",
        rules: []
      },
      resultIdentifierType: identifierType,
      selectionResults: []
    };

    // Add referencedIndex if referenceIndexId is provided
    if (referenceIndexId && referenceIndexId.trim()) {
      (payload as any).referencedIndex = {
        assetClass: "INDEX",
        identifierType: "GIGANT_ID",
        id: referenceIndexId.trim()
      };
    }

    console.log('Simulation payload:', JSON.stringify(payload, null, 2));

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
      console.log('Simulation result:', result);
      
      // Store the result for use in other components
      SimulationService.simulationResult = result;
      
      return result;
    } catch (error) {
      console.error('Simulation API error:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.log('CORS error detected, using dummy data for demonstration');
        
        // Use dummy data as fallback
        SimulationService.simulationResult = SimulationService.DUMMY_SIMULATION_RESULT;
        
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
    
    return Object.entries(simulationData)
      .map(([date, data]) => {
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
        
        return {
          date: SimulationService.formatDateForDisplay(date),
          indexLevel,
          divisor
        };
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
      
      return {
        ric: constituent.assetIdentifier.id,
        cas: '',
        quantity: constituent.quantity.value.toString(),
        price: priceData ? priceData.price.toString() : '0',
        currency: '',
        fx: ''
      };
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
  }
}
