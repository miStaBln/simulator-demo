import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, ArrowUpDown, AlertTriangle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

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

// Generate mock instrument-level deviations
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

  const handleDownloadReport = () => {
    const reportLines = [
      `CORRECTION REPORT — ${indexName} (${indexTicker})`,
      `${'='.repeat(60)}`,
      `Index ID: ${indexId}`,
      `Correction Type: ${correctionType.replace('_', ' ')}`,
      `Period: ${startDate} — ${endDate}`,
      `Description: ${description || 'N/A'}`,
      `Generated: ${new Date().toISOString()}`,
      '',
      'SUMMARY',
      `${'─'.repeat(40)}`,
      `Max deviation day: ${maxDevDay.date} (${maxDevDay.levelDeviationPct.toFixed(4)}%)`,
      `Total index impact: ${totalImpact.toFixed(4)} pts`,
      `Instruments with >0.5% weight deviation: ${affectedCount} of ${instruments.length}`,
      '',
      'INSTRUMENT DEVIATIONS (sorted by |weight deviation|)',
      `${'─'.repeat(40)}`,
      ['RIC', 'Name', 'Ccy', 'Actual Wt%', 'Corrected Wt%', 'Wt Dev', 'Price Dev', 'Impact'].join('\t'),
      ...sortedInstruments.map(i =>
        [i.ric, i.name, i.currency, i.actualWeight, i.correctedWeight, i.weightDeviation, i.priceDeviation, i.impactOnIndex].join('\t')
      ),
      '',
      'DAILY DEVIATIONS',
      `${'─'.repeat(40)}`,
      ['Date', 'Level Dev', 'Level Dev %', 'Divisor Dev', '# Affected'].join('\t'),
      ...dailyDeviations.map(d =>
        [d.date, d.levelDeviation, d.levelDeviationPct + '%', d.divisorDeviation, d.affectedInstruments].join('\t')
      ),
    ];

    const blob = new Blob([reportLines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `correction-report-${indexTicker}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
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

      {/* Download report button */}
      <div className="flex gap-3">
        <Button onClick={handleDownloadReport} className="bg-primary">
          <FileText className="h-4 w-4 mr-2" />
          Download Correction Report
        </Button>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Download Corrected Time Series</Button>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Download Constituents Diff</Button>
      </div>
    </div>
  );
};

export default CorrectionReport;
