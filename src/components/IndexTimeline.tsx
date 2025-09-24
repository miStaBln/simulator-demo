import React, { useState } from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IndexItem } from '@/contexts/StarredContext';
import { ArrowRight, CalendarIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'rebalancing' | 'corporate-action' | 'today' | 'selection-day';
  title: string;
  color: string;
  description: string;
  rebalancingType?: string;
  effectiveDate?: string;
  instruments?: Array<{
    ric: string;
    weightBefore: number;
    weightAfter: number;
    sharesBefore: number;
    sharesAfter: number;
    delta: number;
    status: 'addition' | 'deletion' | 'modified';
  }>;
}

interface IndexTimelineProps {
  indexData: IndexItem & {
    status: string;
    startDate: string;
    assetClass: string;
    indexType: string;
    region: string;
  };
}

const IndexTimeline: React.FC<IndexTimelineProps> = ({ indexData }) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  
  // Date range state - default to 6 months past and 1 month future
  const today = new Date();
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subMonths(today, 6),
    to: addMonths(today, 1)
  });
  
  const [fromDate, setFromDate] = useState<Date | undefined>(dateRange.from);
  const [toDate, setToDate] = useState<Date | undefined>(dateRange.to);
  
  // Sample Total Absolute Delta data
  const deltaData = [
    { exchange: 'NASDAQ', delta: 12.5 },
    { exchange: 'NYSE', delta: 8.3 },
    { exchange: 'LSE', delta: 4.7 },
    { exchange: 'TSE', delta: 3.2 },
    { exchange: 'XETRA', delta: 6.1 },
  ];

  // Generate timeline events - today in the middle
  const events: TimelineEvent[] = [
    // Past events (left side)
    {
      id: 'event1',
      date: new Date(2024, 3, 1),
      type: 'rebalancing',
      title: 'Rebalancing',
      color: 'bg-gray-400',
      description: 'Quarterly Rebalancing',
      rebalancingType: 'Quarterly Rebalancing',
      effectiveDate: '01.04.2024',
      instruments: [
        { ric: 'AAPL.OQ', weightBefore: 5.2, weightAfter: 0, sharesBefore: 1200, sharesAfter: 0, delta: -5.2, status: 'deletion' },
        { ric: 'MSFT.OQ', weightBefore: 4.8, weightAfter: 5.5, sharesBefore: 800, sharesAfter: 900, delta: 0.7, status: 'modified' },
        { ric: 'TSLA.OQ', weightBefore: 0, weightAfter: 3.2, sharesBefore: 0, sharesAfter: 650, delta: 3.2, status: 'addition' },
      ]
    },
    {
      id: 'event2',
      date: new Date(2024, 6, 1),
      type: 'rebalancing',
      title: 'Rebalancing',
      color: 'bg-gray-400',
      description: 'Quarterly Rebalancing',
      rebalancingType: 'Quarterly Rebalancing',
      effectiveDate: '01.07.2024',
      instruments: [
        { ric: 'GOOGL.OQ', weightBefore: 3.8, weightAfter: 4.2, sharesBefore: 300, sharesAfter: 340, delta: 0.4, status: 'modified' },
        { ric: 'NVDA.OQ', weightBefore: 0, weightAfter: 2.8, sharesBefore: 0, sharesAfter: 450, delta: 2.8, status: 'addition' },
      ]
    },
    {
      id: 'event3',
      date: new Date(2024, 11, 15), // Changed to past date (December 15, 2024)
      type: 'selection-day',
      title: 'Selection Day',
      color: 'bg-gray-400',
      description: 'Annual Selection Day',
      rebalancingType: 'Annual Selection',
      effectiveDate: '15.12.2024',
      instruments: [
        { ric: 'JPM.N', weightBefore: 0, weightAfter: 2.1, sharesBefore: 0, sharesAfter: 180, delta: 2.1, status: 'addition' },
        { ric: 'BAC.N', weightBefore: 1.9, weightAfter: 0, sharesBefore: 220, sharesAfter: 0, delta: -1.9, status: 'deletion' },
        { ric: 'WFC.N', weightBefore: 2.3, weightAfter: 2.8, sharesBefore: 280, sharesAfter: 340, delta: 0.5, status: 'modified' },
      ]
    },
    // Today (middle)
    {
      id: 'today',
      date: today,
      type: 'today',
      title: 'Today',
      color: 'bg-black',
      description: 'Current Date',
    },
    // Future events (right side)
    {
      id: 'event4',
      date: new Date(2025, 6, 1),
      type: 'rebalancing',
      title: 'Rebalancing',
      color: 'bg-green-500',  
      description: 'Quarterly Rebalancing',
      rebalancingType: 'Quarterly Rebalancing',
      effectiveDate: '01.07.2025',
      instruments: [
        { ric: 'META.OQ', weightBefore: 2.5, weightAfter: 3.1, sharesBefore: 200, sharesAfter: 250, delta: 0.6, status: 'modified' },
        { ric: 'AMZN.OQ', weightBefore: 0, weightAfter: 4.5, sharesBefore: 0, sharesAfter: 320, delta: 4.5, status: 'addition' },
      ]
    },
    {
      id: 'event5',
      date: new Date(2025, 9, 1),
      type: 'rebalancing',
      title: 'Rebalancing',
      color: 'bg-green-500',
      description: 'Quarterly Rebalancing',
      rebalancingType: 'Quarterly Rebalancing',
      effectiveDate: '01.10.2025',
      instruments: [
        { ric: 'NFLX.OQ', weightBefore: 1.2, weightAfter: 0, sharesBefore: 80, sharesAfter: 0, delta: -1.2, status: 'deletion' },
        { ric: 'CRM.N', weightBefore: 1.8, weightAfter: 2.3, sharesBefore: 150, sharesAfter: 190, delta: 0.5, status: 'modified' },
      ]
    },
  ];

  // Sort events by date and filter by date range
  const sortedEvents = [...events]
    .filter(event => event.date >= dateRange.from && event.date <= dateRange.to)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const updateDateRange = () => {
    if (fromDate && toDate) {
      setDateRange({ from: fromDate, to: toDate });
    }
  };
  
  const openEventDetails = (event: TimelineEvent) => {
    setSelectedEvent(event);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'addition': return 'text-green-600';
      case 'deletion': return 'text-red-600';
      default: return 'text-gray-900';
    }
  };

  const calculateTotalDelta = (instruments: Array<{delta: number}>) => {
    return instruments.reduce((total, instrument) => total + Math.abs(instrument.delta), 0);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-medium">Index Timeline</h2>
          
          {/* Date Range Picker */}
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[140px] justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "dd/MM/yyyy") : <span>From date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <span className="text-sm text-gray-500">to</span>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[140px] justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "dd/MM/yyyy") : <span>To date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <Button onClick={updateDateRange} size="sm">
              Apply
            </Button>
          </div>
        </div>
        
        <div className="relative mb-16">
          {/* Timeline line */}
          <div className="absolute h-1 bg-gray-200 left-0 right-0 top-10"></div>
          
          {/* Timeline events */}
          <div className="flex justify-between relative">
            {sortedEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="flex flex-col items-center"
                style={{ zIndex: event.type === 'today' ? 3 : 1 }}
              >
                <div 
                  className={`cursor-pointer transition-all duration-300 hover:scale-110 rounded-full flex items-center justify-center text-xs font-medium ${
                    event.type === 'today' ? 'text-white z-10' : 'text-white'
                  } ${
                    selectedEvent?.id === event.id ? 'h-16 w-16 scale-110' : 'h-12 w-12'
                  } ${
                    event.date < today && event.type !== 'today' ? 'bg-gray-400' : 
                    event.type === 'today' ? 'bg-black' : 'bg-green-500'
                  }`}
                  onClick={() => openEventDetails(event)}
                >
                  {event.type === 'today' ? 'TODAY' : ''}
                </div>
                
                <div className={`w-0.5 h-${index % 2 === 0 ? 12 : 8} ${event.type === 'today' ? 'bg-black' : 'bg-gray-300'} mt-2`}></div>
                
                <div className={`text-xs ${index % 2 === 0 ? 'mt-0' : 'mt-4'}`}>
                  {format(event.date, 'dd.MM.yyyy')}
                </div>
                
                <div className={`text-sm font-medium mt-1 ${event.type === 'today' ? 'text-black' : ''}`}>
                  {event.title}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs mt-1 h-6 p-0"
                  onClick={() => openEventDetails(event)}
                >
                  Details
                </Button>
              </div>
            ))}
          </div>
          
          {/* Connecting arrows between events */}
          <div className="absolute top-10 left-0 right-0 flex justify-between">
            {sortedEvents.slice(0, -1).map((_, index) => (
              <div key={index} className="flex-1 flex justify-center items-center">
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mb-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
            <span className="text-xs">Past Events</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-black mr-2"></div>
            <span className="text-xs">Today</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs">Future Events</span>
          </div>
        </div>
        
        {/* Event details table */}
        {selectedEvent && (
          <div className="mt-8 space-y-6">
            {/* Header section with chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Rebalancing Type:</span>
                    <div className="text-lg font-semibold">{selectedEvent.rebalancingType || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Effective Date:</span>
                    <div className="text-lg font-semibold">{selectedEvent.effectiveDate || format(selectedEvent.date, 'dd.MM.yyyy')}</div>
                  </div>
                  {selectedEvent.instruments && (
                    <div className="col-span-2">
                      <span className="text-sm font-medium text-gray-600">Total Absolute Delta:</span>
                      <div className="text-lg font-semibold text-primary">{calculateTotalDelta(selectedEvent.instruments).toFixed(2)}%</div>
                    </div>
                  )}
                </div>
                
                {/* Small chart */}
                {selectedEvent.instruments && selectedEvent.instruments.length > 0 && (
                  <div className="w-80 h-48 ml-6">
                    <h4 className="text-sm font-medium mb-2">Total Absolute Delta by Exchange</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deltaData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="exchange" fontSize={10} />
                        <YAxis fontSize={10} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Total Absolute Delta']} />
                        <Bar dataKey="delta" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Instruments table */}
            {selectedEvent.instruments && selectedEvent.instruments.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Constituent Changes</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>RIC</TableHead>
                      <TableHead>Weight Before (%)</TableHead>
                      <TableHead>Weight After (%)</TableHead>
                      <TableHead>Shares Before</TableHead>
                      <TableHead>Shares After</TableHead>
                      <TableHead>Delta (%)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedEvent.instruments.map((instrument, index) => (
                      <TableRow key={index} className={getStatusColor(instrument.status)}>
                        <TableCell className="font-medium">{instrument.ric}</TableCell>
                        <TableCell>{instrument.weightBefore.toFixed(2)}</TableCell>
                        <TableCell>{instrument.weightAfter.toFixed(2)}</TableCell>
                        <TableCell>{instrument.sharesBefore.toLocaleString()}</TableCell>
                        <TableCell>{instrument.sharesAfter.toLocaleString()}</TableCell>
                        <TableCell className={getStatusColor(instrument.status)}>
                          {instrument.delta > 0 ? '+' : ''}{instrument.delta.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            instrument.status === 'addition' ? 'bg-green-100 text-green-800' :
                            instrument.status === 'deletion' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {instrument.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IndexTimeline;