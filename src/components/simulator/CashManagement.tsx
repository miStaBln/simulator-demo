
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from 'lucide-react';

interface CashManagementProps {
  cashes: Array<{value: string, type: string}>;
  addCash: () => void;
  updateCash: (index: number, field: 'value' | 'type', value: string) => void;
  removeCash: (index: number) => void;
}

const CashManagement = ({
  cashes,
  addCash,
  updateCash,
  removeCash
}: CashManagementProps) => {
  return (
    <div className="border-t pt-4">
      <h3 className="text-md font-medium mb-4">Cash Management</h3>
      
      <div className="border rounded-md">
        <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 border-b font-medium text-sm">
          <div>Value</div>
          <div>Type</div>
          <div>Actions</div>
        </div>
        
        {cashes.map((cash, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 p-3 border-b last:border-b-0">
            <Input
              type="number"
              step="0.01"
              value={cash.value}
              onChange={(e) => updateCash(index, 'value', e.target.value)}
              placeholder="0.00"
              className="h-8"
            />
            <Select value={cash.type} onValueChange={(value) => updateCash(index, 'type', value)}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CA_CASH">CA Cash</SelectItem>
                <SelectItem value="COUPON_CASH">Coupon Cash</SelectItem>
                <SelectItem value="SINKING_CASH">Sinking Cash</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => removeCash(index)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button onClick={addCash} variant="outline" size="sm">
          Add Cash
        </Button>
      </div>
    </div>
  );
};

export default CashManagement;
