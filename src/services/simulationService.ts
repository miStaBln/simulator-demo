
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
    };
  };
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
    additionalParameters: {
      weightingType: string;
    };
  }>;
}

export class SimulationService {
  private static readonly API_URL = "http://test-32.gde.nbg.solactive.com:8274/index-simulator-equity/proxy/v3/simulateIndexSimple";

  static async runSimulation(
    startDate: string,
    endDate: string,
    currency: string,
    returnType: string,
    divisor: string,
    stocks: Array<{ ric: string; shares: string; weight: string }>,
    advancedParams: {
      cashDividendTaxHandling: string;
      specialDividendTaxHandling: string;
      considerStockDividend: boolean;
      considerStockSplit: boolean;
      considerRightsIssue: boolean;
      considerDividendFee: boolean;
    }
  ) {
    // Convert date format from DD.MM.YYYY to YYYY-MM-DD
    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split('.');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    // Map return type to API format
    const getIndexType = (returnType: string) => {
      switch (returnType) {
        case 'NTR': return 'NET_TOTAL_RETURN';
        case 'GTR': return 'GROSS_TOTAL_RETURN';
        case 'PR': return 'PERFORMANCE';
        default: return 'PERFORMANCE';
      }
    };

    // Create constituents from stocks data
    const constituents = stocks
      .filter(stock => stock.ric && (stock.shares || stock.weight))
      .map((stock, index) => ({
        assetIdentifier: {
          assetClass: "SHARE",
          identifierType: "GIGANT_ID",
          id: (422 + index).toString() // Mock IDs for now
        },
        quantity: {
          type: "UNITS",
          value: parseFloat(stock.shares || stock.weight || '1')
        },
        additionalNumbers: {
          freeFloatFactor: 1,
          weightingCapFactor: 1
        }
      }));

    const payload: SimulationPayload = {
      simulationStart: formatDate(startDate),
      simulationEnd: formatDate(endDate),
      priceHistory: {
        instrumentPrices: []
      },
      indexProperties: {
        coreIndexData: {
          name: "Test Index",
          identifiers: [
            {
              assetClass: "INDEX",
              identifierType: "GIGANT_ID",
              id: "12346"
            }
          ],
          family: "DEFAULT_LASPEYRE",
          type: getIndexType(returnType),
          currency: currency,
          ignoreFx: false
        },
        caHandlingConfiguration: {
          enableCaHandling: true,
          cashDividendTaxHandling: advancedParams.cashDividendTaxHandling === 'None' ? 'USE_WITH_TAX' : advancedParams.cashDividendTaxHandling,
          specialDividendTaxHandling: advancedParams.specialDividendTaxHandling === 'None' ? 'USE_WITH_TAX' : advancedParams.specialDividendTaxHandling,
          considerStockDividend: advancedParams.considerStockDividend,
          considerStockSplit: advancedParams.considerStockSplit,
          considerRightsIssue: advancedParams.considerRightsIssue,
          considerRightsIssueToCashComponent: true,
          considerCapitalDecrease: true,
          cashDividendTax: 0,
          specialDividendTax: 0,
          corporateActionHandling: "NONE",
          useWeightNeutralRightsIssue: true,
          useWeightNeutralCapitalDecrease: true,
          franking: "NO_ADJUSTMENT",
          pid: "NO_ADJUSTMENT",
          reit: "NO_ADJUSTMENT",
          returnOfCapital: "NO_ADJUSTMENT",
          interestOnCapital: "NO_ADJUSTMENT",
          nzInvestorType: "LOCAL_NO_IMPUTATION",
          auInvestorType: "LOCAL_NO_IMPUTATION"
        }
      },
      composition: {
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
      resultIdentifierType: "GIGANT_ID",
      selectionResults: [
        {
          fixingDate: formatDate(startDate),
          effectiveOpenDates: [formatDate(endDate)],
          adaptionType: "DEFAULT_UNITS",
          clusters: [
            {
              name: "string",
              constituents: constituents
            }
          ],
          additionalParameters: {
            weightingType: "INDEX_MEMBER_TARGET_SHARES"
          }
        }
      ]
    };

    console.log('Simulation payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Simulation result:', result);
      return result;
    } catch (error) {
      console.error('Simulation API error:', error);
      throw error;
    }
  }
}
