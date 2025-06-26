
import React, { useState } from 'react';
import { Plus, Calendar, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import PriceOverrideRow from './PriceOverrideRow';

interface PriceOverride {
  ric: string;
  date: string;
  price: string;
}

interface PriceOverridesProps {
  priceOverrides: PriceOverride[];
  addPriceOverride: () => void;
  updatePriceOverride: (index: number, field: 'ric' | 'date' | 'price', value: string) => void;
  removePriceOverride: (index: number) => void;
}

const PriceOverrides = ({
  priceOverrides,
  addPriceOverride,
  updatePriceOverride,
  removePriceOverride
}: PriceOverridesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-gray-50 rounded-md shadow-sm p-6 mt-6 border border-gray-100">
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <h2 className="text-lg font-medium">Price Uploads (Optional)</h2>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4">
          <p className="text-sm text-gray-500 mb-4">
            Upload custom prices for specific constituents and dates to override default values used in simulation.
          </p>
          
          {priceOverrides.length === 0 ? (
            <div className="text-gray-500 text-sm mb-4">No custom prices added yet</div>
          ) : (
            <div className="mb-4">
              <div className="grid grid-cols-12 gap-4 mb-2 font-medium text-sm">
                <div className="col-span-4">RIC</div>
                <div className="col-span-4">Date</div>
                <div className="col-span-3">Price</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {priceOverrides.map((override, index) => (
                <PriceOverrideRow
                  key={index}
                  override={override}
                  index={index}
                  updatePriceOverride={updatePriceOverride}
                  removePriceOverride={removePriceOverride}
                />
              ))}
            </div>
          )}
          
          <button 
            onClick={addPriceOverride}
            className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Price
          </button>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> You can also upload a CSV file with price data.
            </p>
            <label className="block mt-2">
              <div className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-700">Upload price CSV</span>
              </div>
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                onChange={() => {
                  toast({
                    title: "CSV Upload",
                    description: "CSV parsing would happen here in a real implementation.",
                  });
                }} 
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Format: RIC,Date,Price (e.g., AAPL.OQ,11.04.2025,150.75)
            </p>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default PriceOverrides;
