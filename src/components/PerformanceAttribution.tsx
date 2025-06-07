
import React from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Function to generate mock data based on index
const generateMockData = (indexName: string) => {
  // Check if this is the second index (you can adjust this condition based on the actual index name)
  const isLargeIndex = indexName.includes('European') || indexName.includes('Global') || indexName.includes('500');
  
  if (isLargeIndex) {
    // Generate 500 instruments for large scale testing
    const instruments = [];
    const companies = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'ADBE', 'CRM', 'ORCL', 'IBM', 'INTC', 'AMD', 'QCOM', 'AVGO', 'TXN', 'CSCO', 'PYPL', 'V', 'MA', 'JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'AXP', 'USB', 'PNC', 'COF', 'BK', 'STT', 'SCHW', 'CB', 'ICE', 'CME', 'SPGI', 'MCO', 'BLK', 'T', 'VZ', 'TMUS', 'S', 'KO', 'PEP', 'MCD', 'SBUX', 'NKE', 'DIS'];
    const exchanges = ['.OQ', '.N', '.TO', '.V', '.L', '.PA', '.DE', '.MI', '.AS', '.BR'];
    
    for (let i = 0; i < 500; i++) {
      const company = companies[i % companies.length];
      const exchange = exchanges[i % exchanges.length];
      const suffix = i > companies.length ? Math.floor(i / companies.length) : '';
      const instrumentId = `${company}${suffix}${exchange}`;
      
      // Generate realistic performance data with some clustering
      const basePerformance = (Math.random() - 0.5) * 8; // Range from -4% to +4%
      const noise = (Math.random() - 0.5) * 2; // Add some noise
      const performance = Number((basePerformance + noise).toFixed(2));
      
      instruments.push({
        instrumentId,
        performance
      });
    }
    
    return instruments.sort((a, b) => a.instrumentId.localeCompare(b.instrumentId));
  } else {
    // Original smaller dataset for other indices
    return [
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
  }
};

interface PerformanceAttributionProps {
  onClose: () => void;
  indexName: string;
}

const PerformanceAttribution: React.FC<PerformanceAttributionProps> = ({ onClose, indexName }) => {
  // Generate mock data based on the index
  const mockPerformanceData = generateMockData(indexName);
  
  // Calculate overall index performance (weighted average)
  const overallPerformance = mockPerformanceData.length > 100 ? 
    Number((mockPerformanceData.reduce((sum, item) => sum + item.performance, 0) / mockPerformanceData.length).toFixed(2)) :
    1.34; // Mock overall index performance for smaller datasets

  // Mock dates - in a real implementation, these would come from props or context
  const reportDate = '2025-06-06';
  const previousDate = '2025-06-05';

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

  const downloadCSV = () => {
    const headers = ['Instrument ID', 'Performance (%)'];
    const csvContent = [
      headers.join(','),
      ...mockPerformanceData.map(item => 
        `${item.instrumentId},${item.performance.toFixed(2)}`
      ),
      `Overall Index Performance,${overallPerformance.toFixed(2)}`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `performance_attribution_${indexName.replace(/\s+/g, '_')}_${reportDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Determine grid columns based on dataset size
  const getGridColumns = () => {
    if (mockPerformanceData.length > 100) {
      return 'grid-cols-8 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20';
    }
    return 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-medium">Performance Attribution</h2>
              <p className="text-sm text-gray-600">{indexName}</p>
              <p className="text-sm text-gray-600">
                Comparing {previousDate} vs {reportDate}
              </p>
              <p className="text-sm text-gray-600">
                Overall Index Performance: 
                <span className={`ml-1 font-medium ${overallPerformance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overallPerformance >= 0 ? '+' : ''}{overallPerformance.toFixed(2)}%
                </span>
              </p>
              <p className="text-xs text-gray-500">
                {mockPerformanceData.length} instruments
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={downloadCSV}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div 
            className="p-4 rounded-lg border-2 border-dashed border-gray-300 max-h-[60vh] overflow-y-auto"
            style={{ backgroundColor: getBackgroundColor() }}
          >
            <div className={`grid ${getGridColumns()} gap-1`}>
              {mockPerformanceData.map((item) => (
                <div
                  key={item.instrumentId}
                  className="relative group aspect-square rounded border border-gray-200 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md hover:z-10"
                  style={{ backgroundColor: getColorIntensity(item.performance) }}
                >
                  <div className="text-center">
                    <div className="text-[8px] md:text-xs font-medium text-gray-800 mb-0.5 truncate px-1">
                      {item.instrumentId.length > 8 ? item.instrumentId.substring(0, 6) + '...' : item.instrumentId}
                    </div>
                    <div className={`text-[8px] md:text-xs font-bold ${item.performance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                      {item.performance >= 0 ? '+' : ''}{item.performance.toFixed(1)}%
                    </div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
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
