
import React from 'react';
import { TimeSeriesItem } from '@/utils/timeSeriesCalculations';

interface TimeSeriesTableProps {
  data: TimeSeriesItem[];
  displayData: TimeSeriesItem[];
  showAll: boolean;
  onToggleShowAll: () => void;
}

const TimeSeriesTable: React.FC<TimeSeriesTableProps> = ({ 
  data, 
  displayData, 
  showAll, 
  onToggleShowAll 
}) => {
  return (
    <>
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

      {data.length > 10 && (
        <div className="text-center">
          <button
            onClick={onToggleShowAll}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {showAll ? 'Show Less' : `Show All ${data.length} Results`}
          </button>
        </div>
      )}
    </>
  );
};

export default TimeSeriesTable;
