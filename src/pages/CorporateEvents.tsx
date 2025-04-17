
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CalendarIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CorporateEvent {
  id: string;
  date: string;
  constituent: string;
  ric: string;
  eventType: 'Dividend' | 'Stock Split' | 'Merger' | 'Acquisition' | 'Spin-off';
  status: 'Pending' | 'Confirmed' | 'Processed';
  details: {
    [key: string]: string | number;
  };
}

const CorporateEvents = () => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [dateFrom, setDateFrom] = useState<Date>(new Date());
  const [dateTo, setDateTo] = useState<Date>(new Date());

  // Mock data for corporate events
  const corporateEvents: CorporateEvent[] = [
    {
      id: 'ca1',
      date: '2025-04-25',
      constituent: 'TSLA.OQ',
      ric: 'TSLA.OQ',
      eventType: 'Stock Split',
      status: 'Confirmed',
      details: {
        'Ratio': '3:1',
        'Ex-Date': '2025-04-25',
        'Pay Date': '2025-04-28',
        'Announcement Date': '2025-04-10',
        'Record Date': '2025-04-24',
        'Adjustment Factor': '3.0'
      }
    },
    {
      id: 'ca2',
      date: '2025-04-26',
      constituent: 'BLUE.OQ',
      ric: 'BLUE.OQ',
      eventType: 'Dividend',
      status: 'Pending',
      details: {
        'Dividend Amount': '0.25 USD',
        'Ex-Date': '2025-04-26',
        'Pay Date': '2025-05-05',
        'Announcement Date': '2025-04-12',
        'Record Date': '2025-04-27',
        'Dividend Type': 'Regular Cash'
      }
    },
    {
      id: 'ca3',
      date: '2025-04-28',
      constituent: 'VIV.N',
      ric: 'VIV.N',
      eventType: 'Merger',
      status: 'Pending',
      details: {
        'Target': 'VIV.N',
        'Acquirer': 'ACQ.N',
        'Type': 'Cash and Stock',
        'Cash Component': '15.00 USD per share',
        'Stock Component': '0.5 shares of ACQ.N per VIV.N share',
        'Announcement Date': '2025-03-15',
        'Expected Completion': '2025-04-28'
      }
    },
    {
      id: 'ca4',
      date: '2025-05-01',
      constituent: 'FRGE.N',
      ric: 'FRGE.N',
      eventType: 'Spin-off',
      status: 'Confirmed',
      details: {
        'Parent Company': 'FRGE.N',
        'Spin-off Entity': 'FSUB.N',
        'Ratio': '0.2 shares of FSUB.N per FRGE.N share',
        'Ex-Date': '2025-05-01',
        'Distribution Date': '2025-05-10',
        'Announcement Date': '2025-04-05',
        'Record Date': '2025-04-30'
      }
    },
    {
      id: 'ca5',
      date: '2025-05-03',
      constituent: 'ML.N',
      ric: 'ML.N',
      eventType: 'Acquisition',
      status: 'Confirmed',
      details: {
        'Target': 'ML.N',
        'Acquirer': 'BG.N',
        'Type': 'All Cash',
        'Offer Price': '95.50 USD per share',
        'Announcement Date': '2025-04-10',
        'Expected Completion': '2025-05-03',
        'Premium': '11.8%'
      }
    }
  ];

  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter events based on date range
  const filteredEvents = corporateEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= dateFrom && eventDate <= dateTo;
  });

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Corporate Events</h1>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, 'PPP') : <span>From date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={(date) => date && setDateFrom(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, 'PPP') : <span>To date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={(date) => date && setDateTo(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 mb-4">
              Showing corporate events between {format(dateFrom, 'PPP')} and {format(dateTo, 'PPP')}.
            </p>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Constituent</TableHead>
                  <TableHead>RIC</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No corporate events found for the selected date range.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <React.Fragment key={event.id}>
                      <TableRow className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleRowExpansion(event.id)}>
                        <TableCell>
                          {expandedRows[event.id] ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.constituent}</TableCell>
                        <TableCell>{event.ric}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.eventType)}`}>
                            {event.eventType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </TableCell>
                      </TableRow>
                      {expandedRows[event.id] && (
                        <TableRow className="bg-gray-50">
                          <TableCell colSpan={6}>
                            <div className="p-4">
                              <h3 className="text-sm font-medium mb-2">Corporate Action Details</h3>
                              <div className="grid grid-cols-2 gap-4">
                                {Object.entries(event.details).map(([key, value]) => (
                                  <div key={key} className="flex space-x-2">
                                    <span className="text-sm font-medium text-gray-500">{key}:</span>
                                    <span className="text-sm">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper functions for styling
const getEventTypeColor = (eventType: string) => {
  switch (eventType) {
    case 'Dividend':
      return 'bg-green-100 text-green-800';
    case 'Stock Split':
      return 'bg-blue-100 text-blue-800';
    case 'Merger':
      return 'bg-purple-100 text-purple-800';
    case 'Acquisition':
      return 'bg-orange-100 text-orange-800';
    case 'Spin-off':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'Processed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default CorporateEvents;
