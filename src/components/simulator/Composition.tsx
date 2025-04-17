
import React from 'react';
import { Trash2 } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ManualComposition from './ManualComposition';
import IndexComposition from './IndexComposition';

interface Stock {
  ric: string;
  shares: string;
  weight: string;
}

interface CompositionProps {
  inputMethod: string;
  setInputMethod: (method: string) => void;
  stocks: Stock[];
  shareOrWeight: string;
  setShareOrWeight: (value: string) => void;
  updateStock: (index: number, field: 'ric' | 'shares' | 'weight', value: string) => void;
  removeStock: (index: number) => void;
  addRow: () => void;
  selectedIndex: string;
  setSelectedIndex: (index: string) => void;
  indexDate: string;
  setIndexDate: (date: string) => void;
  priceType: string;
  setPriceType: (type: string) => void;
  fetchIndexData: () => void;
  mockIndices: Array<{
    id: string;
    name: string;
    currency: string;
    returnType: string;
    divisor: string;
    constituents: Stock[];
  }>;
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
  mockIndices
}: CompositionProps) => {
  return (
    <div className="bg-white rounded-md shadow-sm p-6 mt-6">
      <h2 className="text-lg font-medium mb-4">Composition</h2>
      
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
          />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Composition;
