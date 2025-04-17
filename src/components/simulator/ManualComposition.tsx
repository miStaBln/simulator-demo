
import React from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import StockRow from './StockRow';

interface Stock {
  ric: string;
  shares: string;
  weight: string;
}

interface ManualCompositionProps {
  stocks: Stock[];
  shareOrWeight: string;
  setShareOrWeight: (value: string) => void;
  updateStock: (index: number, field: 'ric' | 'shares' | 'weight', value: string) => void;
  removeStock: (index: number) => void;
  addRow: () => void;
}

const ManualComposition = ({ 
  stocks, 
  shareOrWeight, 
  setShareOrWeight, 
  updateStock, 
  removeStock, 
  addRow 
}: ManualCompositionProps) => {
  return (
    <div>
      <div className="mb-4">
        <RadioGroup 
          value={shareOrWeight} 
          onValueChange={setShareOrWeight} 
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="shares" id="r1" />
            <Label htmlFor="r1">Shares</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weight" id="r2" />
            <Label htmlFor="r2">Weight</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="grid grid-cols-12 gap-4 mb-2 font-medium text-sm">
        <div className="col-span-5">RIC</div>
        <div className="col-span-5">{shareOrWeight === 'shares' ? 'Shares' : 'Weight (%)'}</div>
        <div className="col-span-2">Actions</div>
      </div>
      
      {stocks.map((stock, index) => (
        <StockRow
          key={index}
          stock={stock}
          index={index}
          shareOrWeight={shareOrWeight}
          updateStock={updateStock}
          removeStock={removeStock}
        />
      ))}
      
      <button 
        onClick={addRow}
        className="flex items-center mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add row
      </button>
    </div>
  );
};

export default ManualComposition;
