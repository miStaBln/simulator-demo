
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { TimeSeriesItem } from '@/utils/timeSeriesCalculations';
import { SimulationService } from '@/services/simulationService';

interface IndexLevelChartProps {
  data: TimeSeriesItem[];
  indexLevelDomain: [number, number];
  divisorDomain: [number, number];
  hasReferenceData?: boolean;
  maxDeviation?: number;
}

const IndexLevelChart: React.FC<IndexLevelChartProps> = ({ data, indexLevelDomain, divisorDomain, hasReferenceData, maxDeviation }) => {
  const isBondIndex = SimulationService.isBondIndex();
  const baseTitle = isBondIndex ? "Index Level Over Time" : "Index Level and Divisor Over Time";
  const chartTitle = hasReferenceData ? `${baseTitle} - Comparison with Reference Index` : baseTitle;
  
  // Get the starting simulation level (first data point)
  const startingLevel = data.length > 0 ? data[0].indexLevel : 0;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{chartTitle}</h2>
      {hasReferenceData && maxDeviation && (
        <div className="mb-2 p-2 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Max Level Deviation:</strong> {maxDeviation.toFixed(4)} ({((maxDeviation / startingLevel) * 100).toFixed(2)}%)
          </p>
        </div>
      )}
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
              formatter={(value: number, name: string) => {
                const formatValue = name.includes('Level') ? value.toFixed(6) : value.toLocaleString();
                let displayName = name;
                if (name === 'indexLevel') displayName = 'Simulated Index Level';
                else if (name === 'referenceIndexLevel') displayName = 'Reference Index Level';
                else if (name === 'divisor') displayName = 'Simulated Divisor';
                else if (name === 'referenceDivisor') displayName = 'Reference Divisor';
                return [formatValue, displayName];
              }}
              labelStyle={{ color: '#374151' }}
            />
            <Legend />
            
            {/* Reference line for starting simulation level */}
            <ReferenceLine 
              yAxisId="level"
              y={startingLevel} 
              stroke="#ef4444" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ value: `Start: ${startingLevel.toFixed(2)}`, position: "insideTopRight" }}
            />
            
            <Line 
              yAxisId="level"
              type="monotone" 
              dataKey="indexLevel" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="indexLevel"
              dot={false}
            />
            {hasReferenceData && (
              <Line 
                yAxisId="level"
                type="monotone" 
                dataKey="referenceIndexLevel" 
                stroke="#10b981" 
                strokeWidth={2}
                name="referenceIndexLevel"
                dot={false}
                strokeDasharray="5 5"
              />
            )}
            {!isBondIndex && (
              <Line 
                yAxisId="divisor"
                type="monotone" 
                dataKey="divisor" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="divisor"
                dot={false}
              />
            )}
            {!isBondIndex && hasReferenceData && (
              <Line 
                yAxisId="divisor"
                type="monotone" 
                dataKey="referenceDivisor" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="referenceDivisor"
                dot={false}
                strokeDasharray="5 5"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IndexLevelChart;
