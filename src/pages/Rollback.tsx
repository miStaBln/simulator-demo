import React, { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Helper to convert yyyy-MM-dd to dd.MM.yyyy
const formatDateForPicker = (isoDate: string) => {
  const [y, m, d] = isoDate.split('-');
  return `${d}.${m}.${y}`;
};
import { RotateCcw, ChevronRight, Check, AlertTriangle, Download, Upload, Search, ArrowLeft, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DatePicker from '@/components/DatePicker';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'context', label: 'Context', description: 'Choose correction type' },
  { id: 'preparation', label: 'Preparation', description: 'Select indices, dates & upload data' },
  { id: 'preview', label: 'Preview', description: 'Review impact & KPIs' },
  { id: 'execute', label: 'Execute', description: 'Confirm & apply' },
];

type CorrectionType = 'rebalancing' | 'corporate_event' | 'price' | null;

const MOCK_INDICES = [
  { id: 'SOL_GTECH', name: 'Solactive Global Technology', ticker: 'GTECH' },
  { id: 'SOL_GCLEAN', name: 'Solactive Global Clean Energy', ticker: 'GCLEAN' },
  { id: 'SOL_ARTINT', name: 'Solactive Artificial Intelligence', ticker: 'ARTINT' },
  { id: 'SOL_CLOUD', name: 'Solactive Cloud Computing', ticker: 'CLOUD' },
  { id: 'SOL_CYBER', name: 'Solactive Cybersecurity', ticker: 'CYBER' },
  { id: 'SOL_ECOMM', name: 'Solactive E-Commerce', ticker: 'ECOMM' },
  { id: 'SOL_FINTECH', name: 'Solactive FinTech', ticker: 'FINTECH' },
  { id: 'SOL_HEALTH', name: 'Solactive Digital Health', ticker: 'HEALTH' },
];

const generatePreviewData = (seed: number) => {
  const data = [];
  let actualLevel = 1000 + seed * 50;
  let correctedLevel = actualLevel;
  let actualDivisor = 50000000 + seed * 1000000;
  let correctedDivisor = actualDivisor;

  let s = seed * 9301 + 49297;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };

  for (let i = 0; i < 20; i++) {
    const date = new Date(2026, 1, 1 + i);
    const dayStr = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;

    const change = (rand() - 0.48) * 8;
    actualLevel += change;
    correctedLevel += change + (i > 5 ? (rand() - 0.3) * 2 : 0);

    if (i === 6) actualDivisor *= 1.002;
    correctedDivisor = actualDivisor * (1 + (i > 5 ? 0.0005 : 0));

    data.push({
      date: dayStr,
      actualLevel: parseFloat(actualLevel.toFixed(4)),
      correctedLevel: parseFloat(correctedLevel.toFixed(4)),
      actualDivisor: parseFloat(actualDivisor.toFixed(2)),
      correctedDivisor: parseFloat(correctedDivisor.toFixed(2)),
      deviation: parseFloat(Math.abs(correctedLevel - actualLevel).toFixed(4)),
    });
  }
  return data;
};

interface RebalancingEntry {
  id: string;
  selectionDate: string;
  rebalancingDate: string;
  components: Array<{ ric: string; shares: string; weight: string; weightingCapFactor: string }>;
}

type RebalancingInputMode = 'upload' | 'manual';

// --- State for a single rollback session ---
interface RollbackSession {
  id: string;
  label: string;
  currentStep: number;
  correctionType: CorrectionType;
  selectedIndices: string[];
  indexPickerOpen: boolean;
  startDate: string;
  endDate: string;
  uploadedFile: string | null;
  isExecuting: boolean;
  isExecuted: boolean;
  description: string;
  activePreviewTab: string;
  rebalancingInputMode: RebalancingInputMode;
  rebalancings: RebalancingEntry[];
  shareOrWeight: string;
}

let sessionCounter = 1;

