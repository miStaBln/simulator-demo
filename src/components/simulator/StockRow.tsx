
import React from 'react';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface StockRowProps {
  stock: { ric: string; shares: string; weight: string };
  index: number;
  shareOrWeight: string;
  updateStock: (index: number, field: 'ric' | 'shares' | 'weight', value: string) => void;
  removeStock: (index: number) => void;
}

const StockRow = ({ stock, index, shareOrWeight, updateStock, removeStock }: StockRowProps) => {
  return (
    <div className="grid grid-cols-12 gap-4 mb-3 items-center">
      <div className="col-span-5">
        <Input
          type="text"
          value={stock.ric}
          onChange={(e) => updateStock(index, 'ric', e.target.value)}
          className="w-full h-9"
        />
      </div>
      <div className="col-span-5">
        <Input
          type="text"
          value={shareOrWeight === 'shares' ? stock.shares : stock.weight}
          onChange={(e) => updateStock(index, shareOrWeight === 'shares' ? 'shares' : 'weight', e.target.value)}
          className="w-full h-9"
        />
      </div>
      <div className="col-span-2">
        <button 
          onClick={() => removeStock(index)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default StockRow;
