
import React, { useState, useMemo } from 'react';
import { useStarred } from '@/contexts/StarredContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays, RefreshCw, Filter as FilterIcon, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns';

// Event types
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

// All known indices
const allIndices = [
  { id: 'idx-1', name: 'Global Tech Leaders', ticker: 'GTECH' },
  { id: 'idx-2', name: 'European Momentum', ticker: 'EUMOM' },
  { id: 'idx-3', name: 'Sustainable Energy', ticker: 'SENRG' },
  { id: 'idx-4', name: 'Financial Services', ticker: 'FINSERV' },
  { id: 'idx-5', name: 'Healthcare Innovation', ticker: 'HLTHIN' },
  { id: 'idx-6', name: 'Consumer Staples', ticker: 'CSTAPLE' },
];

// Mock lifecycle events spread across months
const mockEvents: LifecycleEvent[] = [
  // Past
  { id: 'e1', date: new Date('2025-11-15'), type: 'REBALANCING', indexId: 'idx-1', indexName: 'Global Tech Leaders', ticker: 'GTECH', description: 'Quarterly rebalancing' },
  { id: 'e2', date: new Date('2025-11-20'), type: 'CORPORATE_ACTION', indexId: 'idx-2', indexName: 'European Momentum', ticker: 'EUMOM', description: 'Cash dividend — SAP' },
  { id: 'e3', date: new Date('2025-12-01'), type: 'SELECTION', indexId: 'idx-3', indexName: 'Sustainable Energy', ticker: 'SENRG', description: 'Annual selection' },
  { id: 'e4', date: new Date('2025-12-10'), type: 'REBALANCING', indexId: 'idx-5', indexName: 'Healthcare Innovation', ticker: 'HLTHIN', description: 'Semi-annual rebalancing' },
  { id: 'e5', date: new Date('2026-01-08'), type: 'CORPORATE_ACTION', indexId: 'idx-1', indexName: 'Global Tech Leaders', ticker: 'GTECH', description: 'Stock split — AAPL' },
  { id: 'e6', date: new Date('2026-01-15'), type: 'SELECTION', indexId: 'idx-4', indexName: 'Financial Services', ticker: 'FINSERV', description: 'Quarterly selection' },
  { id: 'e7', date: new Date('2026-01-22'), type: 'REBALANCING', indexId: 'idx-6', indexName: 'Consumer Staples', ticker: 'CSTAPLE', description: 'Quarterly rebalancing' },
  // Current month (Feb 2026)
  { id: 'e8', date: new Date('2026-02-05'), type: 'CORPORATE_ACTION', indexId: 'idx-3', indexName: 'Sustainable Energy', ticker: 'SENRG', description: 'Rights issue — ENPH' },
  { id: 'e9', date: new Date('2026-02-14'), type: 'SELECTION', indexId: 'idx-1', indexName: 'Global Tech Leaders', ticker: 'GTECH', description: 'Quarterly selection' },
  { id: 'e10', date: new Date('2026-02-20'), type: 'REBALANCING', indexId: 'idx-2', indexName: 'European Momentum', ticker: 'EUMOM', description: 'Quarterly rebalancing' },
  { id: 'e11', date: new Date('2026-02-24'), type: 'CORPORATE_ACTION', indexId: 'idx-5', indexName: 'Healthcare Innovation', ticker: 'HLTHIN', description: 'Cash dividend — JNJ' },
  { id: 'e12', date: new Date('2026-02-27'), type: 'REBALANCING', indexId: 'idx-4', indexName: 'Financial Services', ticker: 'FINSERV', description: 'Quarterly rebalancing' },
  // Future
  { id: 'e13', date: new Date('2026-03-05'), type: 'SELECTION', indexId: 'idx-2', indexName: 'European Momentum', ticker: 'EUMOM', description: 'Annual selection' },
  { id: 'e14', date: new Date('2026-03-12'), type: 'REBALANCING', indexId: 'idx-1', indexName: 'Global Tech Leaders', ticker: 'GTECH', description: 'Quarterly rebalancing' },
  { id: 'e15', date: new Date('2026-03-18'), type: 'CORPORATE_ACTION', indexId: 'idx-6', indexName: 'Consumer Staples', ticker: 'CSTAPLE', description: 'Merger — KO' },
  { id: 'e16', date: new Date('2026-04-01'), type: 'SELECTION', indexId: 'idx-5', indexName: 'Healthcare Innovation', ticker: 'HLTHIN', description: 'Quarterly selection' },
  { id: 'e17', date: new Date('2026-04-10'), type: 'REBALANCING', indexId: 'idx-3', indexName: 'Sustainable Energy', ticker: 'SENRG', description: 'Quarterly rebalancing' },
];

