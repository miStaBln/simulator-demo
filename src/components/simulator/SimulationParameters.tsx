import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Library, Settings2, Calculator, Link2, Sliders, RefreshCw } from 'lucide-react';

interface MockIndex {
  id: string;
  name: string;
  currency: string;
  returnType: string;
  divisor: string;
  constituents: any[];
}

interface SimulationParametersProps {
  currency: string;
  setCurrency: (currency: string) => void;
  returnType: string;
  setReturnType: (returnType: string) => void;
  divisor: string;
  setDivisor: (divisor: string) => void;
  initialLevel: string;
  setInitialLevel: (initialLevel: string) => void;
  indexFamily: string;
  setIndexFamily: (family: string) => void;
  identifierType: string;
  setIdentifierType: (type: string) => void;
  referenceIndexId: string;
  setReferenceIndexId: (id: string) => void;
  previousRebalancingIndexValue: string;
  setPreviousRebalancingIndexValue: (value: string) => void;
  showAdvancedParameters: boolean;
  setShowAdvancedParameters: (show: boolean) => void;
  lateDividendHandling: string;
  setLateDividendHandling: (value: string) => void;
  cashDividendTaxHandling: string;
  setCashDividendTaxHandling: (value: string) => void;
  specialDividendTaxHandling: string;
  setSpecialDividendTaxHandling: (value: string) => void;
  considerStockDividend: boolean;
  setConsiderStockDividend: (value: boolean) => void;
  considerStockSplit: boolean;
  setConsiderStockSplit: (value: boolean) => void;
  considerRightsIssue: boolean;
  setConsiderRightsIssue: (value: boolean) => void;
  considerDividendFee: boolean;
  setConsiderDividendFee: (value: boolean) => void;
  drDividendTreatment: string;
  setDrDividendTreatment: (value: string) => void;
  globalDrTaxRate: string;
  setGlobalDrTaxRate: (value: string) => void;
  // New: parent index selection
  selectedIndex: string;
  setSelectedIndex: (id: string) => void;
  mockIndices: MockIndex[];
  fetchIndexData: () => void;
}

