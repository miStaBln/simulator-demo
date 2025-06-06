import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend,
  Tooltip
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IndexItem } from '@/contexts/StarredContext';
import { CalendarIcon, Download, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import PerformanceAttribution from './PerformanceAttribution';

// Mock data for the charts
const mockCurrencyData = [
  { name: 'USD', value: 45, fill: '#0088FE' },
  { name: 'EUR', value: 25, fill: '#00C49F' },
  { name: 'CAD', value: 20, fill: '#FFBB28' },
  { name: 'GBP', value: 10, fill: '#FF8042' }
];

const mockCountryData = [
  { name: 'USA', value: 40, fill: '#0088FE' },
  { name: 'Germany', value: 20, fill: '#00C49F' },
  { name: 'Canada', value: 15, fill: '#FFBB28' },
  { name: 'UK', value: 10, fill: '#FF8042' },
  { name: 'Others', value: 15, fill: '#8884D8' }
];

// Mock data for the table
const mockTableData = [
  { 
    ric: 'TSND.TO', 
    ticker: 'TSND CT Equity', 
    cas: '5163802.76193514', 
    quantity: '0.36', 
    closingPrice: '1.93307529', 
    currency: 'CAD', 
    fx: '1', 
    freeFloatFactor: '1', 
    weightingFactor: '1', 
    indexValue: '5.36965359', 
    indexShares: '0.03400187', 
    indexWeights: '1858968.9842966', 
    mcapFull: '1858968.9842966' 
  },
  { 
    ric: 'SUNS.OQ', 
    ticker: 'SUNS UR Equity', 
    cas: '115913.605604935', 
    quantity: '8.53', 
    closingPrice: '1.42558348', 
    currency: 'USD', 
    fx: '1.3665405', 
    freeFloatFactor: '1', 
    weightingFactor: '1', 
    indexValue: '0.12053441', 
    indexShares: '0.02507533', 
    indexWeights: '1370932.3662072', 
    mcapFull: '1370932.3662072' 
  },
  { 
    ric: 'HITI.V', 
    ticker: 'HITI CV Equity', 
    cas: '1505052.19744404', 
    quantity: '2.82', 
    closingPrice: '4.41344068', 
    currency: 'CAD', 
    fx: '1', 
    freeFloatFactor: '1', 
    weightingFactor: '1', 
    indexValue: '1.56504989', 
    indexShares: '0.0776303', 
    indexWeights: '4244247.19763922', 
    mcapFull: '4244247.19763922' 
  }
];

interface IndexReportProps {
  indexData: IndexItem;
}

const IndexReport: React.FC<IndexReportProps> = ({ indexData }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isPerformanceAttributionOpen, setIsPerformanceAttributionOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-gray-100">
            <span className="mr-2">SOD</span>
          </Button>
          <Button variant="outline" className="bg-gray-100">
            <span className="mr-2">EOD</span>
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'dd.MM.yyyy') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Button className="bg-teal-500 hover:bg-teal-600">
            <Download className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-4">End of Day (EOD) Basket Report</h2>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Ticker</td>
                    <td className="py-2">{indexData.ticker} Index</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Level</td>
                    <td className="py-2">56.8520357823687985</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Divisor</td>
                    <td className="py-2">961664.039596</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">No. Members</td>
                    <td className="py-2">20</td>
                  </tr>
                </tbody>
              </table>
              
              <div className="mt-4 space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAnalysisOpen(true)}
                  className="w-full text-teal-500 border-teal-500 hover:bg-teal-50"
                >
                  Adjustments Explained
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsPerformanceAttributionOpen(true)}
                  className="w-full text-blue-500 border-blue-500 hover:bg-blue-50"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Performance Attribution
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">Weights by Currency</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockCurrencyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockCurrencyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">Weights by Country</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockCountryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockCountryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">RIC</TableHead>
                  <TableHead className="whitespace-nowrap">Ticker</TableHead>
                  <TableHead className="whitespace-nowrap">CAs</TableHead>
                  <TableHead className="whitespace-nowrap">Quantity (Units)</TableHead>
                  <TableHead className="whitespace-nowrap">Closing Price</TableHead>
                  <TableHead className="whitespace-nowrap">Currency</TableHead>
                  <TableHead className="whitespace-nowrap">FX</TableHead>
                  <TableHead className="whitespace-nowrap">Free Float Factor</TableHead>
                  <TableHead className="whitespace-nowrap">Weighting Factor</TableHead>
                  <TableHead className="whitespace-nowrap">Index Value</TableHead>
                  <TableHead className="whitespace-nowrap">Index Shares</TableHead>
                  <TableHead className="whitespace-nowrap">Index Weights</TableHead>
                  <TableHead className="whitespace-nowrap">MCAP Full</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTableData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="whitespace-nowrap font-medium">{item.ric}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.ticker}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.cas}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.quantity}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.closingPrice}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.currency}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.fx}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.freeFloatFactor}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.weightingFactor}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.indexValue}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.indexShares}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.indexWeights}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.mcapFull}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {isAnalysisOpen && (
        <ReportAnalysis onClose={() => setIsAnalysisOpen(false)} indexData={indexData} />
      )}
      
      {isPerformanceAttributionOpen && (
        <PerformanceAttribution 
          onClose={() => setIsPerformanceAttributionOpen(false)} 
          indexName={indexData.name}
        />
      )}
    </div>
  );
};

// Implement the Report Analysis component for the "Adjustments Explained" popup
const ReportAnalysis = ({ onClose, indexData }: { onClose: () => void, indexData: IndexItem }) => {
  const mockAdjustments = [
    {
      constituent: 'TSND.TO',
      eventType: 'Stock Split',
      beforeShares: '0.18',
      afterShares: '0.36',
      priceBefore: '3.86615058',
      priceAfter: '1.93307529',
      adjustmentFactor: '2.0',
      effectiveDate: '2025-04-15'
    },
    {
      constituent: 'SUNS.OQ',
      eventType: 'Dividend',
      beforeShares: '8.53',
      afterShares: '8.53',
      priceBefore: '1.42558348',
      priceAfter: '1.42558348',
      adjustmentFactor: '1.0',
      effectiveDate: '2025-04-15'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Adjustments Explained</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>
          
          <div className="mb-4">
            <table className="w-full text-sm mb-6">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Index</td>
                  <td className="py-2">{indexData.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Level Before</td>
                  <td className="py-2">56.7134689710987</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Level After</td>
                  <td className="py-2">56.8520357823687985</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Divisor Before</td>
                  <td className="py-2">961664.039596</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Divisor After</td>
                  <td className="py-2">961664.039596</td>
                </tr>
              </tbody>
            </table>
            
            <h3 className="text-lg font-medium mb-2">Constituent Adjustments</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Constituent</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Shares Before</TableHead>
                  <TableHead>Shares After</TableHead>
                  <TableHead>Price Before</TableHead>
                  <TableHead>Price After</TableHead>
                  <TableHead>Adjustment Factor</TableHead>
                  <TableHead>Effective Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAdjustments.map((adj, i) => (
                  <TableRow key={i}>
                    <TableCell>{adj.constituent}</TableCell>
                    <TableCell>{adj.eventType}</TableCell>
                    <TableCell>{adj.beforeShares}</TableCell>
                    <TableCell>{adj.afterShares}</TableCell>
                    <TableCell>{adj.priceBefore}</TableCell>
                    <TableCell>{adj.priceAfter}</TableCell>
                    <TableCell>{adj.adjustmentFactor}</TableCell>
                    <TableCell>{adj.effectiveDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexReport;
