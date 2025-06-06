
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for performance attribution
const mockPerformanceData = [
  { instrumentId: 'AAPL.OQ', performance: 2.45 },
  { instrumentId: 'BLUE.OQ', performance: -1.23 },
  { instrumentId: 'F.N', performance: 0.87 },
  { instrumentId: 'FRGE.N', performance: -0.56 },
  { instrumentId: 'GM.N', performance: 1.34 },
  { instrumentId: 'HITI.V', performance: -2.11 },
  { instrumentId: 'ML.N', performance: 3.22 },
  { instrumentId: 'SHOT.OQ', performance: -0.89 },
  { instrumentId: 'SUNS.OQ', performance: 1.76 },
  { instrumentId: 'TSLA.OQ', performance: 4.12 },
  { instrumentId: 'TSND.TO', performance: -1.45 },
  { instrumentId: 'VIV.N', performance: 0.23 }
].sort((a, b) => a.instrumentId.localeCompare(b.instrumentId));

// Calculate overall index performance (weighted average)
const overallPerformance = 1.34; // Mock overall index performance

interface PerformanceAttributionProps {
  onClose: () => void;
  indexName: string;
}

const PerformanceAttribution: React.FC<PerformanceAttributionProps> = ({ onClose, indexName }) => {
  const getColorIntensity = (performance: number) => {
    // Normalize performance to a 0-1 scale for color intensity
    const maxAbs = Math.max(...mockPerformanceData.map(d => Math.abs(d.performance)));
    const intensity = Math.abs(performance) / maxAbs;
    
    if (performance > 0) {
      // Green for positive performance
      return `rgba(34, 197, 94, ${0.2 + intensity * 0.8})`;
    } else {
      // Red for negative performance
      return `rgba(239, 68, 68, ${0.2 + intensity * 0.8})`;
    }
  };

  const getBackgroundColor = () => {
    if (overallPerformance > 0) {
      return `rgba(34, 197, 94, 0.1)`;
    } else {
      return `rgba(239, 68, 68, 0.1)`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-medium">Performance Attribution</h2>
              <p className="text-sm text-gray-600">{indexName}</p>
              <p className="text-sm text-gray-600">
                Overall Index Performance: 
                <span className={`ml-1 font-medium ${overallPerformance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overallPerformance >= 0 ? '+' : ''}{overallPerformance.toFixed(2)}%
                </span>
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div 
            className="p-4 rounded-lg border-2 border-dashed border-gray-300"
            style={{ backgroundColor: getBackgroundColor() }}
          >
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {mockPerformanceData.map((item) => (
                <div
                  key={item.instrumentId}
                  className="relative group aspect-square rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
                  style={{ backgroundColor: getColorIntensity(item.performance) }}
                >
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-800 mb-1">
                      {item.instrumentId}
                    </div>
                    <div className={`text-xs font-bold ${item.performance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                      {item.performance >= 0 ? '+' : ''}{item.performance.toFixed(2)}%
                    </div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {item.instrumentId}: {item.performance >= 0 ? '+' : ''}{item.performance.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center text-xs text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                <span>Negative Performance</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span>Positive Performance</span>
              </div>
            </div>
            <div className="text-gray-500">
              Instruments sorted alphabetically
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAttribution;
