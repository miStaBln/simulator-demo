
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DailyReturn } from '@/utils/timeSeriesCalculations';

interface DailyReturnsChartProps {
  data: DailyReturn[];
  domain: [number, number];
}

const DailyReturnsChart: React.FC<DailyReturnsChartProps> = ({ data, domain }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Daily Returns (%)</h2>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
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
              domain={domain}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Daily Return']}
              labelStyle={{ color: '#374151' }}
            />
            <Bar dataKey="dailyReturn">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isPositive ? "#10b981" : "#ef4444"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyReturnsChart;
