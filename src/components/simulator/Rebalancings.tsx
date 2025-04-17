
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RebalancingComponent from './RebalancingComponent';

interface RebalancingItem {
  id: string;
  selectionDate: string;
  rebalancingDate: string;
  components: Array<{ ric: string; shares: string; weight: string }>;
}

interface RebalancingsProps {
  rebalancings: RebalancingItem[];
  shareOrWeight: string;
  addRebalancing: () => void;
  removeRebalancing: (index: number) => void;
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

const Rebalancings = ({
  rebalancings,
  shareOrWeight,
  addRebalancing,
  removeRebalancing,
  updateRebalancingDate,
  addRebalancingComponent,
  updateRebalancingComponent,
  removeRebalancingComponent
}: RebalancingsProps) => {
  return (
    <div className="bg-white rounded-md shadow-sm p-6 mt-6">
      <h2 className="text-lg font-medium mb-4">Rebalancings</h2>
      
      {rebalancings.length === 0 ? (
        <div className="text-gray-500 text-sm mb-4">No rebalancing data added yet</div>
      ) : (
        <Accordion type="multiple" className="mb-4">
          {rebalancings.map((rebalancing, index) => (
            <AccordionItem key={rebalancing.id} value={rebalancing.id}>
              <AccordionTrigger className="hover:bg-gray-50 px-4">
                <div className="flex justify-between w-full pr-4">
                  <span>Rebalancing #{index + 1}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRebalancing(index);
                    }}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4">
                <RebalancingComponent
                  rebalancing={rebalancing}
                  index={index}
                  shareOrWeight={shareOrWeight}
                  updateRebalancingDate={updateRebalancingDate}
                  addRebalancingComponent={addRebalancingComponent}
                  updateRebalancingComponent={updateRebalancingComponent}
                  removeRebalancingComponent={removeRebalancingComponent}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      
      <button 
        onClick={addRebalancing}
        className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Rebalancing
      </button>
    </div>
  );
};

export default Rebalancings;
