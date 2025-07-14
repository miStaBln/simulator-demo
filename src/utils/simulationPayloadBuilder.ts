
import { SimulationPayload } from '@/types/simulation';
import { buildCAHandlingBondDefault, buildCAHandlingDefault } from './caHandlingUtils';

export function formatDateForAPI(dateStr: string): string {
  if (dateStr.includes('.')) {
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr;
}

export function buildSimulationPayload(
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
): SimulationPayload {
  const isBondIndex = indexFamily === 'BOND_DEFAULT' || indexFamily === 'BOND_BASEMARKETVALUE';
  
  const caHandlingConfiguration = isBondIndex 
    ? buildCAHandlingBondDefault()
    : buildCAHandlingDefault(returnType);

  const formattedStartDate = formatDateForAPI(startDate);
  const formattedEndDate = formatDateForAPI(endDate);

  const payload: SimulationPayload = {
    simulationStart: formattedStartDate,
    simulationEnd: formattedEndDate,
    priceHistory: {
      instrumentPrices: priceOverrides.map(override => ({
        instrumentKey: {
          assetClass: isBondIndex ? "BOND" : "SHARE",
          identifierType,
          id: override.ric
        },
        price: parseFloat(override.price),
        priceDate: formatDateForAPI(override.date)
      }))
    },
    indexProperties: {
      initialIndexLevel: {
        value: parseFloat(initialLevel)
      },
      previousIndexValue: {
        value: parseFloat(initialLevel)
      },
      previousRebalancingIndexValue: {
        value: parseFloat(previousRebalancingIndexValue)
      },
      coreIndexData: {
        name: referenceIndexId || "Simulation Index",
        identifiers: [{
          assetClass: isBondIndex ? "BOND" : "SHARE",
          identifierType,
          id: referenceIndexId || "SIM_INDEX"
        }],
        family: indexFamily,
        type: "SIMULATION",
        currency,
        ignoreFx: false
      },
      caHandlingConfiguration,
      taxRates: []
    },
    composition: {
      clusters: [{
        name: "default-cluster",
        constituents: stocks.map(stock => {
          const baseConstituent: any = {
            assetIdentifier: {
              assetClass: isBondIndex ? "BOND" : "SHARE",
              identifierType,
              id: stock.ric
            },
            quantity: {
              type: "UNITS",
              value: parseFloat(stock.shares) || 0
            },
            additionalNumbers: {
              freeFloatFactor: 1,
              weightingCapFactor: parseFloat(stock.weightingCapFactor) || 1
            }
          };

          // Add bond-specific fields
          if (isBondIndex) {
            if (stock.baseValue) {
              baseConstituent.additionalNumbers.baseMarketValue = parseFloat(stock.baseValue);
            }
            
            // Add cash objects for bond indices
            const cashes = [];
            if (stock.caCash) cashes.push({ value: parseFloat(stock.caCash), type: 'CA_CASH', date: null });
            if (stock.couponCash) cashes.push({ value: parseFloat(stock.couponCash), type: 'COUPON_CASH', date: null });
            if (stock.sinkingCash) cashes.push({ value: parseFloat(stock.sinkingCash), type: 'SINKING_CASH', date: null });
            
            if (cashes.length > 0) {
              baseConstituent.cashes = cashes;
            }
          }

          return baseConstituent;
        })
      }],
      additionalNumbers: {
        divisor: parseFloat(divisor)
      }
    },
    caModificationChain: {
      caModificationInitialization: "NONE",
      rules: []
    },
    resultIdentifierType: identifierType,
    selectionResults: [{
      fixingDate: formattedStartDate,
      effectiveOpenDates: [formattedStartDate],
      adaptionType: "FULL_REPLICATION",
      clusters: [{
        name: "default-cluster",
        constituents: stocks.map(stock => ({
          assetIdentifier: {
            assetClass: isBondIndex ? "BOND" : "SHARE",
            identifierType,
            id: stock.ric
          },
          quantity: {
            type: "UNITS",
            value: parseFloat(stock.shares) || 0
          },
          additionalNumbers: {
            freeFloatFactor: 1,
            weightingCapFactor: parseFloat(stock.weightingCapFactor) || 1
          }
        }))
      }],
      additionalParameters: {
        weightingType: "MARKET_CAP"
      }
    }]
  };

  // Add rebalancing adaptions if present
  if (rebalancings && rebalancings.length > 0) {
    payload.rebalancingAdaptions = rebalancings.map(rebal => ({
      adaptionBaseData: {
        adaptionType: "FULL_REPLICATION",
        effectiveDates: [formatDateForAPI(rebal.rebalancingDate)]
      },
      constituents: rebal.components.map((comp: any) => ({
        assetIdentifier: {
          assetClass: isBondIndex ? "BOND" : "SHARE",
          identifierType,
          id: comp.ric
        },
        quantity: {
          type: "UNITS",
          value: parseFloat(comp.shares) || 0
        },
        additionalNumbers: {
          weightingCapFactor: parseFloat(comp.weightingCapFactor) || 1
        }
      }))
    }));
  }

  return payload;
}
