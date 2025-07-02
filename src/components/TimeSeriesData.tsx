import React, { useState } from 'react';
import { SimulationService } from '@/services/simulationService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';

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

  // Calculate key figures
  const keyFigures = timeSeriesData.length > 0 ? {
    startLevel: timeSeriesData[0].indexLevel,
    endLevel: timeSeriesData[timeSeriesData.length - 1].indexLevel,
    startDate: timeSeriesData[0].date,
    endDate: timeSeriesData[timeSeriesData.length - 1].date,
    totalReturn: ((timeSeriesData[timeSeriesData.length - 1].indexLevel / timeSeriesData[0].indexLevel) - 1) * 100,
    numberOfDays: timeSeriesData.length
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Return</h3>
              <p className={`text-2xl font-bold ${keyFigures.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {keyFigures.totalReturn.toFixed(2)}%
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

      {/* Charts Section - Side by Side */}
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
                  <YAxis yAxisId="level" orientation="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="divisor" orientation="right" tick={{ fontSize: 12 }} />
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
                  <YAxis tick={{ fontSize: 12 }} />
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
