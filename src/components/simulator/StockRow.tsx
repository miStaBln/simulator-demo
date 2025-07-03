
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface Stock {
  ric: string;
  shares: string;
  weight: string;
  baseValue?: string;
}

interface StockRowProps {
  stock: Stock;
  index: number;
  shareOrWeight: string;
  updateStock: (index: number, field: 'ric' | 'shares' | 'weight' | 'baseValue', value: string) => void;
  removeStock: (index: number) => void;
  showBaseValue?: boolean;
}

const StockRow = ({ 
  stock, 
  index, 
  shareOrWeight, 
  updateStock, 
  removeStock,
  showBaseValue = false
}: StockRowProps) => {
  return (
    <div className={`grid ${showBaseValue ? 'grid-cols-5' : 'grid-cols-4'} gap-2 p-3 border-b last:border-b-0`}>
      <Input
        type="text"
        value={stock.ric}
        onChange={(e) => updateStock(index, 'ric', e.target.value)}
        placeholder="Enter RIC"
        className="h-8"
      />
      <Input
        type="number"
        value={shareOrWeight === 'shares' ? stock.shares : stock.weight}
        onChange={(e) => updateStock(index, shareOrWeight === 'shares' ? 'shares' : 'weight', e.target.value)}
        placeholder={shareOrWeight === 'shares' ? "0" : "0.00"}
        step={shareOrWeight === 'shares' ? "1" : "0.01"}
        className="h-8"
      />
      {showBaseValue && (
        <Input
          type="number"
          value={stock.baseValue || ''}
          onChange={(e) => updateStock(index, 'baseValue', e.target.value)}
          placeholder="0.00"
          step="0.01"
          className="h-8"
        />
      )}
      <Button
        onClick={() => removeStock(index)}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default StockRow;