const createSession = (prefill?: any): RollbackSession => {
  const id = `session-${sessionCounter++}`;
  return {
    id,
    label: `Rollback ${sessionCounter - 1}`,
    currentStep: prefill ? 1 : 0,
    correctionType: prefill?.correctionType || null,
    selectedIndices: prefill?.selectedIndices || [],
    indexPickerOpen: false,
    startDate: prefill?.startDate ? formatDateForPicker(prefill.startDate) : '01.02.2026',
    endDate: prefill?.endDate ? formatDateForPicker(prefill.endDate) : '20.02.2026',
    uploadedFile: null,
    isExecuting: false,
    isExecuted: false,
    description: prefill?.eventDescription || '',
    activePreviewTab: '',
    rebalancingInputMode: 'upload',
    rebalancings: [],
    shareOrWeight: 'shares',
  };
};

const Rollback = () => {
  const location = useLocation();
  const prefill = (location.state as any)?.prefill;

  const [sessions, setSessions] = useState<RollbackSession[]>([createSession(prefill)]);
  const [activeSessionId, setActiveSessionId] = useState(sessions[0].id);

  const activeSession = React.useMemo(() => {
    const found = sessions.find(s => s.id === activeSessionId) || sessions[0];
    // Ensure new fields have defaults for sessions created before they were added
    return {
      ...found,
      rebalancings: found.rebalancings ?? [],
      rebalancingInputMode: found.rebalancingInputMode ?? 'upload',
      shareOrWeight: found.shareOrWeight ?? 'shares',
    };
  }, [sessions, activeSessionId]);

  const updateSession = useCallback((sessionId: string, updates: Partial<RollbackSession>) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, ...updates } : s));
  }, []);

  const addSession = () => {
    const newSession = createSession();
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
  };

  const closeSession = (sessionId: string) => {
    setSessions(prev => {
      const next = prev.filter(s => s.id !== sessionId);
      if (next.length === 0) {
        const fresh = createSession();
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(next[0].id);
      }
      return next;
    });
  };

  // Shortcut setters for active session
  const s = activeSession;
  const update = (updates: Partial<RollbackSession>) => updateSession(s.id, updates);

  const previewDataMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof generatePreviewData>> = {};
    s.selectedIndices.forEach((id, i) => { map[id] = generatePreviewData(i + 1); });
    return map;
  }, [s.selectedIndices]);

  const selectedIndicesData = MOCK_INDICES.filter(idx => s.selectedIndices.includes(idx.id));

  React.useEffect(() => {
    if (s.currentStep === 2 && s.selectedIndices.length > 0 && !s.selectedIndices.includes(s.activePreviewTab)) {
      update({ activePreviewTab: s.selectedIndices[0] });
    }
  }, [s.currentStep, s.selectedIndices, s.activePreviewTab]);

  // Auto-update tab label based on selected indices
  React.useEffect(() => {
    if (s.selectedIndices.length === 1) {
      const idx = MOCK_INDICES.find(i => i.id === s.selectedIndices[0]);
      if (idx) update({ label: `${idx.ticker}` });
    } else if (s.selectedIndices.length > 1) {
      update({ label: `${s.selectedIndices.length} indices` });
    }
  }, [s.selectedIndices]);

  const toggleIndex = (id: string) => {
    update({
      selectedIndices: s.selectedIndices.includes(id)
        ? s.selectedIndices.filter(x => x !== id)
        : [...s.selectedIndices, id]
    });
  };

  const canProceed = () => {
    switch (s.currentStep) {
      case 0: return s.correctionType !== null;
      case 1: return s.selectedIndices.length > 0 && s.startDate && s.endDate;
      case 2: return true;
      case 3: return true;
      default: return false;
    }
  };

  const handleNext = () => { if (s.currentStep < STEPS.length - 1) update({ currentStep: s.currentStep + 1 }); };
  const handleBack = () => { if (s.currentStep > 0) update({ currentStep: s.currentStep - 1 }); };

  const handleExecute = () => {
    update({ isExecuting: true });
    setTimeout(() => { updateSession(s.id, { isExecuting: false, isExecuted: true }); }, 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) update({ uploadedFile: e.target.files[0].name });
  };

  // --- Rebalancing helpers ---
  const addRebalancing = () => {
    const newEntry: RebalancingEntry = {
      id: `reb-${Date.now()}`,
      selectionDate: '',
      rebalancingDate: '',
      components: [{ ric: '', shares: '', weight: '', weightingCapFactor: '1.0' }],
    };
    update({ rebalancings: [...s.rebalancings, newEntry] });
  };

  const removeRebalancing = (index: number) => {
    update({ rebalancings: s.rebalancings.filter((_, i) => i !== index) });
  };

  const updateRebalancingDate = (index: number, field: 'selectionDate' | 'rebalancingDate', value: string) => {
    const updated = [...s.rebalancings];
    updated[index] = { ...updated[index], [field]: value };
    update({ rebalancings: updated });
  };

  const addRebalancingComponent = (rebIndex: number) => {
    const updated = [...s.rebalancings];
    updated[rebIndex] = {
      ...updated[rebIndex],
      components: [...updated[rebIndex].components, { ric: '', shares: '', weight: '', weightingCapFactor: '1.0' }],
    };
    update({ rebalancings: updated });
  };

  const updateRebalancingComponent = (
    rebIndex: number,
    compIndex: number,
    field: 'ric' | 'shares' | 'weight' | 'weightingCapFactor',
    value: string
  ) => {
    const updated = [...s.rebalancings];
    const comps = [...updated[rebIndex].components];
    comps[compIndex] = { ...comps[compIndex], [field]: value };
    updated[rebIndex] = { ...updated[rebIndex], components: comps };
    update({ rebalancings: updated });
  };

  const removeRebalancingComponent = (rebIndex: number, compIndex: number) => {
    const updated = [...s.rebalancings];
    updated[rebIndex] = {
      ...updated[rebIndex],
      components: updated[rebIndex].components.filter((_, i) => i !== compIndex),
    };
    update({ rebalancings: updated });
  };

  // --- Step Renderers ---

  const renderContextStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">What needs to be corrected?</h3>
      <p className="text-sm text-muted-foreground">Select the type of correction to determine the rollback workflow.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {[
          { type: 'rebalancing' as CorrectionType, title: 'Rebalancing Correction', desc: 'Wrong constituents, weights, or shares were applied during a rebalancing event.', icon: '⚖️' },
          { type: 'corporate_event' as CorrectionType, title: 'Corporate Event Correction', desc: 'A corporate action (split, merger, spin-off) was incorrectly processed or missed.', icon: '🏢' },
          { type: 'price' as CorrectionType, title: 'Price Correction', desc: 'Wrong or stale prices were used for one or more constituents in the calculation.', icon: '💰' },
        ].map(item => (
          <Card
            key={item.type}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md border-2',
              s.correctionType === item.type ? 'border-primary bg-primary/5' : 'border-border'
            )}
            onClick={() => update({ correctionType: item.type })}
          >
            <CardContent className="pt-6">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
              {s.correctionType === item.type && <Badge className="mt-3" variant="default">Selected</Badge>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPreparationStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Prepare {s.correctionType === 'rebalancing' ? 'Rebalancing' : s.correctionType === 'corporate_event' ? 'Corporate Event' : 'Price'} Correction
      </h3>

      {/* Single index info banner */}
      {selectedIndicesData.length === 1 && (
        <Alert>
          <AlertDescription>
            <strong>Index:</strong> {selectedIndicesData[0].name} ({selectedIndicesData[0].ticker}) — <span className="text-muted-foreground">{selectedIndicesData[0].id}</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Multi-Index Selection */}
      <div>
        <label className="block text-sm font-medium mb-1">Select Indices</label>
        <Popover open={s.indexPickerOpen} onOpenChange={(open) => update({ indexPickerOpen: open })}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between h-auto min-h-9 py-1.5">
              {s.selectedIndices.length > 0 ? (
                <span className="text-sm">{s.selectedIndices.length} index{s.selectedIndices.length > 1 ? 'es' : ''} selected</span>
              ) : (
                <span className="text-muted-foreground">Search and select indices...</span>
              )}
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search index..." />
              <CommandList>
                <CommandEmpty>No index found.</CommandEmpty>
                <CommandGroup>
                  {MOCK_INDICES.map(idx => (
                    <CommandItem
                      key={idx.id}
                      value={`${idx.ticker} ${idx.name}`}
                      onSelect={() => toggleIndex(idx.id)}
                    >
                      <div className={cn(
                        'mr-2 h-4 w-4 border rounded-sm flex items-center justify-center',
                        s.selectedIndices.includes(idx.id) ? 'bg-primary border-primary' : 'border-muted-foreground/40'
                      )}>
                        {s.selectedIndices.includes(idx.id) && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <span className="font-medium mr-2">{idx.ticker}</span>
                      <span className="text-muted-foreground">{idx.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {s.selectedIndices.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selectedIndicesData.map(idx => (
              <Badge key={idx.id} variant="secondary" className="gap-1">
                {idx.ticker}
                <X className="h-3 w-3 cursor-pointer" onClick={() => toggleIndex(idx.id)} />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <DatePicker label="Correction Start Date" value={s.startDate} onChange={(v) => update({ startDate: v })} />
        <DatePicker label="Correction End Date" value={s.endDate} onChange={(v) => update({ endDate: v })} />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description / Reason</label>
        <Input placeholder="Describe why this correction is needed..." value={s.description} onChange={(e) => update({ description: e.target.value })} className="h-9" />
      </div>

      {/* Summary card for preparation */}
      {s.selectedIndices.length > 0 && (
        <Card className="bg-muted/30">
          <CardHeader className="pb-2"><CardTitle className="text-base">Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <span className="text-muted-foreground">Correction Type:</span>
              <span className="font-medium capitalize">{s.correctionType?.replace('_', ' ')}</span>
              <span className="text-muted-foreground">{s.selectedIndices.length === 1 ? 'Index:' : 'Indices:'}</span>
              <span className="font-medium">
                {selectedIndicesData.map(i => `${i.name} (${i.ticker})`).join(', ')}
              </span>
              <span className="text-muted-foreground">Period:</span>
              <span className="font-medium">{s.startDate} → {s.endDate}</span>
              {s.description && (
                <>
                  <span className="text-muted-foreground">Reason:</span>
                  <span className="font-medium">{s.description}</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Context-specific: Rebalancing */}
      {s.correctionType === 'rebalancing' && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Corrected Rebalancing Data</CardTitle>
              <div className="flex items-center gap-1 rounded-md border p-0.5">
                <Button
                  variant={s.rebalancingInputMode === 'upload' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => update({ rebalancingInputMode: 'upload' })}
                >
                  <Upload className="h-3 w-3 mr-1" />Upload
                </Button>
                <Button
                  variant={s.rebalancingInputMode === 'manual' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => update({ rebalancingInputMode: 'manual' })}
                >
                  <Plus className="h-3 w-3 mr-1" />Manual
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {s.rebalancingInputMode === 'upload' ? (
              <>
                <p className="text-sm text-muted-foreground mb-3">Upload a CSV/Excel file with the correct constituents, weights, and shares.</p>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
                    <Button variant="outline" size="sm" asChild><span><Upload className="h-4 w-4 mr-2" />Choose File</span></Button>
                  </label>
                  {s.uploadedFile && <span className="text-sm text-muted-foreground">{s.uploadedFile}</span>}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {/* Entry type toggle */}
                <div>
                  <label className="block text-sm font-medium mb-1">Entry Type</label>
                  <Select value={s.shareOrWeight} onValueChange={(v) => update({ shareOrWeight: v })}>
                    <SelectTrigger className="w-48 h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shares">Shares</SelectItem>
                      <SelectItem value="weight">Weight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rebalancing entries */}
                {s.rebalancings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No rebalancing entries yet. Add one below.</p>
                ) : (
                  <div className="space-y-4">
                    {s.rebalancings.map((reb, rebIdx) => (
                      <Card key={reb.id} className="border">
                        <CardHeader className="pb-2 pt-4 px-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Rebalancing #{rebIdx + 1}</span>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => removeRebalancing(rebIdx)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 space-y-3">
                          {/* Dates */}
                          <div className="grid grid-cols-2 gap-4">
                            <DatePicker label="Selection Date" value={reb.selectionDate} onChange={(v) => updateRebalancingDate(rebIdx, 'selectionDate', v)} />
                            <DatePicker label="Rebalancing Date" value={reb.rebalancingDate} onChange={(v) => updateRebalancingDate(rebIdx, 'rebalancingDate', v)} />
                          </div>

                          {/* Components table */}
                          <div>
                            <div className="text-sm font-medium mb-2">Components</div>
                            <div className="border rounded-md">
                              <div className="grid grid-cols-12 gap-2 p-2 bg-muted/50 border-b text-xs font-medium">
                                <div className="col-span-3">Identifier</div>
                                <div className="col-span-3">{s.shareOrWeight === 'shares' ? 'Shares' : 'Weight (%)'}</div>
                                <div className="col-span-4">Weighting Cap Factor</div>
                                <div className="col-span-2">Actions</div>
                              </div>
                              {reb.components.map((comp, compIdx) => (
                                <div key={compIdx} className="grid grid-cols-12 gap-2 p-2 items-center border-b last:border-b-0">
                                  <div className="col-span-3">
                                    <Input
                                      value={comp.ric}
                                      onChange={(e) => updateRebalancingComponent(rebIdx, compIdx, 'ric', e.target.value)}
                                      placeholder="e.g. AAPL.O"
                                      className="h-8 text-sm"
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <Input
                                      value={s.shareOrWeight === 'shares' ? comp.shares : comp.weight}
                                      onChange={(e) => updateRebalancingComponent(rebIdx, compIdx, s.shareOrWeight === 'shares' ? 'shares' : 'weight', e.target.value)}
                                      placeholder={s.shareOrWeight === 'shares' ? '1000' : '5.0'}
                                      className="h-8 text-sm"
                                    />
                                  </div>
                                  <div className="col-span-4">
                                    <Input
                                      type="number"
                                      value={comp.weightingCapFactor}
                                      onChange={(e) => updateRebalancingComponent(rebIdx, compIdx, 'weightingCapFactor', e.target.value)}
                                      placeholder="1.0"
                                      step="0.01"
                                      className="h-8 text-sm"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => removeRebalancingComponent(rebIdx, compIdx)}>
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <Button variant="outline" size="sm" className="mt-2" onClick={() => addRebalancingComponent(rebIdx)}>
                              <Plus className="h-3 w-3 mr-1" />Add Component
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <Button onClick={addRebalancing} size="sm">
                  <Plus className="h-4 w-4 mr-2" />Add Rebalancing
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {s.correctionType === 'price' && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Upload Corrected Prices</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Upload a CSV file with instrument identifiers and corrected prices per date.</p>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
                <Button variant="outline" size="sm" asChild><span><Upload className="h-4 w-4 mr-2" />Choose File</span></Button>
              </label>
              {s.uploadedFile && <span className="text-sm text-muted-foreground">{s.uploadedFile}</span>}
            </div>
          </CardContent>
        </Card>
      )}

      {s.correctionType === 'corporate_event' && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Corporate Event Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Event Type</label>
              <Select defaultValue="stock_split">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock_split">Stock Split</SelectItem>
                  <SelectItem value="reverse_split">Reverse Split</SelectItem>
                  <SelectItem value="merger">Merger</SelectItem>
                  <SelectItem value="spin_off">Spin-off</SelectItem>
                  <SelectItem value="rights_issue">Rights Issue</SelectItem>
                  <SelectItem value="special_dividend">Special Dividend</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Affected Instrument</label>
              <Input placeholder="e.g., AAPL.O" className="h-9" />
            </div>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
                <Button variant="outline" size="sm" asChild><span><Upload className="h-4 w-4 mr-2" />Upload Override Data</span></Button>
              </label>
              {s.uploadedFile && <span className="text-sm text-muted-foreground">{s.uploadedFile}</span>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderPreviewForIndex = (indexId: string) => {
    const data = previewDataMap[indexId] || [];
    const idxData = MOCK_INDICES.find(i => i.id === indexId);
    const maxDev = Math.max(...data.map(d => d.deviation));
    const avgDev = data.reduce((s, d) => s + d.deviation, 0) / data.length;

    const levelDomain: [number, number] = [
      Math.min(...data.map(d => Math.min(d.actualLevel, d.correctedLevel))) * 0.998,
      Math.max(...data.map(d => Math.max(d.actualLevel, d.correctedLevel))) * 1.002,
    ];
    const divisorDomain: [number, number] = [
      Math.min(...data.map(d => Math.min(d.actualDivisor, d.correctedDivisor))) * 0.999,
      Math.max(...data.map(d => Math.max(d.actualDivisor, d.correctedDivisor))) * 1.001,
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="text-xs text-muted-foreground">Max Level Deviation</div>
              <div className="text-xl font-bold text-destructive">{maxDev.toFixed(4)}</div>
              <div className="text-xs text-muted-foreground">{((maxDev / data[0]?.actualLevel || 1) * 100).toFixed(3)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="text-xs text-muted-foreground">Avg Level Deviation</div>
              <div className="text-xl font-bold">{avgDev.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="text-xs text-muted-foreground">Affected Days</div>
              <div className="text-xl font-bold">{data.filter(d => d.deviation > 0.5).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="text-xs text-muted-foreground">Correction Type</div>
              <div className="text-xl font-bold capitalize">{s.correctionType?.replace('_', ' ')}</div>
            </CardContent>
          </Card>
        </div>

        {maxDev > 2 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Large deviation detected for <strong>{idxData?.ticker}</strong> ({maxDev.toFixed(4)}). Please verify the uploaded correction data.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Index Level — Actual vs Corrected</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={70} />
                <YAxis yAxisId="level" domain={levelDomain} tickFormatter={(v) => v.toFixed(1)} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number, name: string) => {
                  const label = name === 'actualLevel' ? 'Actual Level' : 'Corrected Level';
                  return [value.toFixed(4), label];
                }} />
                <Legend formatter={(v) => v === 'actualLevel' ? 'Actual' : 'Corrected'} />
                <Line yAxisId="level" type="monotone" dataKey="actualLevel" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line yAxisId="level" type="monotone" dataKey="correctedLevel" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Divisor — Actual vs Corrected</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={70} />
                <YAxis domain={divisorDomain} tickFormatter={(v) => v.toLocaleString()} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number, name: string) => {
                  const label = name === 'actualDivisor' ? 'Actual Divisor' : 'Corrected Divisor';
                  return [value.toLocaleString(), label];
                }} />
                <Legend formatter={(v) => v === 'actualDivisor' ? 'Actual' : 'Corrected'} />
                <Line type="monotone" dataKey="actualDivisor" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="correctedDivisor" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Download Corrected Time Series</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Download Deviation Report</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Download Constituents Diff</Button>
        </div>
      </div>
    );
  };

  const renderPreviewStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Rollback Preview</h3>

      {s.selectedIndices.length === 1 ? (
        <>
          <p className="text-sm text-muted-foreground">
            Previewing correction for <strong>{selectedIndicesData[0]?.name}</strong> ({selectedIndicesData[0]?.ticker})
          </p>
          {renderPreviewForIndex(s.selectedIndices[0])}
        </>
      ) : (
        <Tabs value={s.activePreviewTab} onValueChange={(v) => update({ activePreviewTab: v })}>
          <TabsList className="mb-4 flex-wrap h-auto gap-1">
            {selectedIndicesData.map(idx => {
              const data = previewDataMap[idx.id] || [];
              const maxDev = Math.max(...data.map(d => d.deviation));
              return (
                <TabsTrigger key={idx.id} value={idx.id} className="gap-1.5">
                  {idx.ticker}
                  {maxDev > 2 && <AlertTriangle className="h-3 w-3 text-destructive" />}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {s.selectedIndices.map(id => (
            <TabsContent key={id} value={id}>
              {renderPreviewForIndex(id)}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );

  const renderExecuteStep = () => (
    <div className="space-y-6">
      {!s.isExecuted ? (
        <>
          <h3 className="text-lg font-semibold">Confirm & Execute Rollback</h3>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This action will overwrite production index data for <strong>{selectedIndicesData.map(i => `${i.name} (${i.ticker})`).join(', ')}</strong> between <strong>{s.startDate}</strong> and <strong>{s.endDate}</strong>. This cannot be undone automatically.
            </AlertDescription>
          </Alert>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <span className="text-muted-foreground">{s.selectedIndices.length === 1 ? 'Index:' : 'Indices:'}</span>
                <span className="font-medium">
                  {selectedIndicesData.map(i => `${i.name} (${i.ticker})`).join(', ')}
                </span>
                <span className="text-muted-foreground">Correction Type:</span>
                <span className="font-medium capitalize">{s.correctionType?.replace('_', ' ')}</span>
                <span className="text-muted-foreground">Period:</span>
                <span className="font-medium">{s.startDate} → {s.endDate}</span>
                <span className="text-muted-foreground">Uploaded File:</span>
                <span className="font-medium">{s.uploadedFile || 'None'}</span>
                {s.description && (
                  <>
                    <span className="text-muted-foreground">Reason:</span>
                    <span className="font-medium">{s.description}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="destructive" onClick={handleExecute} disabled={s.isExecuting} className="min-w-[200px]">
              {s.isExecuting ? (
                <><RotateCcw className="h-4 w-4 mr-2 animate-spin" />Executing Rollback...</>
              ) : (
                <><RotateCcw className="h-4 w-4 mr-2" />Execute Rollback ({s.selectedIndices.length} {s.selectedIndices.length === 1 ? 'index' : 'indices'})</>
              )}
            </Button>
            <Button variant="outline" onClick={handleBack} disabled={s.isExecuting}>Go Back</Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Rollback Executed Successfully</h3>
          <p className="text-muted-foreground mb-6">
            {s.selectedIndices.length === 1 ? (
              <>Index <strong>{selectedIndicesData[0]?.name} ({selectedIndicesData[0]?.ticker})</strong> has been corrected for the period {s.startDate} — {s.endDate}.</>
            ) : (
              <><strong>{s.selectedIndices.length}</strong> indices ({selectedIndicesData.map(i => `${i.name} (${i.ticker})`).join(', ')}) have been corrected for the period {s.startDate} — {s.endDate}.</>
            )}
          </p>
          <Button variant="outline" onClick={() => update({ currentStep: 0, correctionType: null, selectedIndices: [], uploadedFile: null, isExecuted: false, description: '' })}>
            Start New Rollback
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <RotateCcw className="h-6 w-6" />
          Index Rollback / Correction
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Correct indices affected by wrong rebalancing, prices, or corporate events.
        </p>
      </div>

      {/* Parallel rollback session tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-1 border-b">
          {sessions.map(session => (
            <div
              key={session.id}
              className={cn(
                'group flex items-center gap-1.5 px-3 py-2 text-sm cursor-pointer border-b-2 -mb-px transition-colors',
                session.id === activeSessionId
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
              onClick={() => setActiveSessionId(session.id)}
            >
              <span>{session.label}</span>
              {session.isExecuted && <Check className="h-3 w-3 text-primary" />}
              {sessions.length > 1 && (
                <X
                  className="h-3 w-3 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                  onClick={(e) => { e.stopPropagation(); closeSession(session.id); }}
                />
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 ml-1"
            onClick={addSession}
            title="New rollback"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <div
              className={cn('flex items-center gap-2 cursor-pointer', i <= s.currentStep ? 'text-foreground' : 'text-muted-foreground')}
              onClick={() => { if (i < s.currentStep) update({ currentStep: i }); }}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors',
                i < s.currentStep ? 'bg-primary text-primary-foreground border-primary' :
                i === s.currentStep ? 'border-primary text-primary' :
                'border-muted-foreground/30 text-muted-foreground'
              )}>
                {i < s.currentStep ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">{step.label}</div>
                <div className="text-xs text-muted-foreground">{step.description}</div>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('flex-1 h-0.5 mx-3', i < s.currentStep ? 'bg-primary' : 'bg-border')} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {s.currentStep === 0 && renderContextStep()}
        {s.currentStep === 1 && renderPreparationStep()}
        {s.currentStep === 2 && renderPreviewStep()}
        {s.currentStep === 3 && renderExecuteStep()}
      </div>

      {/* Navigation */}
      {!(s.currentStep === 3 && s.isExecuted) && (
        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button variant="outline" onClick={handleBack} disabled={s.currentStep === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />Back
          </Button>
          {s.currentStep < 3 && (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next<ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Rollback;
