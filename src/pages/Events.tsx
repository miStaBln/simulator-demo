
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStarred } from '@/contexts/StarredContext';
import { Bell, Calendar, ChevronDown, ChevronRight, AlertCircle, Activity, Clock, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
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

// Enhanced mock data for running selections with more entries
const runningSelections = [
  {
    indexId: 'idx-1',
    name: 'Global Tech Leaders',
    ticker: 'GTECH',
    selectionDate: '2025-06-15',
    rebalancingDate: '2025-06-20',
    weightingType: 'INDEX_MEMBER_FIN',
    rebalancingType: 'INDEX_MEMBER_LASPE',
    casBeforeCreation: 0,
    ecasBeforeCreation: 12,
    casAfterCreation: 0,
    ecasAfterCreation: 0,
    constituents: [
      { name: 'AAPL', change: '+2.1%', action: 'Weight Increase' },
      { name: 'MSFT', change: '-1.3%', action: 'Weight Decrease' },
      { name: 'GOOGL', change: '+0.8%', action: 'Weight Increase' }
    ]
  },
  {
    indexId: 'idx-3',
    name: 'Sustainable Energy',
    ticker: 'SENRG',
    selectionDate: '2025-06-16',
    rebalancingDate: '2025-06-18',
    weightingType: 'INDEX_MEMBER_FIN',
    rebalancingType: 'INDEX_MEMBER_LASPE',
    casBeforeCreation: 0,
    ecasBeforeCreation: 10,
    casAfterCreation: 0,
    ecasAfterCreation: 0,
    constituents: [
      { name: 'TSLA', change: '+3.2%', action: 'Weight Increase' },
      { name: 'ENPH', change: '-0.5%', action: 'Weight Decrease' }
    ]
  },
  {
    indexId: 'idx-5',
    name: 'Healthcare Innovation',
    ticker: 'HLTHIN',
    selectionDate: '2025-06-14',
    rebalancingDate: '2025-06-18',
    weightingType: 'INDEX_MEMBER_FIN',
    rebalancingType: 'INDEX_MEMBER_LASPE',
    casBeforeCreation: 0,
    ecasBeforeCreation: 8,
    casAfterCreation: 0,
    ecasAfterCreation: 0,
    constituents: [
      { name: 'JNJ', change: '+1.5%', action: 'Weight Increase' },
      { name: 'PFE', change: '-2.1%', action: 'Weight Decrease' },
      { name: 'MRNA', change: '+4.3%', action: 'New Addition' }
    ]
  },
  {
    indexId: 'idx-2',
    name: 'European Momentum',
    ticker: 'EUMOM',
    selectionDate: '2025-06-12',
    rebalancingDate: '2025-06-19',
    weightingType: 'INDEX_MEMBER_FIN',
    rebalancingType: 'INDEX_MEMBER_LASPE',
    casBeforeCreation: 0,
    ecasBeforeCreation: 15,
    casAfterCreation: 0,
    ecasAfterCreation: 0,
    constituents: [
      { name: 'SAP', change: '+1.8%', action: 'Weight Increase' },
      { name: 'ASML', change: '+2.5%', action: 'Weight Increase' },
      { name: 'LVMH', change: '-0.7%', action: 'Weight Decrease' }
    ]
  },
  {
    indexId: 'idx-4',
    name: 'Financial Services',
    ticker: 'FINSERV',
    selectionDate: '2025-06-13',
    rebalancingDate: '2025-06-17',
    weightingType: 'INDEX_MEMBER_FIN',
    rebalancingType: 'INDEX_MEMBER_LASPE',
    casBeforeCreation: 0,
    ecasBeforeCreation: 20,
    casAfterCreation: 0,
    ecasAfterCreation: 0,
    constituents: [
      { name: 'JPM', change: '+1.2%', action: 'Weight Increase' },
      { name: 'BAC', change: '-1.8%', action: 'Weight Decrease' },
      { name: 'GS', change: '+0.9%', action: 'Weight Increase' },
      { name: 'WFC', change: '-0.3%', action: 'Weight Decrease' }
    ]
  },
  {
    indexId: 'idx-6',
    name: 'Consumer Staples',
    ticker: 'CSTAPLE',
    selectionDate: '2025-06-11',
    rebalancingDate: '2025-06-17',
    weightingType: 'INDEX_MEMBER_FIN',
    rebalancingType: 'INDEX_MEMBER_LASPE',
    casBeforeCreation: 0,
    ecasBeforeCreation: 6,
    casAfterCreation: 0,
    ecasAfterCreation: 0,
    constituents: [
      { name: 'PG', change: '+0.5%', action: 'Weight Increase' },
      { name: 'KO', change: '+1.1%', action: 'Weight Increase' }
    ]
  }
];

// Calculate metrics for gauge views
const activeProforma = runningSelections.length;
const exTomorrow = runningSelections.filter(selection => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const rebalDate = new Date(selection.rebalancingDate);
  return rebalDate.toDateString() === tomorrow.toDateString();
}).length;

