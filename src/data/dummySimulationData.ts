
import { SimulationResult } from '@/types/simulation';

export const DUMMY_SIMULATION_RESULT: SimulationResult = {
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
