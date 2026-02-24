
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStarred } from '@/contexts/StarredContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
  ChevronLeft, ChevronRight, CalendarDays, Filter as FilterIcon, ChevronsUpDown, Check,
  Bell, Activity, Clock, Search, Filter, ChevronDown, ChevronRight as ChevronRightIcon,
  AlertCircle, Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, getDay,
  addMonths, subMonths, isSameMonth, isSameDay, isToday,
} from 'date-fns';

// ─── Shared data ───────────────────────────────────────────────────
type EventType = 'REBALANCING' | 'SELECTION' | 'CORPORATE_ACTION';

interface LifecycleEvent {
  id: string;
  date: Date;
  type: EventType;
  indexId: string;
  indexName: string;
  ticker: string;
  description: string;
}

const allIndices = [
  { id: 'idx-1', name: 'Global Tech Leaders', ticker: 'GTECH', currency: 'USD', type: 'administered' },
  { id: 'idx-2', name: 'European Momentum', ticker: 'EUMOM', currency: 'EUR', type: 'administered' },
  { id: 'idx-3', name: 'Sustainable Energy', ticker: 'SENRG', currency: 'USD', type: 'administered' },
  { id: 'idx-4', name: 'Financial Services', ticker: 'FINSERV', currency: 'USD', type: 'administered' },
  { id: 'idx-5', name: 'Healthcare Innovation', ticker: 'HLTHIN', currency: 'USD', type: 'administered' },
  { id: 'idx-6', name: 'Consumer Staples', ticker: 'CSTAPLE', currency: 'EUR', type: 'administered' },
];

