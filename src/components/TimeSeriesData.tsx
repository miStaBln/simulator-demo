
import React, { useState } from 'react';
import { SimulationService } from '@/services/simulationService';
import {
  calculateDailyReturns,
  calculateRollingVolatility,
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
import DistributionChart from '@/components/charts/DistributionChart';
import TimeSeriesTable from '@/components/charts/TimeSeriesTable';

const TimeSeriesData = () => {
  const [showAll, setShowAll] = useState(false);
  const timeSeriesData = SimulationService.getTimeSeriesData();
  
  // Calculate all derived data
  const dailyReturnsData = calculateDailyReturns(timeSeriesData);
  const rollingVolatilityData = calculateRollingVolatility(dailyReturnsData);
  const maxDrawdown = calculateMaxDrawdown(timeSeriesData);
  const keyFigures = calculateKeyFigures(timeSeriesData, maxDrawdown);
  const histogramData = createHistogramData(dailyReturnsData);
  const stats = calculateStats(dailyReturnsData);

  // Calculate Y-axis domains
  const indexLevelDomain = calculateYAxisDomain(timeSeriesData.map(d => d.indexLevel));
  const divisorDomain = calculateYAxisDomain(timeSeriesData.map(d => d.divisor));
  const dailyReturnsDomain = calculateYAxisDomain(dailyReturnsData.map(d => d.dailyReturn));
  const volatilityDomain = calculateYAxisDomain(rollingVolatilityData.map(d => d.volatility));

  const displayData = showAll ? timeSeriesData : timeSeriesData.slice(0, 10);

  if (timeSeriesData.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          No simulation data available. Please run a simulation first.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Time Series Data</h1>
      
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
