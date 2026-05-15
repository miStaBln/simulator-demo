
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ManualComposition from './ManualComposition';

interface Stock {
  ric: string;
  shares: string;
  weight: string;
  baseValue?: string;
  weightingCapFactor?: string;
  caCash?: string;
  couponCash?: string;
  sinkingCash?: string;
}

interface CompositionProps {
  stocks: Stock[];
  shareOrWeight: string;
  setShareOrWeight: (value: string) => void;
  updateStock: (index: number, field: 'ric' | 'shares' | 'weight' | 'baseValue' | 'weightingCapFactor' | 'caCash' | 'couponCash' | 'sinkingCash', value: string) => void;
  removeStock: (index: number) => void;
  addRow: () => void;
  indexFamily: string;
}

const Composition = ({
  stocks,
  shareOrWeight,
  setShareOrWeight,
  updateStock,
  removeStock,
  addRow,
  indexFamily,
}: CompositionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-gray-100 rounded-md shadow-sm p-6 mt-6 border border-gray-200">
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <h2 className="text-lg font-medium">Composition</h2>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4">
          <ManualComposition
            stocks={stocks}
            shareOrWeight={shareOrWeight}
            setShareOrWeight={setShareOrWeight}
            updateStock={updateStock}
            removeStock={removeStock}
            addRow={addRow}
            indexFamily={indexFamily}
          />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default Composition;

