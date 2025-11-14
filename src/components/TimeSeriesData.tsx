
import React, { useState } from 'react';
import { SimulationService } from '@/services/simulationService';
import {
  calculateDailyReturns,
  calculateRollingVolatility,
  calculateUnderwaterPlot,
  calculateMaxDrawdown,
  calculateYAxisDomain,
  createHistogramData,
  calculateStats,
  calculateKeyFigures
} from '@/utils/timeSeriesCalculations';
import KeyFigures from '@/components/charts/KeyFigures';
import IndexLevelChart from '@/components/charts/IndexLevelChart';
import DailyReturnsChart from '@/components/charts/DailyReturnsChart';
import RollingVolatilityChart from '@/components/charts/RollingVolatilityChart';
import UnderwaterChart from '@/components/charts/UnderwaterChart';
import DistributionChart from '@/components/charts/DistributionChart';
import TimeSeriesTable from '@/components/charts/TimeSeriesTable';

const TimeSeriesData = () => {
  const [showAll, setShowAll] = useState(false);
  const timeSeriesData = SimulationService.getTimeSeriesData();
  
  console.log('[TimeSeriesData] Component rendering');
  console.log('[TimeSeriesData] timeSeriesData:', timeSeriesData);
  console.log('[TimeSeriesData] timeSeriesData.length:', timeSeriesData.length);
  
  // Calculate all derived data
  const dailyReturnsData = calculateDailyReturns(timeSeriesData);
  const rollingVolatilityData = calculateRollingVolatility(dailyReturnsData);
  const underwaterData = calculateUnderwaterPlot(timeSeriesData);
  const maxDrawdown = calculateMaxDrawdown(timeSeriesData);
  const keyFigures = calculateKeyFigures(timeSeriesData, maxDrawdown);
  const histogramData = createHistogramData(dailyReturnsData);
  const stats = calculateStats(dailyReturnsData);
  
  console.log('[TimeSeriesData] Calculated data:', {
    dailyReturnsData: dailyReturnsData.length,
    rollingVolatilityData: rollingVolatilityData.length,
    underwaterData: underwaterData.length,
    maxDrawdown,
    keyFigures,
    histogramData: histogramData.length,
    stats
  });

  // Check if we have reference data
  const hasReferenceData = timeSeriesData.some(d => d.referenceIndexLevel !== undefined);
  
  // Calculate max deviation if reference data exists
  const maxDeviation = hasReferenceData ? Math.max(
    ...timeSeriesData
      .filter(d => d.referenceIndexLevel !== undefined)
      .map(d => Math.abs(d.indexLevel - d.referenceIndexLevel!))
  ) : undefined;

  // Calculate Y-axis domains including reference data
  const allIndexLevels = timeSeriesData.flatMap(d => [
    d.indexLevel,
    ...(d.referenceIndexLevel ? [d.referenceIndexLevel] : [])
  ]);
  const allDivisors = timeSeriesData.flatMap(d => [
    d.divisor,
    ...(d.referenceDivisor ? [d.referenceDivisor] : [])
  ]);
  
  const indexLevelDomain = calculateYAxisDomain(allIndexLevels);
  const divisorDomain = calculateYAxisDomain(allDivisors);
  const dailyReturnsDomain = calculateYAxisDomain(dailyReturnsData.map(d => d.dailyReturn));
  const volatilityDomain = calculateYAxisDomain(rollingVolatilityData.map(d => d.volatility));
  const underwaterDomain = calculateYAxisDomain(underwaterData.map(d => d.drawdown));

  const displayData = showAll ? timeSeriesData : timeSeriesData.slice(0, 10);

  if (timeSeriesData.length === 0) {
    console.log('[TimeSeriesData] No data, showing empty message');
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          No simulation data available. Please run a simulation first.
        </div>
      </div>
    );
  }

  console.log('[TimeSeriesData] Rendering charts and tables');

  return (
    <div className="p-6 bg-background">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Time Series Data</h1>
      
      {/* Key Figures Section */}

      {keyFigures && <KeyFigures keyFigures={keyFigures} />}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Index Level and Divisor Line Chart */}
        {timeSeriesData.length > 0 && (
          <IndexLevelChart 
            data={timeSeriesData}
            indexLevelDomain={indexLevelDomain}
            divisorDomain={divisorDomain}
            hasReferenceData={hasReferenceData}
            maxDeviation={maxDeviation}
          />
        )}

        {/* Daily Returns Chart */}
        {dailyReturnsData.length > 0 && (
          <DailyReturnsChart 
            data={dailyReturnsData}
            domain={dailyReturnsDomain}
          />
        )}

        {/* 1-Month Rolling Volatility Chart */}
        {rollingVolatilityData.length > 0 && (
          <RollingVolatilityChart 
            data={rollingVolatilityData}
            domain={volatilityDomain}
          />
        )}

        {/* Underwater Plot Chart */}
        {underwaterData.length > 0 && (
          <UnderwaterChart 
            data={underwaterData}
            domain={underwaterDomain}
          />
        )}
      </div>

      {/* Distribution of Daily Returns */}
      {histogramData.length > 0 && (
        <DistributionChart 
          data={histogramData}
          stats={stats}
          observationCount={dailyReturnsData.length}
        />
      )}
      
      {/* Time Series Table */}
      <TimeSeriesTable 
        data={timeSeriesData}
        displayData={displayData}
        showAll={showAll}
        onToggleShowAll={() => setShowAll(!showAll)}
      />
    </div>
  );
};

export default TimeSeriesData;
