import React, { useState } from 'react';
import { Search, X, Download, Filter, Columns, Maximize2 } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps {
  title: string;
  data: any[];
  isBondIndex?: boolean;
}

const DataTable = ({ title, data, isBondIndex = false }: DataTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(50);
  
  // Define headers based on index type
  const equityHeaders = [
    { key: 'ric', label: 'RIC' },
    { key: 'cas', label: 'CAs' },
    { key: 'quantity', label: 'Quantity (Units)' },
    { key: 'price', label: 'Price' },
    { key: 'currency', label: 'Currency' },
    { key: 'fx', label: 'FX' },
  ];

  const bondHeaders = [
    { key: 'ric', label: 'RIC' },
    { key: 'quantity', label: 'Amount' },
    { key: 'price', label: 'Price' },
    { key: 'weightingCapFactor', label: 'Weighting Cap Factor' },
    { key: 'baseMarketValue', label: 'Base Market Value' },
    { key: 'cashFlows', label: 'Cash Flows' },
    { key: 'compositionEnteredAt', label: 'Composition Entered At' },
    { key: 'compositionLeftAt', label: 'Composition Left At' },
  ];

  const headers = isBondIndex ? bondHeaders : equityHeaders;

  const renderCellContent = (row: any, key: string) => {
    if (key === 'cashFlows' && row.cashFlows) {
      return (
        <div className="text-xs">
          {row.cashFlows.map((flow: any, index: number) => (
            <div key={index} className="mb-1">
              <div className="font-medium">{flow.labels?.join(', ') || 'N/A'}</div>
              <div>{flow.value?.toLocaleString() || 'N/A'}</div>
            </div>
          ))}
        </div>
      );
    }
    
    if (key === 'baseMarketValue' && row.baseMarketValue) {
      return parseFloat(row.baseMarketValue).toLocaleString();
    }
    
    if (key === 'weightingCapFactor' && row.weightingCapFactor) {
      return parseFloat(row.weightingCapFactor).toFixed(4);
    }
    
    if (key === 'compositionLeftAt') {
      return row.compositionLeftAt || 'N/A';
    }
    
    return row[key] || '';
  };

  return (
    <div className="bg-white rounded-md shadow-sm">
      <div className="p-4">
        <h2 className="text-lg font-medium mb-4">{title}</h2>
        
        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center px-3 py-1.5 text-green-500 text-sm border border-green-500 rounded hover:bg-green-50">
            <Download className="h-4 w-4 mr-2" />
            EXPORT
          </button>
          
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 border rounded text-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button className="p-1.5 border rounded hover:bg-gray-50">
              <Filter className="h-4 w-4 text-gray-500" />
            </button>
            <button className="p-1.5 border rounded hover:bg-gray-50">
              <Columns className="h-4 w-4 text-gray-500" />
            </button>
            <button className="p-1.5 border rounded hover:bg-gray-50">
              <Maximize2 className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                {headers.map((header) => (
                  <th 
                    key={header.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {headers.map((header) => (
                    <td key={header.key} className="px-4 py-3 text-sm">
                      {renderCellContent(row, header.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <span className="mr-2 text-sm">Rows per page</span>
            <select 
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <span>1-{Math.min(data.length, rowsPerPage)} of {data.length}</span>
            <div className="flex">
              <button className="p-1 border rounded-l hover:bg-gray-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-1 border border-l-0 rounded-r hover:bg-gray-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