const Section = ({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-lg border border-border bg-card p-4">
    <header className="mb-3 flex items-start gap-2">
      <Icon className="h-4 w-4 mt-0.5 text-primary" />
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </header>
    <div className="space-y-3">{children}</div>
  </section>
);

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-xs font-medium text-foreground mb-1">{label}</label>
    {children}
    {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
  </div>
);

const SimulationParameters = ({
  currency,
  setCurrency,
  returnType,
  setReturnType,
  divisor,
  setDivisor,
  initialLevel,
  setInitialLevel,
  indexFamily,
  setIndexFamily,
  identifierType,
  setIdentifierType,
  referenceIndexId,
  setReferenceIndexId,
  previousRebalancingIndexValue,
  setPreviousRebalancingIndexValue,
  showAdvancedParameters,
  setShowAdvancedParameters,
  lateDividendHandling,
  setLateDividendHandling,
  cashDividendTaxHandling,
  setCashDividendTaxHandling,
  specialDividendTaxHandling,
  setSpecialDividendTaxHandling,
  considerStockDividend,
  setConsiderStockDividend,
  considerStockSplit,
  setConsiderStockSplit,
  considerRightsIssue,
  setConsiderRightsIssue,
  considerDividendFee,
  setConsiderDividendFee,
  drDividendTreatment,
  setDrDividendTreatment,
  globalDrTaxRate,
  setGlobalDrTaxRate,
  selectedIndex,
  setSelectedIndex,
  mockIndices,
  fetchIndexData,
}: SimulationParametersProps) => {
  const isBondIndex = indexFamily === 'BOND_DEFAULT' || indexFamily === 'BOND_BASEMARKETVALUE';

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Parameters</h2>

      {/* Parent Index */}
      <Section
        icon={Library}
        title="Parent Index"
        description="Optionally start from an existing index. Composition is loaded for the simulation start date."
      >
        <Field label="Select Parent Index">
          <Select value={selectedIndex} onValueChange={setSelectedIndex}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="None — define manually" />
            </SelectTrigger>
            <SelectContent>
              {mockIndices.map((idx) => (
                <SelectItem key={idx.id} value={idx.id}>
                  {idx.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Button
          onClick={fetchIndexData}
          disabled={!selectedIndex}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Load composition & parameters
        </Button>
      </Section>

      {/* Identity */}
      <Section icon={Settings2} title="Index Identity" description="Core classification of the index.">
        <Field label="Index Family">
          <Select value={indexFamily} onValueChange={setIndexFamily}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Select Index Family" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DEFAULT_LASPEYRE">DEFAULT_LASPEYRE</SelectItem>
              <SelectItem value="DEFAULT_DEFAULT">DEFAULT_DEFAULT</SelectItem>
              <SelectItem value="BOND_DEFAULT">BOND_DEFAULT</SelectItem>
              <SelectItem value="BOND_BASEMARKETVALUE">BOND_BASEMARKETVALUE</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Currency">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="NZD">NZD</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Return Type">
            <Select value={returnType} onValueChange={setReturnType}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Return Type" />
              </SelectTrigger>
              <SelectContent>
                {isBondIndex ? (
                  <>
                    <SelectItem value="PERFORMANCE">PERFORMANCE</SelectItem>
                    <SelectItem value="RATE">RATE</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="NTR">NTR</SelectItem>
                    <SelectItem value="GTR">GTR</SelectItem>
                    <SelectItem value="PR">PR</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Identifier Type">
          <Select value={identifierType} onValueChange={setIdentifierType}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Select Identifier Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RIC">RIC</SelectItem>
              <SelectItem value="GIGANT_ID">GIGANT_ID</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </Section>

      {/* Calculation */}
      <Section icon={Calculator} title="Calculation" description="Starting values used by the index engine.">
        {!isBondIndex && (
          <Field label="Divisor">
            <Input
              type="text"
              value={divisor}
              onChange={(e) => setDivisor(e.target.value)}
              className="w-full h-9"
            />
          </Field>
        )}

        <Field label="Previous Index Level">
          <Input
            type="number"
            step="0.01"
            value={initialLevel}
            onChange={(e) => setInitialLevel(e.target.value)}
            placeholder="e.g. 100.00"
            className="w-full h-9"
          />
        </Field>

        {isBondIndex && (
          <Field label="Previous Rebalancing Index Value">
            <Input
              type="number"
              step="0.01"
              value={previousRebalancingIndexValue}
              onChange={(e) => setPreviousRebalancingIndexValue(e.target.value)}
              placeholder="Enter value"
              className="w-full h-9"
            />
          </Field>
        )}
      </Section>

      {/* Reference */}
      <Section icon={Link2} title="Reference" description="Optional benchmark to compare against.">
        <Field label="Reference Index ID">
          <Input
            type="text"
            value={referenceIndexId}
            onChange={(e) => setReferenceIndexId(e.target.value)}
            placeholder="e.g. SPX"
            className="w-full h-9"
          />
        </Field>
      </Section>

      {/* Advanced */}
      {!isBondIndex && (
        <section className="rounded-lg border border-border bg-card">
          <button
            onClick={() => setShowAdvancedParameters(!showAdvancedParameters)}
            className="flex items-center justify-between w-full text-left p-4"
          >
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Advanced Parameters</h3>
            </div>
            {showAdvancedParameters ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {showAdvancedParameters && (
            <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
              <Field label="Late Dividend Handling">
                <Select value={lateDividendHandling} onValueChange={setLateDividendHandling}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Select handling" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">NONE</SelectItem>
                    <SelectItem value="Weekly Friday">Weekly Friday</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Cash Dividend Tax">
                  <Select value={cashDividendTaxHandling} onValueChange={setCashDividendTaxHandling}>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="USE_WITH_TAX">USE_WITH_TAX</SelectItem>
                      <SelectItem value="USE_WITHOUT_TAX">USE_WITHOUT_TAX</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Special Dividend Tax">
                  <Select value={specialDividendTaxHandling} onValueChange={setSpecialDividendTaxHandling}>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="USE_WITH_TAX">USE_WITH_TAX</SelectItem>
                      <SelectItem value="USE_WITHOUT_TAX">USE_WITHOUT_TAX</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="DR Dividend Treatment">
                  <Select value={drDividendTreatment} onValueChange={setDrDividendTreatment}>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEFAULT">DEFAULT</SelectItem>
                      <SelectItem value="TREATY_RATES">TREATY_RATES</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Global DR Tax Rate (%)">
                  <Input
                    type="number"
                    value={globalDrTaxRate}
                    onChange={(e) => setGlobalDrTaxRate(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full h-9"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className="flex items-center space-x-2 text-xs">
                  <Checkbox
                    checked={considerStockDividend}
                    onCheckedChange={setConsiderStockDividend}
                  />
                  <span>Stock Dividend</span>
                </label>
                <label className="flex items-center space-x-2 text-xs">
                  <Checkbox
                    checked={considerStockSplit}
                    onCheckedChange={setConsiderStockSplit}
                  />
                  <span>Stock Split</span>
                </label>
                <label className="flex items-center space-x-2 text-xs">
                  <Checkbox
                    checked={considerRightsIssue}
                    onCheckedChange={setConsiderRightsIssue}
                  />
                  <span>Rights Issue</span>
                </label>
                <label className="flex items-center space-x-2 text-xs">
                  <Checkbox
                    checked={considerDividendFee}
                    onCheckedChange={setConsiderDividendFee}
                  />
                  <span>Dividend Fee</span>
                </label>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default SimulationParameters;
