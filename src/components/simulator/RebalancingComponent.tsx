
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import DatePicker from '../DatePicker';

interface RebalancingComponentProps {
  rebalancing: {
    id: string;
    selectionDate: string;
    rebalancingDate: string;
    components: Array<{ ric: string; shares: string; weight: string }>;
  };
  index: number;
  shareOrWeight: string;
  updateRebalancingDate: (index: number, field: 'selectionDate' | 'rebalancingDate', value: string) => void;
  addRebalancingComponent: (rebalancingIndex: number) => void;
  updateRebalancingComponent: (
    rebalancingIndex: number, 
    componentIndex: number, 
    field: 'ric' | 'shares' | 'weight', 
    value: string
  ) => void;
  removeRebalancingComponent: (rebalancingIndex: number, componentIndex: number) => void;
}

const RebalancingComponent = ({
  rebalancing,
  index,
  shareOrWeight,
  updateRebalancingDate,
  addRebalancingComponent,
  updateRebalancingComponent,
  removeRebalancingComponent
}: RebalancingComponentProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DatePicker 
          label="Selection Date" 
          value={rebalancing.selectionDate} 
          onChange={(value) => updateRebalancingDate(index, 'selectionDate', value)} 
        />
        
        <DatePicker 
          label="Rebalancing Date" 
          value={rebalancing.rebalancingDate} 
          onChange={(value) => updateRebalancingDate(index, 'rebalancingDate', value)} 
        />
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Components</h3>
        
        <div className="grid grid-cols-12 gap-4 mb-2 font-medium text-xs">
          <div className="col-span-5">RIC</div>
          <div className="col-span-5">{shareOrWeight === 'shares' ? 'Shares' : 'Weight (%)'}</div>
          <div className="col-span-2">Actions</div>
        </div>
        
        {rebalancing.components.map((component, compIndex) => (
          <div key={compIndex} className="grid grid-cols-12 gap-4 mb-3 items-center">
            <div className="col-span-5">
              <Input
                type="text"
                value={component.ric}
                onChange={(e) => updateRebalancingComponent(index, compIndex, 'ric', e.target.value)}
                className="w-full h-8 text-sm"
              />
            </div>
            <div className="col-span-5">
              <Input
                type="text"
                value={shareOrWeight === 'shares' ? component.shares : component.weight}
                onChange={(e) => updateRebalancingComponent(
                  index, 
                  compIndex, 
                  shareOrWeight === 'shares' ? 'shares' : 'weight', 
                  e.target.value
                )}
                className="w-full h-8 text-sm"
              />
            </div>
            <div className="col-span-2">
              <button 
                onClick={() => removeRebalancingComponent(index, compIndex)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        
        <button 
          onClick={() => addRebalancingComponent(index)}
          className="flex items-center mt-2 px-3 py-1 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add component
        </button>
      </div>
    </>
  );
};

export default RebalancingComponent;
