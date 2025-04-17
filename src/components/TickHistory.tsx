
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

interface TickHistoryProps {
  indexData: IndexItem;
}

type TimeframeOption = '1d' | '1w' | '1m' | '1y' | 'max';

const TickHistory: React.FC<TickHistoryProps> = ({ indexData }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>('1m');
  
  // Generate mock data for the chart
  const generateChartData = (timeframe: TimeframeOption) => {
    const data = [];
    const now = new Date();
    const startLevel = 240 + Math.random() * 20;
    
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
      
      data.push({
        date: format(date, timeframe === '1d' ? 'HH:mm' : 'yyyy-MM-dd'),
        level: parseFloat(level.toFixed(2))
      });
    }
    
    return data;
  };
  
  const chartData = generateChartData(selectedTimeframe);
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
              <Line type="monotone" dataKey="level" stroke="#14b8a6" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TickHistory;
