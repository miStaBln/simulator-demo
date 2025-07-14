
export interface SimulationPayload {
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
      cashDividendTaxHandling?: string;
      specialDividendTaxHandling?: string;
      considerStockDividend?: boolean;
      considerStockSplit?: boolean;
      considerRightsIssue?: boolean;
      considerRightsIssueToCashComponent?: boolean;
      considerCapitalDecrease?: boolean;
      cashDividendTax?: number;
      specialDividendTax?: number;
      corporateActionHandling: string;
      useWeightNeutralRightsIssue?: boolean;
      useWeightNeutralCapitalDecrease?: boolean;
      franking?: string;
      pid?: string;
      reit?: string;
      returnOfCapital?: string;
      interestOnCapital?: string;
      nzInvestorType?: string;
      auInvestorType?: string;
      considerDividendFee?: boolean;
      drDividendTreatment?: string;
      globalDrTaxRate?: number;
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

export interface SimulationResult {
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

export interface TimeSeriesData {
  date: string;
  indexLevel: number;
  divisor: number;
}

export interface ResultsData {
  ric: string;
  cas: string;
  quantity: string;
  price: string;
  currency: string;
  fx: string;
}
