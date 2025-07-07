
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { HistogramBin, Stats } from '@/utils/timeSeriesCalculations';

interface DistributionChartProps {
  data: HistogramBin[];
  stats: Stats;
  observationCount: number;
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data, stats, observationCount }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Distribution of Daily Returns</h2>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Mean Return</p>
            <p className="text-lg font-semibold">{stats.mean.toFixed(2)}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Standard Deviation</p>
            <p className="text-lg font-semibold">{stats.stdDev.toFixed(2)}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Observations</p>
            <p className="text-lg font-semibold">{observationCount}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
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
            <ReferenceLine x={stats.mean.toFixed(1) + '%'} stroke="#ef4444" strokeDasharray="3 3" />
            <Bar dataKey="count" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DistributionChart;
