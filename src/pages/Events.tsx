
import React, { useState } from 'react';
import { useStarred } from '@/contexts/StarredContext';
import { Bell, Calendar, ChevronDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

// Mock indices for demo purposes
const allIndices = [
  { id: 'idx-1', name: 'Global Tech Leaders', ticker: 'GTECH', currency: 'USD', type: 'administered' },
  { id: 'idx-2', name: 'European Momentum', ticker: 'EUMOM', currency: 'EUR', type: 'administered' },
  { id: 'idx-3', name: 'Sustainable Energy', ticker: 'SENRG', currency: 'USD', type: 'administered' },
  { id: 'idx-4', name: 'Financial Services', ticker: 'FINSERV', currency: 'USD', type: 'administered' },
  { id: 'idx-5', name: 'Healthcare Innovation', ticker: 'HLTHIN', currency: 'USD', type: 'administered' },
  { id: 'idx-6', name: 'Consumer Staples', ticker: 'CSTAPLE', currency: 'EUR', type: 'administered' },
];

// Mock events data
const indexEvents = [
  { 
    id: 1, 
    indexId: 'idx-1', 
    selectionDate: '2025-04-25', 
    rebalancingDate: '2025-04-30',
    type: 'quarterly',
    status: 'upcoming'
  },
  { 
    id: 2, 
    indexId: 'idx-2', 
    selectionDate: '2025-05-10', 
    rebalancingDate: '2025-05-15',
    type: 'annual',
    status: 'upcoming'
  },
  { 
    id: 3, 
    indexId: 'idx-3', 
    selectionDate: '2025-04-22', 
    rebalancingDate: '2025-04-24',
    type: 'special',
    status: 'upcoming'
  },
  { 
    id: 4, 
    indexId: 'idx-4', 
    selectionDate: '2025-06-05', 
    rebalancingDate: '2025-06-10',
    type: 'quarterly',
    status: 'upcoming'
  },
  { 
    id: 5, 
    indexId: 'idx-5', 
    selectionDate: '2025-05-22', 
    rebalancingDate: '2025-05-25',
    type: 'quarterly',
    status: 'upcoming'
  },
  { 
    id: 6, 
    indexId: 'idx-6', 
    selectionDate: '2025-04-20', 
    rebalancingDate: '2025-04-22',
    type: 'special',
    status: 'upcoming'
  },
];

// Format date to a human readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Calculate days until a given date
const daysUntil = (dateString: string) => {
  const today = new Date();
  const targetDate = new Date(dateString);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const IndexEventsWidget = ({ indices, standalone = false }: { indices: any[], standalone?: boolean }) => {
  // Filter events for the specified indices
  const indexIds = indices.map(index => index.id);
  const relevantEvents = indexEvents.filter(event => indexIds.includes(event.indexId))
    // Sort by closest selection date first
    .sort((a, b) => new Date(a.selectionDate).getTime() - new Date(b.selectionDate).getTime());

  if (relevantEvents.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8", standalone ? "h-[40vh]" : "h-full")}>
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
        <p className="text-gray-500 text-center max-w-md">
          There are no upcoming events for the selected indices. Try selecting different indices or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", standalone ? "p-4" : "")}>
      {relevantEvents.map((event) => {
        const index = indices.find(idx => idx.id === event.indexId);
        const selectionDaysRemaining = daysUntil(event.selectionDate);
        const rebalancingDaysRemaining = daysUntil(event.rebalancingDate);
        
        return (
          <Card key={event.id} className="overflow-hidden">
            <div className={cn(
              "h-2",
              selectionDaysRemaining <= 3 ? "bg-red-500" : 
              selectionDaysRemaining <= 7 ? "bg-yellow-400" : 
              "bg-teal-500"
            )} />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between">
                <span>{index?.name}</span>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700 font-normal">
                  {event.type}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Selection Date</p>
                  <p className="font-medium">{formatDate(event.selectionDate)}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    selectionDaysRemaining <= 3 ? "text-red-500" : 
                    selectionDaysRemaining <= 7 ? "text-yellow-600" : 
                    "text-teal-600"
                  )}>
                    {selectionDaysRemaining > 0 
                      ? `In ${selectionDaysRemaining} day${selectionDaysRemaining === 1 ? '' : 's'}`
                      : selectionDaysRemaining === 0 
                        ? "Today" 
                        : "Passed"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rebalancing Date</p>
                  <p className="font-medium">{formatDate(event.rebalancingDate)}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    rebalancingDaysRemaining <= 3 ? "text-red-500" : 
                    rebalancingDaysRemaining <= 7 ? "text-yellow-600" : 
                    "text-teal-600"
                  )}>
                    {rebalancingDaysRemaining > 0 
                      ? `In ${rebalancingDaysRemaining} day${rebalancingDaysRemaining === 1 ? '' : 's'}`
                      : rebalancingDaysRemaining === 0 
                        ? "Today" 
                        : "Passed"}
                  </p>
                </div>
              </div>
              {standalone && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 w-full"
                >
                  View Index Details
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const Events = () => {
  const [indexFilter, setIndexFilter] = useState<'starred' | 'administered'>('starred');
  const { starredIndices } = useStarred();
  
  // Filter indices based on the selected filter
  const filteredIndices = indexFilter === 'starred' 
    ? starredIndices 
    : allIndices.filter(index => index.type === 'administered');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-teal-500" />
          <h1 className="text-2xl font-semibold">Index Events</h1>
        </div>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={indexFilter} onValueChange={(value: 'starred' | 'administered') => setIndexFilter(value)}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="starred">Starred Indices</SelectItem>
              <SelectItem value="administered">Administered Indices</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Switch id="highlight-urgent" defaultChecked />
            <label htmlFor="highlight-urgent" className="text-sm">Highlight urgent events</label>
          </div>
        </div>
        
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Calendar View
        </Button>
      </div>
      
      <IndexEventsWidget indices={filteredIndices} standalone={true} />
    </div>
  );
};

export default Events;
export { IndexEventsWidget };
