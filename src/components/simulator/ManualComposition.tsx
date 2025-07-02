
import React from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import StockRow from './StockRow';
import { toast } from '@/hooks/use-toast';

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
  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData('text');
    
    // Check if the pasted data contains tabs or multiple lines (typical Excel paste)
    if (pastedData.includes('\t') || pastedData.includes('\n')) {
      e.preventDefault();
      
      const lines = pastedData.trim().split('\n');
      const newStocks: Stock[] = [];
      
      lines.forEach(line => {
        const columns = line.split('\t');
        if (columns.length >= 2) {
          const ric = columns[0]?.trim() || '';
          const value = columns[1]?.trim() || '';
          
          if (ric && value) {
            newStocks.push({
              ric,
              shares: shareOrWeight === 'shares' ? value : '',
              weight: shareOrWeight === 'weight' ? value : ''
            });
          }
        }
      });
      
      if (newStocks.length > 0) {
        // Find the first empty row or add new rows
        let startIndex = stocks.findIndex(stock => !stock.ric);
        if (startIndex === -1) {
          startIndex = stocks.length;
        }
        
        // Update existing stocks or add new ones
        newStocks.forEach((newStock, index) => {
          const targetIndex = startIndex + index;
          if (targetIndex < stocks.length) {
            updateStock(targetIndex, 'ric', newStock.ric);
            updateStock(targetIndex, shareOrWeight === 'shares' ? 'shares' : 'weight', 
              shareOrWeight === 'shares' ? newStock.shares : newStock.weight);
          } else {
            // Add new row
            addRow();
            // The new row will be added asynchronously, so we need to update it in the next tick
            setTimeout(() => {
              updateStock(targetIndex, 'ric', newStock.ric);
              updateStock(targetIndex, shareOrWeight === 'shares' ? 'shares' : 'weight',
                shareOrWeight === 'shares' ? newStock.shares : newStock.weight);
            }, 0);
          }
        });
        
        toast({
          title: "Data pasted",
          description: `${newStocks.length} rows pasted from clipboard`,
        });
      }
    }
  };

  return (
    <div onPaste={handlePaste}>
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
      
      <div className="mb-2 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
        💡 <strong>Tip:</strong> You can copy data from Excel and paste it here. Make sure the first column contains RIC codes and the second column contains {shareOrWeight === 'shares' ? 'shares' : 'weights'}.
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
