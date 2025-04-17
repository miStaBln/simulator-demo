
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Search, ChevronLeft, ChevronRight, Download, Filter, Columns, Maximize2, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TimeSeriesData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [reportType, setReportType] = useState('Closing');
  
  // Sample data for the table and chart
  const data = [
    { date: '15/04/2025', level: 202.14 },
    { date: '16/04/2025', level: 194.27 },
  ];
  
  // Generate more sample data points for the chart
  const chartData = [
    { date: '11/04/2025', level: 202.45 },
    { date: '12/04/2025', level: 201.89 },
    { date: '13/04/2025', level: 200.32 },
    { date: '14/04/2025', level: 198.76 },
    { date: '15/04/2025', level: 202.14 },
    { date: '16/04/2025', level: 194.27 },
    { date: '17/04/2025', level: 190.11 },
    { date: '18/04/2025', level: 186.34 },
    { date: '19/04/2025', level: 184.14 },
  ];

  const sortTable = () => {
    // Sort implementation would go here
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-md shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Time Series Analysis</h2>
          
          <div className="flex items-center">
            <span className="text-sm mr-2">Report Type</span>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-36 h-8">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Closing">Closing</SelectItem>
                <SelectItem value="Opening">Opening</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <h3 className="text-sm font-medium mb-4">Time Series Data</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table */}
          <div className="bg-gray-50 rounded-md p-2">
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-1.5 h-8 text-sm"
                />
              </div>
              
              <div className="flex space-x-2">
                <button className="p-1 border rounded hover:bg-gray-100">
                  <Filter className="h-4 w-4 text-gray-500" />
                </button>
                <button className="p-1 border rounded hover:bg-gray-100">
                  <Columns className="h-4 w-4 text-gray-500" />
                </button>
                <button className="p-1 border rounded hover:bg-gray-100">
                  <Maximize2 className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button className="flex items-center" onClick={sortTable}>
                        Simulation Date
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button className="flex items-center" onClick={sortTable}>
                        Index Level
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{row.date}</td>
                      <td className="px-4 py-3 text-sm">{row.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <span className="mr-2 text-xs">Rows per page</span>
                <select 
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-xs"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2 text-xs">
                <span>1-2 of 2</span>
                <div className="flex">
                  <button className="p-1 border rounded-l hover:bg-gray-100">
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button className="p-1 border border-l-0 rounded-r hover:bg-gray-100">
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart */}
          <div className="bg-white h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 10,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  domain={['dataMin - 5', 'dataMax + 5']} 
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip 
                  formatter={(value) => [`${value}`, 'Index Level']}
                  labelFormatter={(value) => `Date: ${value}`}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: 10 }}
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="level" 
                  name="Index Level" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button className="flex items-center px-3 py-1.5 text-teal-500 text-sm border border-teal-500 rounded hover:bg-teal-50">
            <Download className="h-4 w-4 mr-2" />
            EXPORT DATA
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesData;
