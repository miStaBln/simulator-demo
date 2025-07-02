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
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SimulationParametersProps {
  currency: string;
  setCurrency: (currency: string) => void;
  returnType: string;
  setReturnType: (returnType: string) => void;
  divisor: string;
  setDivisor: (divisor: string) => void;
  initialLevel: string;
  setInitialLevel: (initialLevel: string) => void;
  // Advanced parameters props
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
}

const SimulationParameters = ({ 
  currency, 
  setCurrency, 
  returnType, 
  setReturnType, 
  divisor, 
  setDivisor,
  initialLevel,
  setInitialLevel,
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
}: SimulationParametersProps) => {
  return (
    <div className="bg-white rounded-md shadow-sm p-6">
      <h2 className="text-lg font-medium mb-4">Parameters</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900 mb-1">Currency</label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-full h-9">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900 mb-1">Return Type</label>
        <Select value={returnType} onValueChange={setReturnType}>
          <SelectTrigger className="w-full h-9">
            <SelectValue placeholder="Select Return Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NTR">NTR</SelectItem>
            <SelectItem value="GTR">GTR</SelectItem>
            <SelectItem value="PR">PR</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900 mb-1">Divisor</label>
        <Input 
          type="text" 
          value={divisor} 
          onChange={(e) => setDivisor(e.target.value)}
          className="w-full h-9"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-1">Initial Level</label>
        <Input 
          type="number" 
          step="0.01"
          value={initialLevel} 
          onChange={(e) => setInitialLevel(e.target.value)}
          placeholder="Enter initial level"
          className="w-full h-9"
        />
      </div>

      {/* Advanced Parameters Collapsible Section */}
      <div className="border-t pt-4">
        <button
          onClick={() => setShowAdvancedParameters(!showAdvancedParameters)}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <h3 className="text-md font-medium text-gray-900">Advanced Parameters</h3>
          {showAdvancedParameters ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {showAdvancedParameters && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Late Dividend Handling
                </label>
                <Select value={lateDividendHandling} onValueChange={setLateDividendHandling}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Select handling" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">NONE</SelectItem>
                    <SelectItem value="Weekly Friday">Weekly Friday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Cash Dividend Tax Handling
                </label>
                <Select value={cashDividendTaxHandling} onValueChange={setCashDividendTaxHandling}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Select handling" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="USE_WITH_TAX">USE_WITH_TAX</SelectItem>
                    <SelectItem value="USE_WITHOUT_TAX">USE_WITHOUT_TAX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Special Dividend Tax Handling
                </label>
                <Select value={specialDividendTaxHandling} onValueChange={setSpecialDividendTaxHandling}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Select handling" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="USE_WITH_TAX">USE_WITH_TAX</SelectItem>
                    <SelectItem value="USE_WITHOUT_TAX">USE_WITHOUT_TAX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  DR Dividend Treatment
                </label>
                <Select value={drDividendTreatment} onValueChange={setDrDividendTreatment}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Select treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEFAULT">DEFAULT</SelectItem>
                    <SelectItem value="TREATY_RATES">TREATY_RATES</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Global DR Tax Rate (%)
              </label>
              <Input 
                type="number" 
                value={globalDrTaxRate} 
                onChange={(e) => setGlobalDrTaxRate(e.target.value)}
                placeholder="Enter tax rate percentage"
                className="w-full h-9"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="considerStockDividend"
                  checked={considerStockDividend}
                  onCheckedChange={setConsiderStockDividend}
                />
                <label htmlFor="considerStockDividend" className="text-sm font-medium text-gray-900">
                  Consider Stock Dividend
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="considerStockSplit"
                  checked={considerStockSplit}
                  onCheckedChange={setConsiderStockSplit}
                />
                <label htmlFor="considerStockSplit" className="text-sm font-medium text-gray-900">
                  Consider Stock Split
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="considerRightsIssue"
                  checked={considerRightsIssue}
                  onCheckedChange={setConsiderRightsIssue}
                />
                <label htmlFor="considerRightsIssue" className="text-sm font-medium text-gray-900">
                  Consider Rights Issue
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="considerDividendFee"
                  checked={considerDividendFee}
                  onCheckedChange={setConsiderDividendFee}
                />
                <label htmlFor="considerDividendFee" className="text-sm font-medium text-gray-900">
                  Consider Dividend Fee
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationParameters;
