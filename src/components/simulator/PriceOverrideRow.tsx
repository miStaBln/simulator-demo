
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import DatePicker from '../DatePicker';

interface PriceOverrideRowProps {
  override: { ric: string; date: string; price: string };
  index: number;
  updatePriceOverride: (index: number, field: 'ric' | 'date' | 'price', value: string) => void;
  removePriceOverride: (index: number) => void;
}

const PriceOverrideRow = ({ override, index, updatePriceOverride, removePriceOverride }: PriceOverrideRowProps) => {
  return (
    <div className="grid grid-cols-12 gap-4 mb-3 items-center">
      <div className="col-span-4">
        <Input
          type="text"
          value={override.ric}
          onChange={(e) => updatePriceOverride(index, 'ric', e.target.value)}
          className="w-full h-9"
          placeholder="e.g., AAPL.OQ"
        />
      </div>
      <div className="col-span-4">
        <DatePicker 
          label="Date"
          value={override.date} 
          onChange={(value) => updatePriceOverride(index, 'date', value)} 
          sublabel=""
        />
      </div>
      <div className="col-span-3">
        <div className="relative">
          <Input
            type="text"
            value={override.price}
            onChange={(e) => updatePriceOverride(index, 'price', e.target.value)}
            className="w-full h-9 pl-7"
            placeholder="0.00"
          />
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
        </div>
      </div>
      <div className="col-span-1">
        <button 
          onClick={() => removePriceOverride(index)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PriceOverrideRow;