const GaugeView = ({ title, value, maxValue = 10, color = 'teal' }: { 
  title: string; 
  value: number; 
  maxValue?: number; 
  color?: string; 
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke={color === 'teal' ? '#14b8a6' : '#f59e0b'}
                strokeWidth="2"
                strokeDasharray={`${percentage}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold">{value}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RunningSelectionsTable = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'urgent' | 'normal'>('all');
  const navigate = useNavigate();

  const toggleRow = (indexId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(indexId)) {
      newExpanded.delete(indexId);
    } else {
      newExpanded.add(indexId);
    }
    setExpandedRows(newExpanded);
  };

  const navigateToIndexTimeline = (indexId: string, indexName: string) => {
    const indexData = allIndices.find(idx => idx.id === indexId);
    if (indexData) {
      navigate('/index-details', { 
        state: { 
          indexData: { ...indexData, name: indexName },
          defaultTab: 'timeline'
        } 
      });
    }
  };

  // Filter and search logic
  const filteredSelections = runningSelections.filter(selection => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      selection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      selection.ticker.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const daysUntilRebalancing = daysUntil(selection.rebalancingDate);
    const isUrgent = daysUntilRebalancing <= 2;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'urgent' && isUrgent) ||
      (statusFilter === 'normal' && !isUrgent);

    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-teal-500" />
          Currently Running Selections
        </CardTitle>
        <div className="flex gap-4 items-center pt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name or ticker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={(value: 'all' | 'urgent' | 'normal') => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Selections</SelectItem>
                <SelectItem value="urgent">Urgent (≤2 days)</SelectItem>
                <SelectItem value="normal">Normal ({">"}2 days)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Index ID</TableHead>
              <TableHead>Selection Date</TableHead>
              <TableHead>Rebalancing Date</TableHead>
              <TableHead>Days Until Rebalancing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSelections.map((selection) => {
              const isExpanded = expandedRows.has(selection.indexId);
              const daysUntilRebalancing = daysUntil(selection.rebalancingDate);
              
              return (
                <React.Fragment key={selection.indexId}>
                  <TableRow className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRow(selection.indexId)}
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium text-teal-600 hover:text-teal-800"
                        onClick={() => navigateToIndexTimeline(selection.indexId, selection.name)}
                      >
                        {selection.ticker}
                      </Button>
                    </TableCell>
                    <TableCell>{formatDate(selection.selectionDate)}</TableCell>
                    <TableCell>{formatDate(selection.rebalancingDate)}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "font-medium",
                        daysUntilRebalancing <= 1 ? "text-red-600" : 
                        daysUntilRebalancing <= 3 ? "text-yellow-600" : 
                        "text-green-600"
                      )}>
                        {daysUntilRebalancing === 0 ? "Today" : 
                         daysUntilRebalancing === 1 ? "Tomorrow" :
                         `${daysUntilRebalancing} days`}
                      </span>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-gray-50 p-6">
                        <div className="space-y-4">
                          <h4 className="font-medium text-lg">{selection.name} - Details</h4>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Weighting Type:</span>
                              <div className="font-medium">{selection.weightingType}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Rebalancing Type:</span>
                              <div className="font-medium">{selection.rebalancingType}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">CAs before Creation:</span>
                              <div className="font-medium">{selection.casBeforeCreation}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">ECAs before Creation:</span>
                              <div className="font-medium">{selection.ecasBeforeCreation}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">CAs after Creation:</span>
                              <div className="font-medium">{selection.casAfterCreation}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">ECAs after Creation:</span>
                              <div className="font-medium">{selection.ecasAfterCreation}</div>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Constituent Changes</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {selection.constituents.map((constituent, index) => (
                                <div key={index} className="flex justify-between items-center bg-white p-2 rounded border">
                                  <span className="font-medium">{constituent.name}</span>
                                  <div className="text-right">
                                    <div className={cn(
                                      "text-sm font-medium",
                                      constituent.change.startsWith('+') ? "text-green-600" : "text-red-600"
                                    )}>
                                      {constituent.change}
                                    </div>
                                    <div className="text-xs text-gray-500">{constituent.action}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
            {filteredSelections.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No running selections found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
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

      <Tabs defaultValue="running-selections" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="running-selections" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Running Selections
          </TabsTrigger>
          <TabsTrigger value="upcoming-events" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Upcoming Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="running-selections" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <GaugeView 
              title="Nr of Active Proforma" 
              value={activeProforma} 
              maxValue={10} 
              color="teal" 
            />
            <GaugeView 
              title="Ex Tomorrow" 
              value={exTomorrow} 
              maxValue={5} 
              color="yellow" 
            />
          </div>
          
          <RunningSelectionsTable />
        </TabsContent>

        <TabsContent value="upcoming-events" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Events;
export { IndexEventsWidget };