const eventTypeConfig: Record<EventType, { label: string; color: string; bgClass: string; textClass: string }> = {
  REBALANCING: { label: 'Rebalancing', color: 'hsl(var(--primary))', bgClass: 'bg-primary/10', textClass: 'text-primary' },
  SELECTION: { label: 'Selection', color: 'hsl(168, 76%, 42%)', bgClass: 'bg-teal-100', textClass: 'text-teal-700' },
  CORPORATE_ACTION: { label: 'Corporate Action', color: 'hsl(45, 93%, 47%)', bgClass: 'bg-amber-100', textClass: 'text-amber-700' },
};

const Manage: React.FC = () => {
  const { starredIndices } = useStarred();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Feb 2026
  const [selectedIndex, setSelectedIndex] = useState<string>('starred');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [activeTypes, setActiveTypes] = useState<Set<EventType>>(new Set(['REBALANCING', 'SELECTION', 'CORPORATE_ACTION']));

  const toggleType = (type: EventType) => {
    setActiveTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  // Filter events based on selected index and active types
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

  // Calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart); // 0=Sun

  const eventsForDay = (day: Date) => filteredEvents.filter(e => isSameDay(e.date, day));
  const eventsForMonth = filteredEvents.filter(e => isSameMonth(e.date, currentMonth));

  const dayEvents = selectedDay ? eventsForDay(selectedDay) : [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage</h1>
          <p className="text-sm text-muted-foreground">Index lifecycle calendar — rebalancings, selections & corporate actions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedIndex} onValueChange={setSelectedIndex}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="starred">
                ⭐ Starred Indices {starredIndices.length > 0 ? `(${starredIndices.length})` : '(all)'}
              </SelectItem>
              <SelectItem value="all">All Indices</SelectItem>
              {allIndices.map(idx => (
                <SelectItem key={idx.id} value={idx.id}>{idx.ticker} — {idx.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {(Object.entries(eventTypeConfig) as [EventType, typeof eventTypeConfig[EventType]][]).map(([type, cfg]) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                activeTypes.has(type)
                  ? `${cfg.bgClass} ${cfg.textClass} border-current`
                  : 'bg-muted text-muted-foreground border-transparent opacity-50'
              )}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground ml-auto">
          {eventsForMonth.length} event{eventsForMonth.length !== 1 ? 's' : ''} this month
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-lg">{format(currentMonth, 'MMMM yyyy')}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
            </div>
            {/* Days grid */}
            <div className="grid grid-cols-7">
              {/* Empty cells for offset */}
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-24 border border-border/30" />
              ))}
              {days.map(day => {
                const de = eventsForDay(day);
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                const today = isToday(day);
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={cn(
                      'h-24 border border-border/30 p-1 text-left transition-colors relative',
                      'hover:bg-accent/50',
                      isSelected && 'ring-2 ring-primary bg-accent',
                      today && !isSelected && 'bg-primary/5'
                    )}
                  >
                    <span className={cn(
                      'text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full',
                      today && 'bg-primary text-primary-foreground'
                    )}>
                      {format(day, 'd')}
                    </span>
                    <div className="mt-0.5 space-y-0.5 overflow-hidden">
                      {de.slice(0, 3).map(ev => (
                        <div
                          key={ev.id}
                          className={cn(
                            'text-[10px] leading-tight px-1 py-0.5 rounded truncate',
                            eventTypeConfig[ev.type].bgClass,
                            eventTypeConfig[ev.type].textClass
                          )}
                        >
                          {ev.ticker}
                        </div>
                      ))}
                      {de.length > 3 && (
                        <div className="text-[10px] text-muted-foreground px-1">+{de.length - 3} more</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Day detail / upcoming list */}
        <div className="space-y-4">
          {selectedDay ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {format(selectedDay, 'EEEE, MMM d yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dayEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events on this day.</p>
                ) : (
                  dayEvents.map(ev => (
                    <div key={ev.id} className="border border-border rounded-lg p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={cn('text-xs', eventTypeConfig[ev.type].bgClass, eventTypeConfig[ev.type].textClass)}>
                          {eventTypeConfig[ev.type].label}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">{ev.ticker}</span>
                      </div>
                      <p className="text-sm font-medium">{ev.indexName}</p>
                      <p className="text-xs text-muted-foreground">{ev.description}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredEvents
                  .filter(e => e.date >= new Date())
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 8)
                  .map(ev => (
                    <div key={ev.id} className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
                      <div className="text-center min-w-[40px]">
                        <div className="text-xs text-muted-foreground">{format(ev.date, 'MMM')}</div>
                        <div className="text-lg font-bold text-foreground">{format(ev.date, 'd')}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn('text-[10px] px-1.5', eventTypeConfig[ev.type].bgClass, eventTypeConfig[ev.type].textClass)}>
                            {eventTypeConfig[ev.type].label}
                          </Badge>
                          <span className="text-xs font-mono text-muted-foreground">{ev.ticker}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{ev.description}</p>
                      </div>
                    </div>
                  ))
                }
                {filteredEvents.filter(e => e.date >= new Date()).length === 0 && (
                  <p className="text-sm text-muted-foreground">No upcoming events.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Manage;
