import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Download, ArrowUpDown, AlertTriangle, FileText, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InstrumentDeviation {
  ric: string;
  name: string;
  currency: string;
  actualWeight: number;
  correctedWeight: number;
  weightDeviation: number;
  actualPrice: number;
  correctedPrice: number;
  priceDeviation: number;
  maxDayDeviation: string;
  impactOnIndex: number;
}

interface DailyDeviation {
  date: string;
  levelDeviation: number;
  levelDeviationPct: number;
  divisorDeviation: number;
  affectedInstruments: number;
}

interface CorrectionReportProps {
  indexName: string;
  indexTicker: string;
  indexId: string;
  correctionType: string;
  startDate: string;
  endDate: string;
  description: string;
  previewData: Array<{
    date: string;
    actualLevel: number;
    correctedLevel: number;
    actualDivisor: number;
    correctedDivisor: number;
    deviation: number;
  }>;
}

const generateInstrumentDeviations = (seed: number): InstrumentDeviation[] => {
  const instruments = [
    { ric: 'AAPL.O', name: 'Apple Inc', currency: 'USD' },
    { ric: 'MSFT.O', name: 'Microsoft Corp', currency: 'USD' },
    { ric: 'GOOGL.O', name: 'Alphabet Inc', currency: 'USD' },
    { ric: 'AMZN.O', name: 'Amazon.com Inc', currency: 'USD' },
    { ric: 'NVDA.O', name: 'NVIDIA Corp', currency: 'USD' },
    { ric: 'SAP.DE', name: 'SAP SE', currency: 'EUR' },
    { ric: 'ASML.AS', name: 'ASML Holding', currency: 'EUR' },
    { ric: 'TSM.N', name: 'Taiwan Semiconductor', currency: 'USD' },
    { ric: 'SHOP.TO', name: 'Shopify Inc', currency: 'CAD' },
    { ric: 'BABA.N', name: 'Alibaba Group', currency: 'USD' },
  ];

  let s = seed * 9301 + 49297;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };

  return instruments.map(inst => {
    const actualWeight = 5 + rand() * 15;
    const weightDev = (rand() - 0.3) * 2.5;
    const correctedWeight = actualWeight + weightDev;
    const actualPrice = 50 + rand() * 400;
    const priceDev = (rand() - 0.4) * 10;
    const correctedPrice = actualPrice + priceDev;
    const days = ['01.02.2026', '05.02.2026', '08.02.2026', '12.02.2026', '15.02.2026', '18.02.2026'];

    return {
      ric: inst.ric,
      name: inst.name,
      currency: inst.currency,
      actualWeight: parseFloat(actualWeight.toFixed(4)),
      correctedWeight: parseFloat(correctedWeight.toFixed(4)),
      weightDeviation: parseFloat(weightDev.toFixed(4)),
      actualPrice: parseFloat(actualPrice.toFixed(2)),
      correctedPrice: parseFloat(correctedPrice.toFixed(2)),
      priceDeviation: parseFloat(priceDev.toFixed(2)),
      maxDayDeviation: days[Math.floor(rand() * days.length)],
      impactOnIndex: parseFloat((weightDev * priceDev / 1000).toFixed(4)),
    };
  });
};

const generateDailyDeviations = (previewData: CorrectionReportProps['previewData']): DailyDeviation[] => {
  let s = 42;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };

  return previewData.map(d => ({
    date: d.date,
    levelDeviation: parseFloat((d.correctedLevel - d.actualLevel).toFixed(4)),
    levelDeviationPct: parseFloat(((d.correctedLevel - d.actualLevel) / d.actualLevel * 100).toFixed(4)),
    divisorDeviation: parseFloat((d.correctedDivisor - d.actualDivisor).toFixed(2)),
    affectedInstruments: Math.floor(rand() * 5) + 1,
  }));
};

type SortField = 'ric' | 'weightDeviation' | 'priceDeviation' | 'impactOnIndex';
type SortDir = 'asc' | 'desc';

