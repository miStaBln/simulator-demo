import React, { useState } from 'react';
import { Trash2, ChevronDown } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ManualComposition from './ManualComposition';
import IndexComposition from './IndexComposition';
import CashManagement from './CashManagement';

interface Stock {
  ric: string;
  shares: string;
  weight: string;
  baseValue?: string;
}

interface CompositionProps {
  inputMethod: string;
  setInputMethod: (method: string) => void;
  stocks: Stock[];
  shareOrWeight: string;
  setShareOrWeight: (value: string) => void;
  updateStock: (index: number, field: 'ric' | 'shares' | 'weight' | 'baseValue', value: string) => void;
  removeStock: (index: number) => void;
  addRow: () => void;
  selectedIndex: string;
  setSelectedIndex: (index: string) => void;
  indexDate: string;
  setIndexDate: (date: string) => void;
  priceType: string;
  setPriceType: (type: string) => void;
  fetchIndexData: () => void;
  indexFamily: string;
  mockIndices: Array<{
    id: string;
    name: string;
    currency: string;
    returnType: string;
    divisor: string;
    constituents: Stock[];
  }>;
  cashes: Array<{value: string, type: string}>;
  addCash: () => void;
  updateCash: (index: number, field: 'value' | 'type', value: string) => void;
  removeCash: (index: number) => void;
}

const Composition = ({
  inputMethod,
  setInputMethod,
  stocks,
  shareOrWeight,
  setShareOrWeight,
  updateStock,
  removeStock,
  addRow,
  selectedIndex,
  setSelectedIndex,
  indexDate,
  setIndexDate,
  priceType,
  setPriceType,
  fetchIndexData,
  indexFamily,
  mockIndices,
  cashes,
  addCash,
  updateCash,
  removeCash
}: CompositionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const isBondIndex = indexFamily === 'BOND_DEFAULT' || indexFamily === 'BOND_BASEMARKETVALUE';

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-gray-100 rounded-md shadow-sm p-6 mt-6 border border-gray-200">
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <h2 className="text-lg font-medium">Composition</h2>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4">
          <Tabs defaultValue={inputMethod} onValueChange={setInputMethod}>
            <TabsList className="mb-4">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="index">From Existing Index</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <ManualComposition
                stocks={stocks}
                shareOrWeight={shareOrWeight}
                setShareOrWeight={setShareOrWeight}
                updateStock={updateStock}
                removeStock={removeStock}
                addRow={addRow}
                indexFamily={indexFamily}
              />
              
              {isBondIndex && (
                <div className="mt-6">
                  <CashManagement
                    cashes={cashes}
                    addCash={addCash}
                    updateCash={updateCash}
                    removeCash={removeCash}
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="index">
              <IndexComposition
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                indexDate={indexDate}
                setIndexDate={setIndexDate}
                priceType={priceType}
                setPriceType={setPriceType}
                shareOrWeight={shareOrWeight}
                stocks={stocks}
                fetchIndexData={fetchIndexData}
                mockIndices={mockIndices}
              />
              
              {isBondIndex && (
                <div className="mt-6">
                  <CashManagement
                    cashes={cashes}
                    addCash={addCash}
                    updateCash={updateCash}
                    removeCash={removeCash}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default Composition;
