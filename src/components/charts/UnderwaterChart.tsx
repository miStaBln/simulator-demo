
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface UnderwaterData {
  date: string;
  drawdown: number;
}

interface UnderwaterChartProps {
  data: UnderwaterData[];
  domain: [number, number];
}

const UnderwaterChart: React.FC<UnderwaterChartProps> = ({ data, domain }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Underwater Plot</h2>
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
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Drawdown']}
              labelStyle={{ color: '#374151' }}
            />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="5 5" />
            <defs>
              <linearGradient id="underwaterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Line 
              type="monotone" 
              dataKey="drawdown" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
              fill="url(#underwaterGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UnderwaterChart;