const mockEvents: LifecycleEvent[] = [
  // Past events
  { id: 'e1', date: new Date('2025-11-15'), type: 'REBALANCING', indexId: 'idx-1', indexName: 'Global Tech Leaders', ticker: 'GTECH', description: 'Quarterly rebalancing' },
  { id: 'e2', date: new Date('2025-11-20'), type: 'CORPORATE_ACTION', indexId: 'idx-2', indexName: 'European Momentum', ticker: 'EUMOM', description: 'Cash dividend — SAP' },
  { id: 'e3', date: new Date('2025-12-01'), type: 'SELECTION', indexId: 'idx-3', indexName: 'Sustainable Energy', ticker: 'SENRG', description: 'Annual selection' },
  { id: 'e4', date: new Date('2025-12-10'), type: 'REBALANCING', indexId: 'idx-5', indexName: 'Healthcare Innovation', ticker: 'HLTHIN', description: 'Semi-annual rebalancing' },
  { id: 'e18', date: new Date('2025-12-15'), type: 'CORPORATE_ACTION', indexId: 'idx-4', indexName: 'Financial Services', ticker: 'FINSERV', description: 'Special dividend — JPM' },
  { id: 'e19', date: new Date('2025-12-22'), type: 'SELECTION', indexId: 'idx-6', indexName: 'Consumer Staples', ticker: 'CSTAPLE', description: 'Year-end selection' },
  { id: 'e5', date: new Date('2026-01-08'), type: 'CORPORATE_ACTION', indexId: 'idx-1', indexName: 'Global Tech Leaders', ticker: 'GTECH', description: 'Stock split — AAPL' },
  { id: 'e6', date: new Date('2026-01-15'), type: 'SELECTION', indexId: 'idx-4', indexName: 'Financial Services', ticker: 'FINSERV', description: 'Quarterly selection' },
  { id: 'e7', date: new Date('2026-01-22'), type: 'REBALANCING', indexId: 'idx-6', indexName: 'Consumer Staples', ticker: 'CSTAPLE', description: 'Quarterly rebalancing' },
  { id: 'e20', date: new Date('2026-01-28'), type: 'CORPORATE_ACTION', indexId: 'idx-3', indexName: 'Sustainable Energy', ticker: 'SENRG', description: 'Name change — FSLR' },
  // Feb 2026 — dense with all types
  { id: 'e8', date: new Date('2026-02-02'), type: 'CORPORATE_ACTION', indexId: 'idx-3', indexName: 'Sustainable Energy', ticker: 'SENRG', description: 'Rights issue — ENPH' },
  { id: 'e21', date: new Date('2026-02-02'), type: 'SELECTION', indexId: 'idx-6', indexName: 'Consumer Staples', ticker: 'CSTAPLE', description: 'Quarterly selection' },
  { id: 'e22', date: new Date('2026-02-04'), type: 'REBALANCING', indexId: 'idx-3', indexName: 'Sustainable Energy', ticker: 'SENRG', description: 'Post-selection rebalancing' },
  { id: 'e23', date: new Date('2026-02-06'), type: 'CORPORATE_ACTION', indexId: 'idx-1', indexName: 'Global Tech Leaders', ticker: 'GTECH', description: 'Cash dividend — MSFT' },
  { id: 'e24', date: new Date('2026-02-09'), type: 'SELECTION', indexId: 'idx-2', indexName: 'European Momentum', ticker: 'EUMOM', description: 'Special selection review' },
  { id: 'e25', date: new Date('2026-02-10'), type: 'REBALANCING', indexId: 'idx-5', indexName: 'Healthcare Innovation', ticker: 'HLTHIN', description: 'Quarterly rebalancing' },
  { id: 'e26', date: new Date('2026-02-12'), type: 'CORPORATE_ACTION', indexId: 'idx-4', indexName: 'Financial Services', ticker: 'FINSERV', description: 'Spin-off — GS' },
  { id: 'e9', date: new Date('2026-02-14'), type: 'SELECTION', indexId: 'idx-1', indexName: 'Global Tech Leaders', ticker: 'GTECH', description: 'Quarterly selection' },
  { id: 'e27', date: new Date('2026-02-16'), type: 'REBALANCING', indexId: 'idx-1', indexName: 'Global Tech Leaders', ticker: 'GTECH', description: 'Post-selection rebalancing' },
  { id: 'e28', date: new Date('2026-02-17'), type: 'CORPORATE_ACTION', indexId: 'idx-6', indexName: 'Consumer Staples', ticker: 'CSTAPLE', description: 'Cash dividend — PG' },
  { id: 'e29', date: new Date('2026-02-18'), type: 'SELECTION', indexId: 'idx-5', indexName: 'Healthcare Innovation', ticker: 'HLTHIN', description: 'Ad-hoc addition review' },
  { id: 'e10', date: new Date('2026-02-20'), type: 'REBALANCING', indexId: 'idx-2', indexName: 'European Momentum', ticker: 'EUMOM', description: 'Quarterly rebalancing' },
  { id: 'e30', date: new Date('2026-02-20'), type: 'CORPORATE_ACTION', indexId: 'idx-2', indexName: 'European Momentum', ticker: 'EUMOM', description: 'Share buyback — ASML' },
  { id: 'e11', date: new Date('2026-02-24'), type: 'CORPORATE_ACTION', indexId: 'idx-5', indexName: 'Healthcare Innovation', ticker: 'HLTHIN', description: 'Cash dividend — JNJ' },
  { id: 'e31', date: new Date('2026-02-24'), type: 'SELECTION', indexId: 'idx-4', indexName: 'Financial Services', ticker: 'FINSERV', description: 'Quarterly selection' },
  { id: 'e32', date: new Date('2026-02-25'), type: 'REBALANCING', indexId: 'idx-6', indexName: 'Consumer Staples', ticker: 'CSTAPLE', description: 'Quarterly rebalancing' },
  { id: 'e12', date: new Date('2026-02-27'), type: 'REBALANCING', indexId: 'idx-4', indexName: 'Financial Services', ticker: 'FINSERV', description: 'Post-selection rebalancing' },
  // Future
  { id: 'e13', date: new Date('2026-03-05'), type: 'SELECTION', indexId: 'idx-2', indexName: 'European Momentum', ticker: 'EUMOM', description: 'Annual selection' },
  { id: 'e14', date: new Date('2026-03-12'), type: 'REBALANCING', indexId: 'idx-1', indexName: 'Global Tech Leaders', ticker: 'GTECH', description: 'Quarterly rebalancing' },
  { id: 'e15', date: new Date('2026-03-18'), type: 'CORPORATE_ACTION', indexId: 'idx-6', indexName: 'Consumer Staples', ticker: 'CSTAPLE', description: 'Merger — KO' },
  { id: 'e33', date: new Date('2026-03-20'), type: 'SELECTION', indexId: 'idx-3', indexName: 'Sustainable Energy', ticker: 'SENRG', description: 'Quarterly selection' },
  { id: 'e34', date: new Date('2026-03-25'), type: 'REBALANCING', indexId: 'idx-4', indexName: 'Financial Services', ticker: 'FINSERV', description: 'Quarterly rebalancing' },
  { id: 'e16', date: new Date('2026-04-01'), type: 'SELECTION', indexId: 'idx-5', indexName: 'Healthcare Innovation', ticker: 'HLTHIN', description: 'Quarterly selection' },
  { id: 'e17', date: new Date('2026-04-10'), type: 'REBALANCING', indexId: 'idx-3', indexName: 'Sustainable Energy', ticker: 'SENRG', description: 'Quarterly rebalancing' },
  { id: 'e35', date: new Date('2026-04-15'), type: 'CORPORATE_ACTION', indexId: 'idx-2', indexName: 'European Momentum', ticker: 'EUMOM', description: 'Cash dividend — LVMH' },
];