const CorrectionReport: React.FC<CorrectionReportProps> = ({
  indexName, indexTicker, indexId, correctionType, startDate, endDate, description, previewData
}) => {
  const [sortField, setSortField] = useState<SortField>('weightDeviation');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [reason, setReason] = useState(description);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const instruments = useMemo(() => generateInstrumentDeviations(indexId.length), [indexId]);
  const dailyDeviations = useMemo(() => generateDailyDeviations(previewData), [previewData]);

  const sortedInstruments = useMemo(() => {
    return [...instruments].sort((a, b) => {
      const aVal = Math.abs(a[sortField] as number);
      const bVal = Math.abs(b[sortField] as number);
      if (sortField === 'ric') {
        return sortDir === 'asc' ? a.ric.localeCompare(b.ric) : b.ric.localeCompare(a.ric);
      }
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [instruments, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortDir === 'desc' ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />;
  };

  const maxDevDay = dailyDeviations.reduce((max, d) =>
    Math.abs(d.levelDeviationPct) > Math.abs(max.levelDeviationPct) ? d : max, dailyDeviations[0]);

  const totalImpact = instruments.reduce((sum, i) => sum + Math.abs(i.impactOnIndex), 0);
  const affectedCount = instruments.filter(i => Math.abs(i.weightDeviation) > 0.5).length;

  // Chart domains
  const levelDomain: [number, number] = [
    Math.min(...previewData.map(d => Math.min(d.actualLevel, d.correctedLevel))) * 0.998,
    Math.max(...previewData.map(d => Math.max(d.actualLevel, d.correctedLevel))) * 1.002,
  ];
  const divisorDomain: [number, number] = [
    Math.min(...previewData.map(d => Math.min(d.actualDivisor, d.correctedDivisor))) * 0.999,
    Math.max(...previewData.map(d => Math.max(d.actualDivisor, d.correctedDivisor))) * 1.001,
  ];

  const handleDownloadPdf = useCallback(async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);

    try {
      // Wait for any animations/renders to settle
      await new Promise(r => setTimeout(r, 300));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: reportRef.current.scrollWidth,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;
      const imgAspect = canvas.height / canvas.width;
      const imgHeight = contentWidth * imgAspect;

      // Multi-page support
      let yOffset = 0;
      const pageContentHeight = pdfHeight - margin * 2;

      while (yOffset < imgHeight) {
        if (yOffset > 0) pdf.addPage();

        // Calculate source crop
        const srcY = (yOffset / imgHeight) * canvas.height;
        const srcH = Math.min((pageContentHeight / imgHeight) * canvas.height, canvas.height - srcY);
        const destH = (srcH / canvas.height) * imgHeight;

        // Create cropped canvas for this page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = srcH;
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
          const pageImgData = pageCanvas.toDataURL('image/png');
          pdf.addImage(pageImgData, 'PNG', margin, margin, contentWidth, destH);
        }

        yOffset += pageContentHeight;
      }

      pdf.save(`correction-report-${indexTicker}-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [indexTicker]);

  return (
    <div className="space-y-6">
      {/* Download button at top */}
      <div className="flex gap-3">
        <Button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="bg-primary">
          {isGeneratingPdf ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Report'}
        </Button>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Download Corrected Time Series</Button>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Download Constituents Diff</Button>
      </div>

      {/* === Printable report area === */}
      <div ref={reportRef} className="space-y-6 bg-background p-2">
        {/* Report header */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Correction Report</h2>
              <p className="text-sm text-muted-foreground">{indexName} ({indexTicker})</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p>Index ID: {indexId}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
            <div>
              <span className="text-muted-foreground">Correction Type: </span>
              <span className="font-medium capitalize">{correctionType.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Period: </span>
              <span className="font-medium">{startDate} → {endDate}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Max Deviation Day: </span>
              <span className="font-medium text-destructive">{maxDevDay.date}</span>
            </div>
          </div>
        </div>

        {/* Editable reason */}
        <Card className="bg-muted/30">
          <CardContent className="py-3">
            <div className="text-xs text-muted-foreground mb-1 font-medium">Reason for Correction</div>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for this correction — this will be included in the PDF report..."
              className="min-h-[60px] text-sm bg-background"
            />
          </CardContent>
        </Card>

        {/* Max deviation day highlight */}
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription>
            <strong>Max deviation day: {maxDevDay.date}</strong> — Level deviation of{' '}
            <span className="font-mono font-bold text-destructive">{maxDevDay.levelDeviationPct.toFixed(4)}%</span>{' '}
            ({maxDevDay.levelDeviation.toFixed(4)} pts), with {maxDevDay.affectedInstruments} instrument(s) affected.
          </AlertDescription>
        </Alert>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="text-xs text-muted-foreground">Instruments Affected</div>
              <div className="text-xl font-bold">{affectedCount} <span className="text-sm font-normal text-muted-foreground">/ {instruments.length}</span></div>
              <div className="text-xs text-muted-foreground">with &gt;0.5% weight deviation</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="text-xs text-muted-foreground">Total Index Impact</div>
              <div className="text-xl font-bold">{totalImpact.toFixed(4)} <span className="text-sm font-normal text-muted-foreground">pts</span></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="text-xs text-muted-foreground">Days With Deviation</div>
              <div className="text-xl font-bold">{dailyDeviations.filter(d => Math.abs(d.levelDeviationPct) > 0.001).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="text-xs text-muted-foreground">Largest Weight Shift</div>
              <div className="text-xl font-bold">
                {Math.max(...instruments.map(i => Math.abs(i.weightDeviation))).toFixed(4)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Index Level Chart */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Index Level — Actual vs Corrected</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={previewData} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={70} />
                <YAxis domain={levelDomain} tickFormatter={(v) => v.toFixed(1)} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number, name: string) => {
                  const label = name === 'actualLevel' ? 'Actual Level' : 'Corrected Level';
                  return [value.toFixed(4), label];
                }} />
                <Legend formatter={(v) => v === 'actualLevel' ? 'Actual' : 'Corrected'} />
                <Line type="monotone" dataKey="actualLevel" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="correctedLevel" stroke="#dc2626" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Divisor Chart */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Divisor — Actual vs Corrected</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={previewData} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={70} />
                <YAxis domain={divisorDomain} tickFormatter={(v) => v.toLocaleString()} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number, name: string) => {
                  const label = name === 'actualDivisor' ? 'Actual Divisor' : 'Corrected Divisor';
                  return [value.toLocaleString(), label];
                }} />
                <Legend formatter={(v) => v === 'actualDivisor' ? 'Actual' : 'Corrected'} />
                <Line type="monotone" dataKey="actualDivisor" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="correctedDivisor" stroke="#dc2626" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Instrument deviation table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Instrument Deviations from Parent Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => toggleSort('ric')}>
                      <span className="inline-flex items-center">RIC <SortIcon field="ric" /></span>
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Name</TableHead>
                    <TableHead className="whitespace-nowrap">Ccy</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Actual Wt%</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Corrected Wt%</TableHead>
                    <TableHead className="cursor-pointer whitespace-nowrap text-right" onClick={() => toggleSort('weightDeviation')}>
                      <span className="inline-flex items-center justify-end">Wt Deviation <SortIcon field="weightDeviation" /></span>
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-right">Actual Price</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Corrected Price</TableHead>
                    <TableHead className="cursor-pointer whitespace-nowrap text-right" onClick={() => toggleSort('priceDeviation')}>
                      <span className="inline-flex items-center justify-end">Price Dev <SortIcon field="priceDeviation" /></span>
                    </TableHead>
                    <TableHead className="cursor-pointer whitespace-nowrap text-right" onClick={() => toggleSort('impactOnIndex')}>
                      <span className="inline-flex items-center justify-end">Index Impact <SortIcon field="impactOnIndex" /></span>
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Max Dev Day</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedInstruments.map(inst => (
                    <TableRow key={inst.ric}>
                      <TableCell className="font-mono font-medium">{inst.ric}</TableCell>
                      <TableCell className="whitespace-nowrap">{inst.name}</TableCell>
                      <TableCell>{inst.currency}</TableCell>
                      <TableCell className="text-right font-mono">{inst.actualWeight.toFixed(2)}%</TableCell>
                      <TableCell className="text-right font-mono">{inst.correctedWeight.toFixed(2)}%</TableCell>
                      <TableCell className={`text-right font-mono font-medium ${Math.abs(inst.weightDeviation) > 1 ? 'text-destructive' : ''}`}>
                        {inst.weightDeviation > 0 ? '+' : ''}{inst.weightDeviation.toFixed(4)}%
                      </TableCell>
                      <TableCell className="text-right font-mono">{inst.actualPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono">{inst.correctedPrice.toFixed(2)}</TableCell>
                      <TableCell className={`text-right font-mono ${Math.abs(inst.priceDeviation) > 5 ? 'text-destructive' : ''}`}>
                        {inst.priceDeviation > 0 ? '+' : ''}{inst.priceDeviation.toFixed(2)}
                      </TableCell>
                      <TableCell className={`text-right font-mono ${Math.abs(inst.impactOnIndex) > 0.5 ? 'text-destructive font-medium' : ''}`}>
                        {inst.impactOnIndex > 0 ? '+' : ''}{inst.impactOnIndex.toFixed(4)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-mono">{inst.maxDayDeviation}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Daily deviation breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Daily Deviation Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Level Deviation</TableHead>
                    <TableHead className="text-right">Level Dev %</TableHead>
                    <TableHead className="text-right">Divisor Deviation</TableHead>
                    <TableHead className="text-right"># Affected</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyDeviations.map(d => (
                    <TableRow key={d.date} className={d.date === maxDevDay.date ? 'bg-destructive/5' : ''}>
                      <TableCell className="font-mono">
                        {d.date}
                        {d.date === maxDevDay.date && <Badge variant="destructive" className="ml-2 text-xs">MAX</Badge>}
                      </TableCell>
                      <TableCell className="text-right font-mono">{d.levelDeviation.toFixed(4)}</TableCell>
                      <TableCell className={`text-right font-mono ${Math.abs(d.levelDeviationPct) > 0.01 ? 'text-destructive font-medium' : ''}`}>
                        {d.levelDeviationPct.toFixed(4)}%
                      </TableCell>
                      <TableCell className="text-right font-mono">{d.divisorDeviation.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{d.affectedInstruments}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CorrectionReport;
