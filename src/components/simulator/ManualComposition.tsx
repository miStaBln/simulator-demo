
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StockRow from './StockRow';

interface Stock {
  ric: string;
  shares: string;
  weight: string;
  baseValue?: string;
}

interface ManualCompositionProps {
  stocks: Stock[];
  shareOrWeight: string;
  setShareOrWeight: (value: string) => void;
  updateStock: (index: number, field: 'ric' | 'shares' | 'weight' | 'baseValue', value: string) => void;
  removeStock: (index: number) => void;
  addRow: () => void;
  indexFamily: string;
}

const ManualComposition = ({
  stocks,
  shareOrWeight,
  setShareOrWeight,
  updateStock,
  removeStock,
  addRow,
  indexFamily
}: ManualCompositionProps) => {
  const isBondIndex = indexFamily === 'BOND_DEFAULT' || indexFamily === 'BOND_BASEMARKETVALUE';

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900 mb-1">Entry Type</label>
        <Select value={shareOrWeight} onValueChange={setShareOrWeight}>
          <SelectTrigger className="w-full h-9">
            <SelectValue placeholder="Select entry type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shares">Shares</SelectItem>
            <SelectItem value="weight">Weight</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <div className={`grid ${isBondIndex ? 'grid-cols-5' : 'grid-cols-4'} gap-2 p-3 bg-gray-50 border-b font-medium text-sm`}>
          <div>Identifier</div>
          <div>{shareOrWeight === 'shares' ? 'Shares' : 'Weight (%)'}</div>
          {isBondIndex && <div>Base Value</div>}
          <div>Actions</div>
        </div>
        
        {stocks.map((stock, index) => (
          <StockRow
            key={index}
            stock={stock}
            index={index}
            shareOrWeight={shareOrWeight}
            updateStock={updateStock}
            removeStock={removeStock}
            showBaseValue={isBondIndex}
          />
        ))}
      </div>

      <div className="mt-4">
        <Button onClick={addRow} variant="outline" size="sm">
          Add Row
        </Button>
      </div>
    </div>
  );
};

export default ManualComposition;
