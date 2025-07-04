
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

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

interface StockRowProps {
  stock: Stock;
  index: number;
  shareOrWeight: string;
  updateStock: (index: number, field: 'ric' | 'shares' | 'weight' | 'baseValue' | 'weightingCapFactor' | 'caCash' | 'couponCash' | 'sinkingCash', value: string) => void;
  removeStock: (index: number) => void;
  showBaseValue?: boolean;
  showCashFields?: boolean;
}

const StockRow = ({ 
  stock, 
  index, 
  shareOrWeight, 
  updateStock, 
  removeStock,
  showBaseValue = false,
  showCashFields = false
}: StockRowProps) => {
  const getGridCols = () => {
    if (showBaseValue && showCashFields) return 'grid-cols-8'; // RIC, Shares/Weight, Weighting Cap Factor, Base Value, CA Cash, Coupon Cash, Sinking Cash, Actions
    if (showBaseValue) return 'grid-cols-5'; // RIC, Shares/Weight, Weighting Cap Factor, Base Value, Actions
    if (showCashFields) return 'grid-cols-7'; // RIC, Shares/Weight, Weighting Cap Factor, CA Cash, Coupon Cash, Sinking Cash, Actions
    return 'grid-cols-4'; // RIC, Shares/Weight, Weighting Cap Factor, Actions
  };

  return (
    <div className={`grid ${getGridCols()} gap-2 p-3 border-b last:border-b-0`}>
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
      <Input
        type="number"
        value={stock.weightingCapFactor || ''}
        onChange={(e) => updateStock(index, 'weightingCapFactor', e.target.value)}
        placeholder="1.00"
        step="0.01"
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
      {showCashFields && (
        <>
          <Input
            type="number"
            value={stock.caCash || ''}
            onChange={(e) => updateStock(index, 'caCash', e.target.value)}
            placeholder="CA Cash"
            step="0.01"
            className="h-8"
          />
          <Input
            type="number"
            value={stock.couponCash || ''}
            onChange={(e) => updateStock(index, 'couponCash', e.target.value)}
            placeholder="Coupon Cash"
            step="0.01"
            className="h-8"
          />
          <Input
            type="number"
            value={stock.sinkingCash || ''}
            onChange={(e) => updateStock(index, 'sinkingCash', e.target.value)}
            placeholder="Sinking Cash"
            step="0.01"
            className="h-8"
          />
        </>
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
