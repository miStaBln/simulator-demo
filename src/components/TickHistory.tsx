
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { IndexItem } from '@/contexts/StarredContext';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TickHistoryProps {
  indexData: IndexItem;
}

type TimeframeOption = '1d' | '1w' | '1m' | '1y' | 'max';

// Mock benchmark indices for demonstration
const benchmarkIndices = [
  { id: 'bm-1', name: 'S&P 500', ticker: 'SPX' },
  { id: 'bm-2', name: 'NASDAQ Composite', ticker: 'COMPX' },
  { id: 'bm-3', name: 'DAX', ticker: 'DAX' },
  { id: 'bm-4', name: 'Euro Stoxx 50', ticker: 'SX5E' },
  { id: 'bm-5', name: 'Nikkei 225', ticker: 'NI225' },
];

const TickHistory: React.FC<TickHistoryProps> = ({ indexData }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>('1m');
  const [benchmarkIndex, setBenchmarkIndex] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Generate mock data for the chart
  const generateChartData = (timeframe: TimeframeOption, includeIndex: boolean, includeBenchmark: boolean) => {
    const data = [];
    const now = new Date();
    const startLevel = 240 + Math.random() * 20;
    const benchmarkStartLevel = 320 + Math.random() * 30; // Different starting point for benchmark
    
    let numPoints = 0;
    let startDate = new Date();
    
    switch (timeframe) {
      case '1d':
        numPoints = 24; // Hourly data
        startDate = subDays(now, 1);
        break;
      case '1w':
        numPoints = 7; // Daily data
        startDate = subDays(now, 7);
        break;
      case '1m':
        numPoints = 30; // Daily data
        startDate = subMonths(now, 1);
        break;
      case '1y':
        numPoints = 12; // Monthly data
        startDate = subYears(now, 1);
        break;
      case 'max':
        numPoints = 60; // Monthly data for 5 years
        startDate = subYears(now, 5);
        break;
    }
    
    // Generate data points
    for (let i = 0; i < numPoints; i++) {
      const date = new Date(startDate);
      
      if (timeframe === '1d') {
        date.setHours(date.getHours() + i);
      } else if (timeframe === '1w' || timeframe === '1m') {
        date.setDate(date.getDate() + i);
      } else if (timeframe === '1y') {
        date.setMonth(date.getMonth() + i);
      } else {
        date.setMonth(date.getMonth() + i);
      }
      
      // Calculate random index level with slight trend
      const volatility = timeframe === '1d' ? 1 : timeframe === '1w' ? 3 : 5;
      const trend = timeframe === 'max' ? 0.5 : timeframe === '1y' ? 0.3 : 0.1;
      const randomChange = (Math.random() - 0.4) * volatility; // Slight upward bias
      const level = startLevel + (i * trend) + randomChange;
      
      // Calculate benchmark level (different pattern)
      const benchmarkVolatility = volatility * 1.2; // More volatile
      const benchmarkTrend = trend * 0.8; // Less trending
      const benchmarkRandomChange = (Math.random() - 0.5) * benchmarkVolatility;
      const benchmarkLevel = benchmarkStartLevel + (i * benchmarkTrend) + benchmarkRandomChange;
      
      const dataPoint: any = {
        date: format(date, timeframe === '1d' ? 'HH:mm' : 'yyyy-MM-dd'),
      };
      
      if (includeIndex) {
        dataPoint.level = parseFloat(level.toFixed(2));
      }
      
      if (includeBenchmark) {
        dataPoint.benchmark = parseFloat(benchmarkLevel.toFixed(2));
      }
      
      data.push(dataPoint);
    }
    
    return data;
  };
  
  const filteredBenchmarks = benchmarkIndices.filter(index => 
    index.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    index.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const selectedBenchmark = benchmarkIndices.find(index => index.id === benchmarkIndex);
  const chartData = generateChartData(
    selectedTimeframe, 
    true, 
    benchmarkIndex !== null
  );
  const lastTick = chartData[chartData.length - 1];
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-medium">Index Tick History</h2>
            <p className="text-sm text-gray-500">
              Historical tick data for {indexData.name}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant={selectedTimeframe === '1d' ? 'default' : 'outline'} 
              onClick={() => setSelectedTimeframe('1d')}
              size="sm"
              className={selectedTimeframe === '1d' ? 'bg-teal-500 hover:bg-teal-600' : ''}
            >
              1D
            </Button>
            <Button 
              variant={selectedTimeframe === '1w' ? 'default' : 'outline'} 
              onClick={() => setSelectedTimeframe('1w')}
              size="sm"
              className={selectedTimeframe === '1w' ? 'bg-teal-500 hover:bg-teal-600' : ''}
            >
              1W
            </Button>
            <Button 
              variant={selectedTimeframe === '1m' ? 'default' : 'outline'} 
              onClick={() => setSelectedTimeframe('1m')}
              size="sm"
              className={selectedTimeframe === '1m' ? 'bg-teal-500 hover:bg-teal-600' : ''}
            >
              1M
            </Button>
            <Button 
              variant={selectedTimeframe === '1y' ? 'default' : 'outline'} 
              onClick={() => setSelectedTimeframe('1y')}
              size="sm"
              className={selectedTimeframe === '1y' ? 'bg-teal-500 hover:bg-teal-600' : ''}
            >
              1Y
            </Button>
            <Button 
              variant={selectedTimeframe === 'max' ? 'default' : 'outline'} 
              onClick={() => setSelectedTimeframe('max')}
              size="sm"
              className={selectedTimeframe === 'max' ? 'bg-teal-500 hover:bg-teal-600' : ''}
            >
              MAX
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Benchmark Comparison</h3>
            {benchmarkIndex && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setBenchmarkIndex(null)}
                className="text-red-500 hover:text-red-600 text-xs"
              >
                Clear benchmark
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search for benchmark index..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-8"
              />
            </div>
            <Select value={benchmarkIndex || ""} onValueChange={setBenchmarkIndex}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select benchmark" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Benchmark Indices</SelectLabel>
                  {filteredBenchmarks.map((benchmark) => (
                    <SelectItem key={benchmark.id} value={benchmark.id}>
                      {benchmark.name} ({benchmark.ticker})
                    </SelectItem>
                  ))}
                  {filteredBenchmarks.length === 0 && (
                    <SelectItem value="none" disabled>No matching indices</SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {selectedBenchmark && (
            <div className="text-xs text-gray-500 mt-1">
              Comparing {indexData.name} with {selectedBenchmark.name} ({selectedBenchmark.ticker})
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Last Tick</div>
              <div className="text-xl font-medium">{lastTick.level}</div>
              <div className="text-xs text-gray-400">{format(new Date(), 'yyyy-MM-dd HH:mm:ss')}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Daily Change</div>
              <div className="text-xl font-medium text-green-600">+0.92%</div>
              <div className="text-xs text-gray-400">+2.21 points</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">YTD Change</div>
              <div className="text-xl font-medium text-green-600">+12.34%</div>
              <div className="text-xs text-gray-400">+26.75 points</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">52-Week Range</div>
              <div className="text-xl font-medium">218.46 - 258.92</div>
              <div className="text-xs text-gray-400">Current: {lastTick.level}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="level" 
                name={indexData.name} 
                stroke="#14b8a6" 
                activeDot={{ r: 8 }} 
              />
              {benchmarkIndex && (
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  name={selectedBenchmark?.name || "Benchmark"} 
                  stroke="#6366f1" 
                  strokeDasharray="5 5"
                  activeDot={{ r: 6 }} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TickHistory;