const eventTypeConfig: Record<EventType, { label: string; bgClass: string; textClass: string }> = {
  REBALANCING: { label: 'Rebalancing', bgClass: 'bg-primary/10', textClass: 'text-primary' },
  SELECTION: { label: 'Selection', bgClass: 'bg-teal-100', textClass: 'text-teal-700' },
  CORPORATE_ACTION: { label: 'Corporate Action', bgClass: 'bg-amber-100', textClass: 'text-amber-700' },
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const daysUntil = (dateString: string) => {
  const today = new Date();
  const targetDate = new Date(dateString);
  return Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

// ─── Events data (from old Events page) ───────────────────────────
const indexEvents = [
  { id: 1, indexId: 'idx-1', selectionDate: '2025-04-25', rebalancingDate: '2025-04-30', type: 'quarterly', status: 'upcoming' },
  { id: 2, indexId: 'idx-2', selectionDate: '2025-05-10', rebalancingDate: '2025-05-15', type: 'annual', status: 'upcoming' },
  { id: 3, indexId: 'idx-3', selectionDate: '2025-04-22', rebalancingDate: '2025-04-24', type: 'special', status: 'upcoming' },
  { id: 4, indexId: 'idx-4', selectionDate: '2025-06-05', rebalancingDate: '2025-06-10', type: 'quarterly', status: 'upcoming' },
  { id: 5, indexId: 'idx-5', selectionDate: '2025-05-22', rebalancingDate: '2025-05-25', type: 'quarterly', status: 'upcoming' },
  { id: 6, indexId: 'idx-6', selectionDate: '2025-04-20', rebalancingDate: '2025-04-22', type: 'special', status: 'upcoming' },
];

const runningSelections = [
  {
    indexId: 'idx-1', name: 'Global Tech Leaders', ticker: 'GTECH',
    selectionDate: '2025-06-15', rebalancingDate: '2025-06-20',
    weightingType: 'INDEX_MEMBER_FIN', rebalancingType: 'INDEX_MEMBER_LASPE',
    casBeforeCreation: 0, ecasBeforeCreation: 12, casAfterCreation: 0, ecasAfterCreation: 0,
    constituents: [
      { name: 'AAPL', change: '+2.1%', action: 'Weight Increase' },
      { name: 'MSFT', change: '-1.3%', action: 'Weight Decrease' },
      { name: 'GOOGL', change: '+0.8%', action: 'Weight Increase' },
    ],
  },
  {
    indexId: 'idx-3', name: 'Sustainable Energy', ticker: 'SENRG',
    selectionDate: '2025-06-16', rebalancingDate: '2025-06-18',
    weightingType: 'INDEX_MEMBER_FIN', rebalancingType: 'INDEX_MEMBER_LASPE',
    casBeforeCreation: 0, ecasBeforeCreation: 10, casAfterCreation: 0, ecasAfterCreation: 0,
    constituents: [
      { name: 'TSLA', change: '+3.2%', action: 'Weight Increase' },
      { name: 'ENPH', change: '-0.5%', action: 'Weight Decrease' },
    ],
  },
  {
    indexId: 'idx-5', name: 'Healthcare Innovation', ticker: 'HLTHIN',
    selectionDate: '2025-06-14', rebalancingDate: '2025-06-18',
    weightingType: 'INDEX_MEMBER_FIN', rebalancingType: 'INDEX_MEMBER_LASPE',
    casBeforeCreation: 0, ecasBeforeCreation: 8, casAfterCreation: 0, ecasAfterCreation: 0,
    constituents: [
      { name: 'JNJ', change: '+1.5%', action: 'Weight Increase' },
      { name: 'PFE', change: '-2.1%', action: 'Weight Decrease' },
      { name: 'MRNA', change: '+4.3%', action: 'New Addition' },
    ],
  },
  {
    indexId: 'idx-2', name: 'European Momentum', ticker: 'EUMOM',
    selectionDate: '2025-06-12', rebalancingDate: '2025-06-19',
    weightingType: 'INDEX_MEMBER_FIN', rebalancingType: 'INDEX_MEMBER_LASPE',
    casBeforeCreation: 0, ecasBeforeCreation: 15, casAfterCreation: 0, ecasAfterCreation: 0,
    constituents: [
      { name: 'SAP', change: '+1.8%', action: 'Weight Increase' },
      { name: 'ASML', change: '+2.5%', action: 'Weight Increase' },
      { name: 'LVMH', change: '-0.7%', action: 'Weight Decrease' },
    ],
  },
  {
    indexId: 'idx-4', name: 'Financial Services', ticker: 'FINSERV',
    selectionDate: '2025-06-13', rebalancingDate: '2025-06-17',
    weightingType: 'INDEX_MEMBER_FIN', rebalancingType: 'INDEX_MEMBER_LASPE',
    casBeforeCreation: 0, ecasBeforeCreation: 20, casAfterCreation: 0, ecasAfterCreation: 0,
    constituents: [
      { name: 'JPM', change: '+1.2%', action: 'Weight Increase' },
      { name: 'BAC', change: '-1.8%', action: 'Weight Decrease' },
      { name: 'GS', change: '+0.9%', action: 'Weight Increase' },
      { name: 'WFC', change: '-0.3%', action: 'Weight Decrease' },
    ],
  },
  {
    indexId: 'idx-6', name: 'Consumer Staples', ticker: 'CSTAPLE',
    selectionDate: '2025-06-11', rebalancingDate: '2025-06-17',
    weightingType: 'INDEX_MEMBER_FIN', rebalancingType: 'INDEX_MEMBER_LASPE',
    casBeforeCreation: 0, ecasBeforeCreation: 6, casAfterCreation: 0, ecasAfterCreation: 0,
    constituents: [
      { name: 'PG', change: '+0.5%', action: 'Weight Increase' },
      { name: 'KO', change: '+1.1%', action: 'Weight Increase' },
    ],
  },
];

const activeProforma = runningSelections.length;
const exTomorrow = runningSelections.filter(s => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return new Date(s.rebalancingDate).toDateString() === tomorrow.toDateString();
}).length;

// ─── Sub-components ────────────────────────────────────────────────

const GaugeView = ({ title, value, maxValue = 10, color = 'teal' }: { title: string; value: number; maxValue?: number; color?: string }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
              <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" fill="none" stroke={color === 'teal' ? '#14b8a6' : '#f59e0b'} strokeWidth="2" strokeDasharray={`${percentage}, 100`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl font-bold">{value}</span></div>
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
    const n = new Set(expandedRows);
    n.has(indexId) ? n.delete(indexId) : n.add(indexId);
    setExpandedRows(n);
  };

  const navigateToIndexTimeline = (indexId: string, indexName: string) => {
    const indexData = allIndices.find(idx => idx.id === indexId);
    if (indexData) navigate('/index-details', { state: { indexData: { ...indexData, name: indexName }, defaultTab: 'timeline' } });
  };

  const filteredSelections = runningSelections.filter(s => {
    const matchesSearch = searchTerm === '' || s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.ticker.toLowerCase().includes(searchTerm.toLowerCase());
    const d = daysUntil(s.rebalancingDate);
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'urgent' && d <= 2) || (statusFilter === 'normal' && d > 2);
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-teal-500" />Currently Running Selections</CardTitle>
        <div className="flex gap-4 items-center pt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search by name or ticker..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={(v: 'all' | 'urgent' | 'normal') => setStatusFilter(v)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Selections</SelectItem>
                <SelectItem value="urgent">Urgent (≤2 days)</SelectItem>
                <SelectItem value="normal">Normal (&gt;2 days)</SelectItem>
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
              const d = daysUntil(selection.rebalancingDate);
              return (
                <React.Fragment key={selection.indexId}>
                  <TableRow className="cursor-pointer hover:bg-accent/50">
                    <TableCell><Button variant="ghost" size="sm" onClick={() => toggleRow(selection.indexId)}>{isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}</Button></TableCell>
                    <TableCell><Button variant="link" className="p-0 h-auto font-medium text-teal-600 hover:text-teal-800" onClick={() => navigateToIndexTimeline(selection.indexId, selection.name)}>{selection.ticker}</Button></TableCell>
                    <TableCell>{formatDate(selection.selectionDate)}</TableCell>
                    <TableCell>{formatDate(selection.rebalancingDate)}</TableCell>
                    <TableCell>
                      <span className={cn('font-medium', d <= 1 ? 'text-destructive' : d <= 3 ? 'text-amber-600' : 'text-teal-600')}>
                        {d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : `${d} days`}
                      </span>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-accent/30 p-6">
                        <div className="space-y-4">
                          <h4 className="font-medium text-lg">{selection.name} - Details</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div><span className="text-muted-foreground">Weighting Type:</span><div className="font-medium">{selection.weightingType}</div></div>
                            <div><span className="text-muted-foreground">Rebalancing Type:</span><div className="font-medium">{selection.rebalancingType}</div></div>
                            <div><span className="text-muted-foreground">CAs before Creation:</span><div className="font-medium">{selection.casBeforeCreation}</div></div>
                            <div><span className="text-muted-foreground">ECAs before Creation:</span><div className="font-medium">{selection.ecasBeforeCreation}</div></div>
                            <div><span className="text-muted-foreground">CAs after Creation:</span><div className="font-medium">{selection.casAfterCreation}</div></div>
                            <div><span className="text-muted-foreground">ECAs after Creation:</span><div className="font-medium">{selection.ecasAfterCreation}</div></div>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Constituent Changes</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {selection.constituents.map((c, i) => (
                                <div key={i} className="flex justify-between items-center bg-background p-2 rounded border border-border">
                                  <span className="font-medium">{c.name}</span>
                                  <div className="text-right">
                                    <div className={cn('text-sm font-medium', c.change.startsWith('+') ? 'text-teal-600' : 'text-destructive')}>{c.change}</div>
                                    <div className="text-xs text-muted-foreground">{c.action}</div>
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
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No running selections found matching your criteria.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Exported for DashboardEditor usage
export const IndexEventsWidget = ({ indices, standalone = false }: { indices: any[]; standalone?: boolean }) => {
  const indexIds = indices.map(index => index.id);
  const relevantEvents = indexEvents
    .filter(event => indexIds.includes(event.indexId))
    .sort((a, b) => new Date(a.selectionDate).getTime() - new Date(b.selectionDate).getTime());

  if (relevantEvents.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8', standalone ? 'h-[40vh]' : 'h-full')}>
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
        <p className="text-muted-foreground text-center max-w-md">There are no upcoming events for the selected indices.</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', standalone ? 'p-4' : '')}>
      {relevantEvents.map((event) => {
        const index = indices.find(idx => idx.id === event.indexId);
        const selDays = daysUntil(event.selectionDate);
        const rebDays = daysUntil(event.rebalancingDate);
        return (
          <Card key={event.id} className="overflow-hidden">
            <div className={cn('h-2', selDays <= 3 ? 'bg-destructive' : selDays <= 7 ? 'bg-amber-400' : 'bg-teal-500')} />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between">
                <span>{index?.name}</span>
                <span className="text-sm bg-muted px-2 py-1 rounded text-muted-foreground font-normal">{event.type}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Selection Date</p>
                  <p className="font-medium">{formatDate(event.selectionDate)}</p>
                  <p className={cn('text-xs mt-1', selDays <= 3 ? 'text-destructive' : selDays <= 7 ? 'text-amber-600' : 'text-teal-600')}>
                    {selDays > 0 ? `In ${selDays} day${selDays === 1 ? '' : 's'}` : selDays === 0 ? 'Today' : 'Passed'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rebalancing Date</p>
                  <p className="font-medium">{formatDate(event.rebalancingDate)}</p>
                  <p className={cn('text-xs mt-1', rebDays <= 3 ? 'text-destructive' : rebDays <= 7 ? 'text-amber-600' : 'text-teal-600')}>
                    {rebDays > 0 ? `In ${rebDays} day${rebDays === 1 ? '' : 's'}` : rebDays === 0 ? 'Today' : 'Passed'}
                  </p>
                </div>
              </div>
              {standalone && (
                <Button variant="outline" size="sm" className="mt-4 w-full">View Index Details</Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// ─── Main Manage page ──────────────────────────────────────────────

const Manage: React.FC = () => {
  const { starredIndices } = useStarred();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));
  const [selectedIndex, setSelectedIndex] = useState<string>('starred');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [activeTypes, setActiveTypes] = useState<Set<EventType>>(new Set(['REBALANCING', 'SELECTION', 'CORPORATE_ACTION']));
  const [indexFilter, setIndexFilter] = useState<'starred' | 'administered'>('starred');
  const [indexPickerOpen, setIndexPickerOpen] = useState(false);

  const toggleType = (type: EventType) => {
    setActiveTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) { if (next.size > 1) next.delete(type); } else { next.add(type); }
      return next;
    });
  };

  const filteredEvents = useMemo(() => {
    let indexIds: string[];
    if (selectedIndex === 'starred') {
      indexIds = starredIndices.length > 0 ? starredIndices.map(i => i.id) : allIndices.map(i => i.id);
    } else if (selectedIndex === 'all') {
      indexIds = allIndices.map(i => i.id);
    } else {
      indexIds = [selectedIndex];
    }
    return mockEvents.filter(e => indexIds.includes(e.indexId) && activeTypes.has(e.type));
  }, [selectedIndex, starredIndices, activeTypes]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const eventsForDay = (day: Date) => filteredEvents.filter(e => isSameDay(e.date, day));
  const eventsForMonth = filteredEvents.filter(e => isSameMonth(e.date, currentMonth));
  const dayEvents = selectedDay ? eventsForDay(selectedDay) : [];

  const eventsFilteredIndices = indexFilter === 'starred' ? starredIndices : allIndices.filter(i => i.type === 'administered');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage</h1>
          <p className="text-sm text-muted-foreground">Index lifecycle calendar, running selections & upcoming events</p>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Lifecycle Calendar
          </TabsTrigger>
          <TabsTrigger value="running-selections" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Running Selections
          </TabsTrigger>
          <TabsTrigger value="upcoming-events" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Upcoming Events
          </TabsTrigger>
        </TabsList>

        {/* ─── Calendar Tab ─── */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-muted-foreground" />
              <Popover open={indexPickerOpen} onOpenChange={setIndexPickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={indexPickerOpen} className="w-64 justify-between font-normal">
                    {selectedIndex === 'starred'
                      ? `⭐ Starred Indices ${starredIndices.length > 0 ? `(${starredIndices.length})` : '(all)'}`
                      : selectedIndex === 'all'
                        ? 'All Indices'
                        : (() => { const idx = allIndices.find(i => i.id === selectedIndex); return idx ? `${idx.ticker} — ${idx.name}` : 'Select index'; })()
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search index by name or ticker..." />
                    <CommandList>
                      <CommandEmpty>No index found.</CommandEmpty>
                      <CommandGroup heading="Quick filters">
                        <CommandItem value="starred" onSelect={() => { setSelectedIndex('starred'); setIndexPickerOpen(false); }}>
                          <Check className={cn('mr-2 h-4 w-4', selectedIndex === 'starred' ? 'opacity-100' : 'opacity-0')} />
                          ⭐ Starred Indices
                        </CommandItem>
                        <CommandItem value="all" onSelect={() => { setSelectedIndex('all'); setIndexPickerOpen(false); }}>
                          <Check className={cn('mr-2 h-4 w-4', selectedIndex === 'all' ? 'opacity-100' : 'opacity-0')} />
                          All Indices
                        </CommandItem>
                      </CommandGroup>
                      <CommandGroup heading="Indices">
                        {allIndices.map(idx => (
                          <CommandItem key={idx.id} value={`${idx.ticker} ${idx.name}`} onSelect={() => { setSelectedIndex(idx.id); setIndexPickerOpen(false); }}>
                            <Check className={cn('mr-2 h-4 w-4', selectedIndex === idx.id ? 'opacity-100' : 'opacity-0')} />
                            <span className="font-mono text-xs mr-2">{idx.ticker}</span>
                            <span>{idx.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-2">
              {(Object.entries(eventTypeConfig) as [EventType, typeof eventTypeConfig[EventType]][]).map(([type, cfg]) => (
                <button key={type} onClick={() => toggleType(type)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all', activeTypes.has(type) ? `${cfg.bgClass} ${cfg.textClass} border-current` : 'bg-muted text-muted-foreground border-transparent opacity-50')}>{cfg.label}</button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground ml-auto">{eventsForMonth.length} event{eventsForMonth.length !== 1 ? 's' : ''} this month</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(p => subMonths(p, 1))}><ChevronLeft className="h-5 w-5" /></Button>
                  <CardTitle className="text-lg">{format(currentMonth, 'MMMM yyyy')}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(p => addMonths(p, 1))}><ChevronRight className="h-5 w-5" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 mb-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-24 border border-border/30" />
                  ))}
                  {days.map(day => {
                    const de = eventsForDay(day);
                    const isSelected = selectedDay && isSameDay(day, selectedDay);
                    const today = isToday(day);
                    return (
                      <button key={day.toISOString()} onClick={() => setSelectedDay(isSelected ? null : day)} className={cn('h-24 border border-border/30 p-1 text-left transition-colors relative', 'hover:bg-accent/50', isSelected && 'ring-2 ring-primary bg-accent', today && !isSelected && 'bg-primary/5')}>
                        <span className={cn('text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full', today && 'bg-primary text-primary-foreground')}>{format(day, 'd')}</span>
                        <div className="mt-0.5 space-y-0.5 overflow-hidden">
                          {de.slice(0, 3).map(ev => (
                            <div key={ev.id} className={cn('text-[10px] leading-tight px-1 py-0.5 rounded truncate', eventTypeConfig[ev.type].bgClass, eventTypeConfig[ev.type].textClass)}>{ev.ticker}</div>
                          ))}
                          {de.length > 3 && <div className="text-[10px] text-muted-foreground px-1">+{de.length - 3} more</div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {selectedDay ? (
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{format(selectedDay, 'EEEE, MMM d yyyy')}</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {dayEvents.length === 0 ? <p className="text-sm text-muted-foreground">No events on this day.</p> : dayEvents.map(ev => (
                      <div key={ev.id} className="border border-border rounded-lg p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={cn('text-xs', eventTypeConfig[ev.type].bgClass, eventTypeConfig[ev.type].textClass)}>{eventTypeConfig[ev.type].label}</Badge>
                          <span className="text-xs font-mono text-muted-foreground">{ev.ticker}</span>
                        </div>
                        <p className="text-sm font-medium">{ev.indexName}</p>
                        <p className="text-xs text-muted-foreground">{ev.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />Upcoming Events</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {filteredEvents.filter(e => e.date >= new Date()).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 8).map(ev => (
                      <div key={ev.id} className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
                        <div className="text-center min-w-[40px]">
                          <div className="text-xs text-muted-foreground">{format(ev.date, 'MMM')}</div>
                          <div className="text-lg font-bold text-foreground">{format(ev.date, 'd')}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn('text-[10px] px-1.5', eventTypeConfig[ev.type].bgClass, eventTypeConfig[ev.type].textClass)}>{eventTypeConfig[ev.type].label}</Badge>
                            <span className="text-xs font-mono text-muted-foreground">{ev.ticker}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{ev.description}</p>
                        </div>
                      </div>
                    ))}
                    {filteredEvents.filter(e => e.date >= new Date()).length === 0 && <p className="text-sm text-muted-foreground">No upcoming events.</p>}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ─── Running Selections Tab ─── */}
        <TabsContent value="running-selections" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <GaugeView title="Nr of Active Proforma" value={activeProforma} maxValue={10} color="teal" />
            <GaugeView title="Ex Tomorrow" value={exTomorrow} maxValue={5} color="yellow" />
          </div>
          <RunningSelectionsTable />
        </TabsContent>

        {/* ─── Upcoming Events Tab ─── */}
        <TabsContent value="upcoming-events" className="space-y-6">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Select value={indexFilter} onValueChange={(v: 'starred' | 'administered') => setIndexFilter(v)}>
                <SelectTrigger className="w-56"><SelectValue placeholder="Filter by type" /></SelectTrigger>
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
          </div>
          <IndexEventsWidget indices={eventsFilteredIndices} standalone={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Manage;
