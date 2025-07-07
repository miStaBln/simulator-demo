
import React, { useState } from 'react';
import { SimulationService } from '@/services/simulationService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, ReferenceLine } from 'recharts';

const TimeSeriesData = () => {
  const [showAll, setShowAll] = useState(false);
  const timeSeriesData = SimulationService.getTimeSeriesData();
  
  // Calculate daily returns
  const dailyReturnsData = timeSeriesData.slice(1).map((current, index) => {
    const previous = timeSeriesData[index];
    const dailyReturn = ((current.indexLevel / previous.indexLevel) - 1) * 100;
    return {
      date: current.date,
      dailyReturn: dailyReturn,
      isPositive: dailyReturn >= 0
    };
  });

  // Calculate Y-axis domains with proper rounding for better visualization
  const calculateYAxisDomain = (data: number[], padding: number = 0.05) => {
    if (data.length === 0) return [0, 100];
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const paddingAmount = range * padding;
    
    // Round to nice numbers
    const minWithPadding = min - paddingAmount;
    const maxWithPadding = max + paddingAmount;
    
    // For index levels, use more precise rounding
    if (max > 1) {
      const magnitude = Math.pow(10, Math.floor(Math.log10(range)) - 1);
      return [
        Math.floor(minWithPadding / magnitude) * magnitude,
        Math.ceil(maxWithPadding / magnitude) * magnitude
      ];
    }
    
    return [
      Math.floor(minWithPadding * 1000) / 1000,
      Math.ceil(maxWithPadding * 1000) / 1000
    ];
  };

  const indexLevelDomain = calculateYAxisDomain(timeSeriesData.map(d => d.indexLevel));
  const divisorDomain = calculateYAxisDomain(timeSeriesData.map(d => d.divisor));
  const dailyReturnsDomain = calculateYAxisDomain(dailyReturnsData.map(d => d.dailyReturn));

  // Create histogram data for daily returns distribution
  const createHistogramData = () => {
    if (dailyReturnsData.length === 0) return [];
    
    const returns = dailyReturnsData.map(d => d.dailyReturn);
    const min = Math.min(...returns);
    const max = Math.max(...returns);
    const numBins = 15;
    const binWidth = (max - min) / numBins;
    
    const bins = Array.from({ length: numBins }, (_, i) => ({
      binStart: min + i * binWidth,
      binEnd: min + (i + 1) * binWidth,
      count: 0,
      percentage: 0
    }));
    
    // Count occurrences in each bin
    returns.forEach(returnValue => {
      const binIndex = Math.min(Math.floor((returnValue - min) / binWidth), numBins - 1);
      bins[binIndex].count++;
    });
    
    // Calculate percentages
    bins.forEach(bin => {
      bin.percentage = (bin.count / returns.length) * 100;
    });
    
    return bins.map(bin => ({
      range: `${bin.binStart.toFixed(1)}%`,
      count: bin.count,
      percentage: bin.percentage,
      midpoint: (bin.binStart + bin.binEnd) / 2
    }));
  };

  const histogramData = createHistogramData();
  
  // Calculate statistics for the distribution
  const calculateStats = () => {
    if (dailyReturnsData.length === 0) return { mean: 0, stdDev: 0 };
    
    const returns = dailyReturnsData.map(d => d.dailyReturn);
    const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
    const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    return { mean, stdDev };
  };

  // Calculate Maximum Drawdown
  const calculateMaxDrawdown = () => {
    if (timeSeriesData.length === 0) return 0;
    
    let maxDrawdown = 0;
    let peak = timeSeriesData[0].indexLevel;
    
    for (let i = 1; i < timeSeriesData.length; i++) {
      const currentLevel = timeSeriesData[i].indexLevel;
      
      // Update peak if current level is higher
      if (currentLevel > peak) {
        peak = currentLevel;
      }
      
      // Calculate drawdown from peak
      const drawdown = ((peak - currentLevel) / peak) * 100;
      
      // Update max drawdown if current drawdown is larger
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    return maxDrawdown;
  };

  const { mean, stdDev } = calculateStats();
  const maxDrawdown = calculateMaxDrawdown();

  // Calculate key figures
  const keyFigures = timeSeriesData.length > 0 ? {
    startLevel: timeSeriesData[0].indexLevel,
    endLevel: timeSeriesData[timeSeriesData.length - 1].indexLevel,
    startDate: timeSeriesData[0].date,
    endDate: timeSeriesData[timeSeriesData.length - 1].date,
    totalReturn: ((timeSeriesData[timeSeriesData.length - 1].indexLevel / timeSeriesData[0].indexLevel) - 1) * 100,
    numberOfDays: timeSeriesData.length,
    maxDrawdown: maxDrawdown
  } : null;

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
      {keyFigures && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Key Figures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Return</h3>
              <p className={`text-2xl font-bold ${keyFigures.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {keyFigures.totalReturn.toFixed(2)}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Maximum Drawdown</h3>
              <p className="text-2xl font-bold text-red-600">
                -{keyFigures.maxDrawdown.toFixed(2)}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Start Level</h3>
              <p className="text-xl font-semibold">{keyFigures.startLevel.toFixed(4)}</p>
              <p className="text-xs text-gray-400">{keyFigures.startDate}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">End Level</h3>
              <p className="text-xl font-semibold">{keyFigures.endLevel.toFixed(4)}</p>
              <p className="text-xs text-gray-400">{keyFigures.endDate}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              Simulation period: <strong>{keyFigures.numberOfDays} days</strong> from {keyFigures.startDate} to {keyFigures.endDate}
            </p>
          </div>
        </div>
      )}

      {/* Charts Section - Three Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Index Level and Divisor Line Chart */}
        {timeSeriesData.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Index Level and Divisor Over Time</h2>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    yAxisId="level" 
                    orientation="left" 
                    tick={{ fontSize: 12 }} 
                    domain={indexLevelDomain}
                    tickFormatter={(value) => value.toFixed(2)}
                  />
                  <YAxis 
                    yAxisId="divisor" 
                    orientation="right" 
                    tick={{ fontSize: 12 }} 
                    domain={divisorDomain}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'indexLevel' ? value.toFixed(6) : value.toLocaleString(),
                      name === 'indexLevel' ? 'Index Level' : 'Divisor'
                    ]}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="level"
                    type="monotone" 
                    dataKey="indexLevel" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Index Level"
                    dot={false}
                  />
                  <Line 
                    yAxisId="divisor"
                    type="monotone" 
                    dataKey="divisor" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Divisor"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Daily Returns Chart */}
        {dailyReturnsData.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Daily Returns (%)</h2>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dailyReturnsData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    domain={dailyReturnsDomain}
                    tickFormatter={(value) => `${value.toFixed(1)}%`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)}%`, 'Daily Return']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar dataKey="dailyReturn">
                    {dailyReturnsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isPositive ? "#10b981" : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Distribution of Daily Returns */}
      {histogramData.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Distribution of Daily Returns</h2>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Mean Return</p>
                <p className="text-lg font-semibold">{mean.toFixed(2)}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Standard Deviation</p>
                <p className="text-lg font-semibold">{stdDev.toFixed(2)}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Observations</p>
                <p className="text-lg font-semibold">{dailyReturnsData.length}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Occurrences', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'count' ? `${value} occurrences` : `${value.toFixed(1)}%`,
                    name === 'count' ? 'Count' : 'Percentage'
                  ]}
                  labelFormatter={(label) => `Return Range: ${label}`}
                />
                <ReferenceLine x={mean.toFixed(1) + '%'} stroke="#ef4444" strokeDasharray="3 3" />
                <Bar dataKey="count" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {/* Time Series Table */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Index Levels</h2>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Index Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Divisor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.indexLevel.toFixed(6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.divisor.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {timeSeriesData.length > 10 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {showAll ? 'Show Less' : `Show All ${timeSeriesData.length} Results`}
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeSeriesData;
