
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RebalancingComponent from './RebalancingComponent';
import RebalancingUpload from './RebalancingUpload';
import { ChevronDown } from 'lucide-react';

interface RebalancingItem {
  id: string;
  selectionDate: string;
  rebalancingDate: string;
  components: Array<{ ric: string; shares: string; weight: string; weightingCapFactor?: string }>;
}

interface RebalancingSectionProps {
  rebalancings: RebalancingItem[];
  shareOrWeight: string;
  indexFamily: string;
  addRebalancing: () => void;
  removeRebalancing: (index: number) => void;
  updateRebalancingDate: (index: number, field: 'selectionDate' | 'rebalancingDate', value: string) => void;
  addRebalancingComponent: (rebalancingIndex: number) => void;
  updateRebalancingComponent: (
    rebalancingIndex: number, 
    componentIndex: number, 
    field: 'ric' | 'shares' | 'weight' | 'weightingCapFactor', 
    value: string
  ) => void;
  removeRebalancingComponent: (rebalancingIndex: number, componentIndex: number) => void;
  rebalancingUploads: Array<{ selectionDate: string, rebalancingDate: string, file: string }>;
  addRebalancingUpload: (selectionDate: string, rebalancingDate: string, file: string) => void;
  removeRebalancingUpload: (index: number) => void;
}

const RebalancingSection = ({
  rebalancings,
  shareOrWeight,
  indexFamily,
  addRebalancing,
  removeRebalancing,
  updateRebalancingDate,
  addRebalancingComponent,
  updateRebalancingComponent,
  removeRebalancingComponent,
  rebalancingUploads,
  addRebalancingUpload,
  removeRebalancingUpload
}: RebalancingSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [matrixUploads, setMatrixUploads] = useState<any[]>([]);
  const isBondIndex = indexFamily === 'BOND_DEFAULT' || indexFamily === 'BOND_BASEMARKETVALUE';

  const handleMatrixUpload = (matrixData: any[]) => {
    // Store matrix uploads for preview
    setMatrixUploads(prev => [...prev, ...matrixData]);
    
    // Convert matrix data to rebalancing format and add to the existing rebalancings
    matrixData.forEach((entry) => {
      const newRebalancing = {
        id: `matrix-rebal-${Date.now()}-${Math.random()}`,
        selectionDate: entry.selectionDate,
        rebalancingDate: entry.rebalancingDate,
        components: entry.components
      };
      
      // Add to rebalancings (this would need to be passed as a prop function)
      // For now, we'll add it as a rebalancing upload entry
      const fileName = `matrix_${entry.selectionDate.replace(/\./g, '_')}.csv`;
      addRebalancingUpload(entry.selectionDate, entry.rebalancingDate, fileName);
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-gray-100 rounded-md shadow-sm p-6 mt-6 border border-gray-200">
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <h2 className="text-lg font-medium">Rebalancings</h2>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="upload">Upload CSV</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              {/* Matrix Upload Preview */}
              {isBondIndex && matrixUploads.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="text-sm font-medium text-blue-900 mb-3">Matrix Upload Preview</h3>
                  <div className="space-y-3">
                    {matrixUploads.map((matrixEntry, matrixIndex) => (
                      <div key={matrixIndex} className="bg-white p-3 rounded border">
                        <div className="text-sm font-medium mb-2">
                          Selection Date: {matrixEntry.selectionDate} | Rebalancing Date: {matrixEntry.rebalancingDate}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="font-medium">RIC</div>
                          <div className="font-medium">Weight</div>
                          <div className="font-medium">Cap Factor</div>
                        </div>
                        {matrixEntry.components.map((comp: any, compIndex: number) => (
                          <div key={compIndex} className="grid grid-cols-3 gap-2 text-xs py-1 border-t">
                            <div>{comp.ric}</div>
                            <div>{comp.weight}</div>
                            <div>{comp.weightingCapFactor}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-blue-700">
                    This data was imported from your matrix upload and is available in the manual entries above.
                  </div>
                </div>
              )}

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
                          indexFamily={indexFamily}
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
            </TabsContent>
            
            <TabsContent value="upload">
              <RebalancingUpload
                rebalancingUploads={rebalancingUploads}
                addRebalancingUpload={addRebalancingUpload}
                removeRebalancingUpload={removeRebalancingUpload}
                isBondIndex={isBondIndex}
                onMatrixUpload={handleMatrixUpload}
              />
            </TabsContent>
          </Tabs>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default RebalancingSection;
