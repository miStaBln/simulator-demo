
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VolatilityData } from '@/utils/timeSeriesCalculations';

interface RollingVolatilityChartProps {
  data: VolatilityData[];
  domain: [number, number];
}

const RollingVolatilityChart: React.FC<RollingVolatilityChartProps> = ({ data, domain }) => {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-xl font-semibold mb-4">1-Month Rolling Volatility (Annualized %)</h2>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
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
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Rolling Volatility']}
              labelStyle={{ color: '#374151' }}
            />
            <Line 
              type="monotone" 
              dataKey="volatility" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Volatility"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RollingVolatilityChart;
