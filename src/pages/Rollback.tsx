import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, Check, AlertTriangle, Download, Upload, Search, ArrowLeft, X } from 'lucide-react';
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

  // Simple seeded pseudo-random
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

const Rollback = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [correctionType, setCorrectionType] = useState<CorrectionType>(null);
  const [selectedIndices, setSelectedIndices] = useState<string[]>([]);
  const [indexPickerOpen, setIndexPickerOpen] = useState(false);
  const [startDate, setStartDate] = useState('01.02.2026');
  const [endDate, setEndDate] = useState('20.02.2026');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false);
  const [description, setDescription] = useState('');
  const [activePreviewTab, setActivePreviewTab] = useState('');

  // Generate preview data per selected index (seeded by index position for variety)
  const previewDataMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof generatePreviewData>> = {};
    selectedIndices.forEach((id, i) => { map[id] = generatePreviewData(i + 1); });
    return map;
  }, [selectedIndices]);

  const selectedIndicesData = MOCK_INDICES.filter(idx => selectedIndices.includes(idx.id));

  // Set default active tab when entering preview
  React.useEffect(() => {
    if (currentStep === 2 && selectedIndices.length > 0 && !selectedIndices.includes(activePreviewTab)) {
      setActivePreviewTab(selectedIndices[0]);
    }
  }, [currentStep, selectedIndices, activePreviewTab]);

  const toggleIndex = (id: string) => {
    setSelectedIndices(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return correctionType !== null;
      case 1: return selectedIndices.length > 0 && startDate && endDate;
      case 2: return true;
      case 3: return true;
      default: return false;
    }
  };

  const handleNext = () => { if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1); };
  const handleBack = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => { setIsExecuting(false); setIsExecuted(true); }, 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setUploadedFile(e.target.files[0].name);
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
              correctionType === item.type ? 'border-primary bg-primary/5' : 'border-border'
            )}
            onClick={() => setCorrectionType(item.type)}
          >
            <CardContent className="pt-6">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
              {correctionType === item.type && <Badge className="mt-3" variant="default">Selected</Badge>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPreparationStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Prepare {correctionType === 'rebalancing' ? 'Rebalancing' : correctionType === 'corporate_event' ? 'Corporate Event' : 'Price'} Correction
      </h3>

      {/* Multi-Index Selection */}
      <div>
        <label className="block text-sm font-medium mb-1">Select Indices</label>
        <Popover open={indexPickerOpen} onOpenChange={setIndexPickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between h-auto min-h-9 py-1.5">
              {selectedIndices.length > 0 ? (
                <span className="text-sm">{selectedIndices.length} index{selectedIndices.length > 1 ? 'es' : ''} selected</span>
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
                        selectedIndices.includes(idx.id) ? 'bg-primary border-primary' : 'border-muted-foreground/40'
                      )}>
                        {selectedIndices.includes(idx.id) && <Check className="h-3 w-3 text-primary-foreground" />}
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

        {/* Selected indices chips */}
        {selectedIndices.length > 0 && (
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
        <DatePicker label="Correction Start Date" value={startDate} onChange={setStartDate} />
        <DatePicker label="Correction End Date" value={endDate} onChange={setEndDate} />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description / Reason</label>
        <Input placeholder="Describe why this correction is needed..." value={description} onChange={(e) => setDescription(e.target.value)} className="h-9" />
      </div>

      {/* Context-specific upload */}
      {correctionType === 'rebalancing' && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Upload Corrected Rebalancing Data</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Upload a CSV/Excel file with the correct constituents, weights, and shares. This rebalancing will be applied to all selected indices.</p>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
                <Button variant="outline" size="sm" asChild><span><Upload className="h-4 w-4 mr-2" />Choose File</span></Button>
              </label>
              {uploadedFile && <span className="text-sm text-muted-foreground">{uploadedFile}</span>}
            </div>
          </CardContent>
        </Card>
      )}

      {correctionType === 'price' && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Upload Corrected Prices</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Upload a CSV file with instrument identifiers and corrected prices per date.</p>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
                <Button variant="outline" size="sm" asChild><span><Upload className="h-4 w-4 mr-2" />Choose File</span></Button>
              </label>
              {uploadedFile && <span className="text-sm text-muted-foreground">{uploadedFile}</span>}
            </div>
          </CardContent>
        </Card>
      )}

      {correctionType === 'corporate_event' && (
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
              {uploadedFile && <span className="text-sm text-muted-foreground">{uploadedFile}</span>}
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
        {/* KPI Cards */}
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
              <div className="text-xl font-bold capitalize">{correctionType?.replace('_', ' ')}</div>
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

        {/* Level Chart */}
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

        {/* Divisor Chart */}
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

        {/* Download */}
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

      {selectedIndices.length === 1 ? (
        renderPreviewForIndex(selectedIndices[0])
      ) : (
        <Tabs value={activePreviewTab} onValueChange={setActivePreviewTab}>
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
          {selectedIndices.map(id => (
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
      {!isExecuted ? (
        <>
          <h3 className="text-lg font-semibold">Confirm & Execute Rollback</h3>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This action will overwrite production index data for <strong>{selectedIndicesData.map(i => i.ticker).join(', ')}</strong> between <strong>{startDate}</strong> and <strong>{endDate}</strong>. This cannot be undone automatically.
            </AlertDescription>
          </Alert>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <span className="text-muted-foreground">Indices:</span>
                <span className="font-medium">{selectedIndicesData.map(i => i.ticker).join(', ')}</span>
                <span className="text-muted-foreground">Correction Type:</span>
                <span className="font-medium capitalize">{correctionType?.replace('_', ' ')}</span>
                <span className="text-muted-foreground">Period:</span>
                <span className="font-medium">{startDate} → {endDate}</span>
                <span className="text-muted-foreground">Uploaded File:</span>
                <span className="font-medium">{uploadedFile || 'None'}</span>
                {description && (
                  <>
                    <span className="text-muted-foreground">Reason:</span>
                    <span className="font-medium">{description}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="destructive" onClick={handleExecute} disabled={isExecuting} className="min-w-[200px]">
              {isExecuting ? (
                <><RotateCcw className="h-4 w-4 mr-2 animate-spin" />Executing Rollback...</>
              ) : (
                <><RotateCcw className="h-4 w-4 mr-2" />Execute Rollback ({selectedIndices.length} {selectedIndices.length === 1 ? 'index' : 'indices'})</>
              )}
            </Button>
            <Button variant="outline" onClick={handleBack} disabled={isExecuting}>Go Back</Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Rollback Executed Successfully</h3>
          <p className="text-muted-foreground mb-6">
            {selectedIndices.length === 1 ? (
              <>Index <strong>{selectedIndicesData[0]?.ticker}</strong> has been corrected for the period {startDate} — {endDate}.</>
            ) : (
              <><strong>{selectedIndices.length}</strong> indices ({selectedIndicesData.map(i => i.ticker).join(', ')}) have been corrected for the period {startDate} — {endDate}.</>
            )}
          </p>
          <Button variant="outline" onClick={() => { setCurrentStep(0); setCorrectionType(null); setSelectedIndices([]); setUploadedFile(null); setIsExecuted(false); setDescription(''); }}>
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

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <div
              className={cn('flex items-center gap-2 cursor-pointer', i <= currentStep ? 'text-foreground' : 'text-muted-foreground')}
              onClick={() => { if (i < currentStep) setCurrentStep(i); }}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors',
                i < currentStep ? 'bg-primary text-primary-foreground border-primary' :
                i === currentStep ? 'border-primary text-primary' :
                'border-muted-foreground/30 text-muted-foreground'
              )}>
                {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">{step.label}</div>
                <div className="text-xs text-muted-foreground">{step.description}</div>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('flex-1 h-0.5 mx-3', i < currentStep ? 'bg-primary' : 'bg-border')} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 0 && renderContextStep()}
        {currentStep === 1 && renderPreparationStep()}
        {currentStep === 2 && renderPreviewStep()}
        {currentStep === 3 && renderExecuteStep()}
      </div>

      {/* Navigation */}
      {!(currentStep === 3 && isExecuted) && (
        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />Back
          </Button>
          {currentStep < 3 && (
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
