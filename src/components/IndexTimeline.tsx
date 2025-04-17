
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { IndexItem } from '@/contexts/StarredContext';
import { ChevronDown, ChevronUp, Calendar, ArrowRight } from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'rebalancing' | 'corporate-action' | 'today' | 'selection-day';
  title: string;
  color: string;
  description: string;
  details?: {
    [key: string]: string | number;
  };
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
  const [openEventId, setOpenEventId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  
  // Generate timeline events based on index data
  const events: TimelineEvent[] = [
    {
      id: 'event1',
      date: new Date(2024, 3, 1), // April 1, 2024 (past)
      type: 'rebalancing',
      title: 'Rebalancing',
      color: 'bg-gray-300',
      description: 'Quarterly Rebalancing',
      details: {
        'Added Components': 3,
        'Removed Components': 2,
        'Weight Change': '5.2%',
        'Effective Date': '01.04.2024',
      }
    },
    {
      id: 'event2',
      date: new Date(2024, 6, 1), // July 1, 2024 (past)
      type: 'rebalancing',
      color: 'bg-gray-300',
      title: 'Rebalancing',
      description: 'Quarterly Rebalancing',
      details: {
        'Added Components': 1,
        'Removed Components': 1,
        'Weight Change': '2.8%',
        'Effective Date': '01.07.2024',
      }
    },
    {
      id: 'event3',
      date: new Date(2025, 0, 4), // January 4, 2025 (past)
      type: 'selection-day',
      title: 'Selection Day',
      color: 'bg-blue-300',
      description: 'Annual Selection Day',
      details: {
        'Selected Components': 20,
        'Total Market Cap': '$1.2T',
        'Selection Criteria': 'Market Cap and Liquidity',
        'Effective Date': '04.01.2025',
      }
    },
    {
      id: 'event4',
      date: new Date(2025, 3, 1), // April 1, 2025 (past)
      type: 'rebalancing',
      title: 'Rebalancing',
      color: 'bg-green-300',
      description: 'Quarterly Rebalancing',
      details: {
        'Added Components': 2,
        'Removed Components': 2,
        'Weight Change': '4.3%',
        'Effective Date': '01.04.2025',
      }
    },
    {
      id: 'event5',
      date: new Date(), // Today
      type: 'today',
      title: 'Today',
      color: 'bg-black',
      description: 'Current Date',
      details: {
        'Index Value': 245.78,
        'Daily Change': '+0.82%',
        'Market Status': 'Open',
        'Last Update': format(new Date(), 'dd.MM.yyyy HH:mm'),
      }
    },
    {
      id: 'event6',
      date: new Date(2025, 6, 1), // July 1, 2025 (future)
      type: 'rebalancing',
      title: 'Rebalancing',
      color: 'bg-teal-300',
      description: 'Quarterly Rebalancing',
      details: {
        'Estimated Components': 20,
        'Projected Weight Change': '~3.0%',
        'Effective Date': '01.07.2025',
        'Selection Date': '25.06.2025',
      }
    },
    {
      id: 'event7',
      date: new Date(2025, 9, 1), // October 1, 2025 (future)
      type: 'rebalancing',
      title: 'Rebalancing',
      color: 'bg-teal-300',
      description: 'Quarterly Rebalancing',
      details: {
        'Estimated Components': 20,
        'Projected Weight Change': '~2.5%',
        'Effective Date': '01.10.2025',
        'Selection Date': '24.09.2025',
      }
    },
  ];

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Find the index of today's event
  const todayIndex = sortedEvents.findIndex(event => event.type === 'today');
  
  const toggleEvent = (eventId: string) => {
    if (openEventId === eventId) {
      setOpenEventId(null);
    } else {
      setOpenEventId(eventId);
    }
  };
  
  const openEventDetails = (event: TimelineEvent) => {
    setSelectedEvent(event);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-medium mb-8">Index Timeline</h2>
        
        <div className="relative mb-16">
          {/* Timeline line */}
          <div className="absolute h-1 bg-gray-200 left-0 right-0 top-10"></div>
          
          {/* Timeline events */}
          <div className="flex justify-between relative">
            {sortedEvents.map((event, index) => {
              const isPast = event.date < new Date() && event.type !== 'today';
              const isFuture = event.date > new Date();
              
              return (
                <div 
                  key={event.id} 
                  className="flex flex-col items-center"
                  style={{ zIndex: index === todayIndex ? 3 : 1 }}
                >
                  <div 
                    className={`cursor-pointer transition-transform hover:scale-110 rounded-full h-12 w-12 flex items-center justify-center text-xs font-medium ${event.type === 'today' ? 'text-white z-10' : ''} ${event.color}`}
                    onClick={() => openEventDetails(event)}
                  >
                    {event.type === 'today' ? 'TODAY' : ''}
                  </div>
                  
                  <div className={`w-0.5 h-${index % 2 === 0 ? 12 : 8} ${event.type === 'today' ? 'bg-black' : 'bg-gray-300'} mt-2`}></div>
                  
                  <div className={`text-xs ${index % 2 === 0 ? 'mt-0' : 'mt-4'}`}>
                    {format(event.date, 'dd.MM.yyyy')}
                  </div>
                  
                  <div className={`text-sm font-medium mt-1 ${isPast ? 'text-gray-500' : isFuture ? 'text-teal-600' : 'text-black'}`}>
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
              );
            })}
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
        <div className="flex justify-center space-x-6 mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
            <span className="text-xs">Past Rebalancing</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
            <span className="text-xs">Selection Day</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-black mr-2"></div>
            <span className="text-xs">Today</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-teal-300 mr-2"></div>
            <span className="text-xs">Future Rebalancing</span>
          </div>
        </div>
        
        {/* Event details dialog */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent?.title}</DialogTitle>
              <DialogDescription>{selectedEvent?.description}</DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="text-sm font-medium mb-2">{format(selectedEvent?.date || new Date(), 'MMMM d, yyyy')}</div>
              
              <div className="space-y-2">
                {selectedEvent?.details && Object.entries(selectedEvent.details).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 text-sm">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
              
              {selectedEvent?.type === 'rebalancing' && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Affected Constituents</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>TSLA.OQ</span>
                      <span className="text-green-600">+0.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>BLUE.OQ</span>
                      <span className="text-red-600">-0.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VIV.N</span>
                      <span className="text-green-600">+0.2%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default IndexTimeline;
