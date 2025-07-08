
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TimeSeriesItem } from '@/utils/timeSeriesCalculations';
import { SimulationService } from '@/services/simulationService';

interface IndexLevelChartProps {
  data: TimeSeriesItem[];
  indexLevelDomain: [number, number];
  divisorDomain: [number, number];
}

const IndexLevelChart: React.FC<IndexLevelChartProps> = ({ data, indexLevelDomain, divisorDomain }) => {
  const isBondIndex = SimulationService.isBondIndex();
  const chartTitle = isBondIndex ? "Index Level Over Time" : "Index Level and Divisor Over Time";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{chartTitle}</h2>
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
              yAxisId="level" 
              orientation="left" 
              tick={{ fontSize: 12 }} 
              domain={indexLevelDomain}
              tickFormatter={(value) => value.toFixed(2)}
            />
            {!isBondIndex && (
              <YAxis 
                yAxisId="divisor" 
                orientation="right" 
                tick={{ fontSize: 12 }} 
                domain={divisorDomain}
                tickFormatter={(value) => value.toLocaleString()}
              />
            )}
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
            {!isBondIndex && (
              <Line 
                yAxisId="divisor"
                type="monotone" 
                dataKey="divisor" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Divisor"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IndexLevelChart;
