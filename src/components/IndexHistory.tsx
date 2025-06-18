
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IndexItem } from '@/contexts/StarredContext';
import { Calendar, Filter, Search, X } from 'lucide-react';

interface HistoryEvent {
  id: string;
  date: Date;
  eventType: 'CORPORATE_ACTION' | 'REBALANCE';
  newIndexVersion: number;
  oldDivisor: string;
  newDivisor: string;
  deltaDivisor: string;
  aggLateDivPoints?: string;
  details?: any;
}

interface IndexHistoryProps {
  indexData: IndexItem & {
    status: string;
    startDate: string;
    assetClass: string;
    indexType: string;
    region: string;
  };
}

const IndexHistory: React.FC<IndexHistoryProps> = ({ indexData }) => {
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('2025-03-03');
  const [endDate, setEndDate] = useState('2025-06-18');

  // Sample history data based on the screenshots
  const historyEvents: HistoryEvent[] = [
    {
      id: '1',
      date: new Date('2025-03-03T00:15:56'),
      eventType: 'CORPORATE_ACTION',
      newIndexVersion: 469,
      oldDivisor: '179720583542.73737',
      newDivisor: '179717612678.62357',
      deltaDivisor: '-2970864.1138',
      details: {
        secId: '600177.SS',
        type: 'CASH_DIVIDEND',
        closePrice: 8.24,
        adjustedClose: 8.15,
        fx: 1,
        whtRate: 10
      }
    },
    {
      id: '2',
      date: new Date('2025-03-28T00:10:25'),
      eventType: 'CORPORATE_ACTION',
      newIndexVersion: 470,
      oldDivisor: '179717612678.62357',
      newDivisor: '179710663407.1153',
      deltaDivisor: '-6949271.50827'
    },
    {
      id: '3',
      date: new Date('2025-04-01T00:10:38'),
      eventType: 'CORPORATE_ACTION',
      newIndexVersion: 471,
      oldDivisor: '179710663407.1153',
      newDivisor: '179694506860.11285',
      deltaDivisor: '-16156547.002441'
    },
    {
      id: '4',
      date: new Date('2025-04-16T05:47:30'),
      eventType: 'REBALANCE',
      newIndexVersion: 473,
      oldDivisor: '',
      newDivisor: '',
      deltaDivisor: '0',
      details: {
        membershipChanges: [
          {
            secId: '600705.SS',
            type: 'UPDATE',
            noshOld: 5351984777.44,
            noshNew: 0,
            noshDiff: -5351984777.44
          }
        ]
      }
    },
    {
      id: '5',
      date: new Date('2025-04-18T00:10:35'),
      eventType: 'CORPORATE_ACTION',
      newIndexVersion: 474,
      oldDivisor: '179668504290.41718',
      newDivisor: '179609546755.5131',
      deltaDivisor: '-58957534.904083'
    }
  ];

  const filteredEvents = historyEvents.filter(event => {
    const matchesSearch = searchTerm === '' || 
      event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.newIndexVersion.toString().includes(searchTerm);
    
    const eventDate = event.date;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const matchesDateRange = eventDate >= start && eventDate <= end;
    
    return matchesSearch && matchesDateRange;
  });

  const handleEventClick = (event: HistoryEvent) => {
    setSelectedEvent(event);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">History</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              />
            </div>
            <Button size="sm" className="bg-gray-600 hover:bg-gray-700">
              SEARCH
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Date</TableHead>
              <TableHead>Event Type</TableHead>
              <TableHead>New Index Version</TableHead>
              <TableHead>Old Divisor</TableHead>
              <TableHead>New Divisor</TableHead>
              <TableHead>Delta Divisor</TableHead>
              <TableHead>Agg Late Div Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow 
                key={event.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleEventClick(event)}
              >
                <TableCell>{format(event.date, 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                <TableCell>{event.eventType}</TableCell>
                <TableCell>{event.newIndexVersion}</TableCell>
                <TableCell>{event.oldDivisor}</TableCell>
                <TableCell>{event.newDivisor}</TableCell>
                <TableCell className={event.deltaDivisor.includes('-') ? 'text-red-600' : 'text-black'}>
                  {event.deltaDivisor}
                </TableCell>
                <TableCell>{event.aggLateDivPoints || ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          {selectedEvent && (
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">
                  {selectedEvent.eventType === 'CORPORATE_ACTION' ? 'Corporate Action' : 'Rebalance'}
                </DialogTitle>
                <div className="text-sm text-gray-600">Index Change</div>
              </DialogHeader>
              
              <div className="space-y-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead>Date</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead>New Index Version</TableHead>
                      <TableHead>Old Divisor</TableHead>
                      <TableHead>New Divisor</TableHead>
                      <TableHead>Delta Divisor</TableHead>
                      <TableHead>Agg Late Div Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{format(selectedEvent.date, 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                      <TableCell>{selectedEvent.eventType}</TableCell>
                      <TableCell>{selectedEvent.newIndexVersion}</TableCell>
                      <TableCell>{selectedEvent.oldDivisor}</TableCell>
                      <TableCell>{selectedEvent.newDivisor}</TableCell>
                      <TableCell className="text-red-600">{selectedEvent.deltaDivisor}</TableCell>
                      <TableCell>{selectedEvent.aggLateDivPoints || ''}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                {selectedEvent.eventType === 'CORPORATE_ACTION' && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Event Details</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100">
                          <TableHead>Sec ID (RIC)</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Close Price</TableHead>
                          <TableHead>Adjusted Close</TableHead>
                          <TableHead>FX</TableHead>
                          <TableHead>WHT Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>{selectedEvent.details?.secId || '600177.SS'}</TableCell>
                          <TableCell>{selectedEvent.details?.type || 'CASH_DIVIDEND'}</TableCell>
                          <TableCell>{selectedEvent.details?.closePrice || '8.24'}</TableCell>
                          <TableCell>{selectedEvent.details?.adjustedClose || '8.15'}</TableCell>
                          <TableCell>{selectedEvent.details?.fx || '1'}</TableCell>
                          <TableCell>{selectedEvent.details?.whtRate || '10'}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}

                {selectedEvent.eventType === 'REBALANCE' && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Membership Changes</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100">
                          <TableHead>Sec ID (RIC)</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>NOSH Old</TableHead>
                          <TableHead>NOSH New</TableHead>
                          <TableHead>NOSH Diff</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>600705.SS</TableCell>
                          <TableCell>UPDATE</TableCell>
                          <TableCell>5351984777.44</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell className="text-red-600">-5351984777.44</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <div className="text-right text-sm text-gray-500 mt-2">
                      Rows per page: 10 ▼ 1-1 of 1
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default IndexHistory;
