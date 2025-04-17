
import React from 'react';
import { Calendar } from 'lucide-react';
import { useStarred } from '@/contexts/StarredContext';

// This would typically come from an API
const mockEvents = [
  { id: 1, indexId: 'idx-1', name: 'Quarterly Review', date: '2025-05-10' },
  { id: 2, indexId: 'idx-2', name: 'Annual Rebalancing', date: '2025-04-30' },
  { id: 3, indexId: 'idx-3', name: 'Dividend Distribution', date: '2025-05-15' },
];

const UpcomingEventsWidget = () => {
  const { starredIndices } = useStarred();
  const starredIds = starredIndices.map(index => index.id);
  
  // Filter events for starred indices
  const events = mockEvents.filter(event => starredIds.includes(event.indexId));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-teal-500" />
        <h3 className="text-sm font-medium">Upcoming Events</h3>
      </div>
      
      {events.length === 0 ? (
        <div className="text-sm text-gray-500 flex-1 flex items-center justify-center">
          No upcoming events for starred indices
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          {events.map((event) => {
            const index = starredIndices.find(idx => idx.id === event.indexId);
            return (
              <div key={event.id} className="p-2 text-sm border-l-2 border-teal-500 pl-3">
                <div className="font-medium">{event.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDate(event.date)} • {index?.name || 'Unknown Index'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingEventsWidget;
