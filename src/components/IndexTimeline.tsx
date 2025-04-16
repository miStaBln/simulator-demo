
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IndexItem } from '@/contexts/StarredContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'rebalancing' | 'corporate-action' | 'today';
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
  activeEvent: string | null;
  setActiveEvent: (id: string | null) => void;
}

const IndexTimeline: React.FC<IndexTimelineProps> = ({ indexData, activeEvent, setActiveEvent }) => {
  // Generate timeline events based on index data
  const events: TimelineEvent[] = [
    {
      id: 'event1',
      date: new Date(2024, 3, 1), // April 1, 2024
      type: 'rebalancing',
      title: 'Rebalancing',
      color: 'bg-gray-200',
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
      date: new Date(2024, 6, 1), // July 1, 2024
      type: 'rebalancing',
      title: 'Rebalancing',
      color: 'bg-gray-200',
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
      date: new Date(2025, 0, 4), // January 4, 2025
      type: 'rebalancing',
      title: 'Rebalancing',
      color: 'bg-yellow-200',
      description: 'Selection Day',
      details: {
        'Added Components': 5,
        'Removed Components': 3,
        'Weight Change': '7.5%',
        'Effective Date': '04.01.2025',
      }
    },
    {
      id: 'event4',
      date: new Date(2025, 3, 4), // April 4, 2025
      type: 'rebalancing',
      title: 'Rebalancing',
      color: 'bg-yellow-200',
      description: 'Review',
      details: {
        'Added Components': 2,
        'Removed Components': 2,
        'Weight Change': '4.3%',
        'Effective Date': '04.04.2025',
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
      date: new Date(2025, 6, 10), // July 10, 2025
      type: 'rebalancing',
      title: 'Rebalancing',
      color: 'bg-blue-300',
      description: 'Quarterly Update',
      details: {
        'Added Components': 0,
        'Removed Components': 1,
        'Weight Change': '3.1%',
        'Effective Date': '10.07.2025',
      }
    },
    {
      id: 'event7',
      date: new Date(2025, 8, 15), // September 15, 2025
      type: 'corporate-action',
      title: 'Corporate Action',
      color: 'bg-blue-500',
      description: 'Stock Split',
      details: {
        'Company': 'ACME Corp',
        'Action Type': 'Split 2:1',
        'Announcement Date': '01.09.2025',
        'Effective Date': '15.09.2025',
      }
    },
  ];

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());

  const toggleEvent = (eventId: string) => {
    if (activeEvent === eventId) {
      setActiveEvent(null);
    } else {
      setActiveEvent(eventId);
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      <div className="relative">
        {/* Timeline circles */}
        <div className="flex justify-center items-center space-x-16 mb-16">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="flex flex-col items-center">
              <div 
                className={`rounded-full h-16 w-16 flex items-center justify-center text-xs font-medium ${event.type === 'today' ? 'text-white' : ''} ${event.color}`}
              >
                {event.type === 'today' ? 'TODAY' : format(event.date, 'd.M.yyyy')}
              </div>
              <div className="h-24 border-l border-gray-300 mt-2"></div>
            </div>
          ))}
        </div>

        {/* Timeline events */}
        <div className="flex justify-center items-center space-x-4">
          {sortedEvents.map((event, index) => (
            <div
              key={event.id}
              className={`px-4 py-2 rounded-md flex flex-col items-center ${event.color} ${event.type === 'today' ? 'text-white' : 'text-gray-800'} w-32`}
            >
              <span className="font-medium">{event.title}</span>
              <div className={`w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] ${event.color === 'bg-black' ? 'border-black' : event.color.replace('bg-', 'border-')} border-l-transparent border-r-transparent mt-1`}></div>
            </div>
          ))}
        </div>

        {/* Event details */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          {sortedEvents.map((event) => (
            <div key={event.id} className="flex flex-col items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-gray-600 flex items-center"
                onClick={() => toggleEvent(event.id)}
              >
                Additional Information
                {activeEvent === event.id ? (
                  <ChevronUp className="ml-1 h-3 w-3" />
                ) : (
                  <ChevronDown className="ml-1 h-3 w-3" />
                )}
              </Button>
              
              {activeEvent === event.id && (
                <Card className="w-full mt-2 bg-gray-50 border border-gray-200">
                  <CardContent className="p-3">
                    <h4 className="text-sm font-medium mb-2">{event.description}</h4>
                    <div className="space-y-1">
                      {event.details && Object.entries(event.details).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 text-xs">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndexTimeline;
