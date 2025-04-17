
import React from 'react';
import { Download, RefreshCw, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DatePicker from '../DatePicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Stock {
  ric: string;
  shares: string;
  weight: string;
}

interface IndexCompositionProps {
  selectedIndex: string;
  setSelectedIndex: (index: string) => void;
  indexDate: string;
  setIndexDate: (date: string) => void;
  priceType: string;
  setPriceType: (type: string) => void;
  shareOrWeight: string;
  stocks: Stock[];
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

const IndexComposition = ({
  selectedIndex,
  setSelectedIndex,
  indexDate,
  setIndexDate,
  priceType,
  setPriceType,
  shareOrWeight,
  stocks,
  fetchIndexData,
  mockIndices
}: IndexCompositionProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Select Index</label>
          <Select value={selectedIndex} onValueChange={setSelectedIndex}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Select Index" />
            </SelectTrigger>
            <SelectContent>
              {mockIndices.map((index) => (
                <SelectItem key={index.id} value={index.id}>
                  {index.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <DatePicker 
            label="Index Date" 
            value={indexDate} 
            onChange={setIndexDate} 
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900 mb-1">Price Type</label>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroup 
              value={priceType} 
              onValueChange={setPriceType} 
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="open" id="p1" />
                <Label htmlFor="p1">Open</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="close" id="p2" />
                <Label htmlFor="p2">Close</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={fetchIndexData}
        className="mb-4"
        disabled={!selectedIndex}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Retrieve Index Data
      </Button>
      
      {selectedIndex && (
        <div className="mt-4">
          <RadioGroup 
            value={shareOrWeight} 
            onValueChange={() => {}}
            className="flex space-x-4 mb-4"
            disabled
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shares" id="r3" />
              <Label htmlFor="r3">Shares</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weight" id="r4" />
              <Label htmlFor="r4">Weight</Label>
            </div>
          </RadioGroup>
          
          <div className="grid grid-cols-12 gap-4 mb-2 font-medium text-sm">
            <div className="col-span-5">RIC</div>
            <div className="col-span-5">{shareOrWeight === 'shares' ? 'Shares' : 'Weight (%)'}</div>
            <div className="col-span-2">Actions</div>
          </div>
          
          {stocks.map((stock, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 mb-3 items-center">
              <div className="col-span-5">
                <Input
                  type="text"
                  value={stock.ric}
                  readOnly
                  className="w-full h-9 bg-gray-50"
                />
              </div>
              <div className="col-span-5">
                <Input
                  type="text"
                  value={shareOrWeight === 'shares' ? stock.shares : stock.weight}
                  readOnly
                  className="w-full h-9 bg-gray-50"
                />
              </div>
              <div className="col-span-2">
                <button className="p-2 text-gray-400 cursor-not-allowed">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          <div className="flex items-center mt-4">
            <Download className="h-4 w-4 mr-2 text-teal-500" />
            <span className="text-sm text-teal-500">Download full composition</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexComposition;
