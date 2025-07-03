import axios from 'axios';

interface SimulationResult {
    simulations: any;
    // Define the structure based on the actual response
}

export class SimulationService {
    private static baseUrl = 'http://localhost:3001'; // Replace with your API base URL
    private static simulationResult: SimulationResult | null = null;

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
        initialLevel?: string
    ): Promise<any> {
        try {
            // Format dates to 'YYYY-MM-DD'
            const formatDate = (dateStr: string) => {
                const [day, month, year] = dateStr.split('.');
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            };

            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);

            // Generate a unique simulation ID
            const simulationId = `sim_${Date.now()}`;

            const basePayload = {
                simulationId: simulationId,
                currency: currency,
                returnType: returnType,
                family: indexFamily,
                divisor: parseFloat(divisor),
                initialIndexLevel: {
                    value: parseFloat(initialLevel || '1000.0')
                },
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                identifierType: identifierType,
                constituents: stocks.map((stock: any) => ({
                    ...stock,
                    weight: parseFloat(stock.weight),
                    shares: parseFloat(stock.shares),
                })),
                ...advancedParams,
                priceOverwrites: priceOverrides.map((override: any) => ({
                    ...override,
                    price: parseFloat(override.price),
                    date: formatDate(override.date)
                }))
            };

            let payload;

            if (referenceIndexId) {
                payload = {
                    ...basePayload,
                    referencedIndex: {
                        id: referenceIndexId
                    }
                };
            } else {
                payload = basePayload;
            }

            let apiUrl = `${this.baseUrl}/simulate`;

            if (indexFamily === 'BOND_DEFAULT' || indexFamily === 'BOND_BASEMARKETVALUE') {
                //Bond Index
                const bondPayload = {
                    ...payload,
                    constituents: stocks.map((stock: any) => ({
                        ...stock,
                        weight: parseFloat(stock.weight),
                        shares: parseFloat(stock.shares),
                        baseValue: parseFloat(stock.baseValue)
                    }))
                };
                apiUrl = `${this.baseUrl}/simulateBondIndex`;
                console.log('Bond Simulation Payload:', bondPayload);
                const response = await axios.post(apiUrl, bondPayload);
                SimulationService.simulationResult = response.data;
                return response.data;
            } else {
                //Equity Index
                console.log('Equity Simulation Payload:', payload);
                const response = await axios.post(apiUrl, payload);
                SimulationService.simulationResult = response.data;
                return response.data;
            }
        } catch (error: any) {
            console.error('Error running simulation:', error);
            throw new Error(error.response?.data?.message || 'Failed to run simulation');
        }
    }

    static getSimulationResult(): SimulationResult | null {
        return SimulationService.simulationResult;
    }

    static clearResults(): void {
        SimulationService.simulationResult = null;
    }

    static getResultsData(date: string, type: string): any[] {
        const simulationResult = SimulationService.getSimulationResult();
        if (!simulationResult) {
            return [];
        }

        const simulationData = simulationResult.simulations || simulationResult;
        if (!simulationData || !simulationData[date]) {
            return [];
        }

        const dayData = simulationData[date];
        const stateData = type === 'closing' ? dayData.closingIndexState : dayData.openingIndexState;

        if (!stateData || !stateData.composition || !stateData.composition.instrumentStates) {
            return [];
        }

        return stateData.composition.instrumentStates.map((instrument: any) => ({
            RIC: instrument.instrumentId,
            Shares: instrument.shares,
            Weight: instrument.weight,
            closingPrice: instrument.priceInformation.closingPrice,
            openingPrice: instrument.priceInformation.openingPrice,
            adjustedClosingPrice: instrument.priceInformation.adjustedClosingPrice
        }));
    }

    static getTimeSeriesData(): Array<{date: string, indexLevel: number, divisor: number}> {
        const simulationResult = SimulationService.getSimulationResult();
        if (!simulationResult) {
            return [];
        }

        const simulationData = simulationResult.simulations || simulationResult;
        const timeSeriesData: Array<{date: string, indexLevel: number, divisor: number}> = [];

        Object.keys(simulationData).sort().forEach(date => {
            const dayData = simulationData[date];
            if (dayData.closingIndexState) {
                const formattedDate = (() => {
                    const [year, month, day] = date.split('-');
                    return `${day}.${month}.${year}`;
                })();
                
                timeSeriesData.push({
                    date: formattedDate,
                    indexLevel: dayData.closingIndexState.indexStateEvaluationDto?.indexLevel || 0,
                    divisor: dayData.closingIndexState.composition?.additionalNumbers?.divisor || 0
                });
            }
        });

        return timeSeriesData;
    }
}
