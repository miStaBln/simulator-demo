import React, { useState } from 'react';
import { Plus, Calendar, Trash2, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatePicker from '../DatePicker';
import BondMatrixUpload from './BondMatrixUpload';

interface RebalancingUploadProps {
  rebalancingUploads: Array<{ selectionDate: string, rebalancingDate: string, file: string }>;
  addRebalancingUpload: (selectionDate: string, rebalancingDate: string, file: string) => void;
  removeRebalancingUpload: (index: number) => void;
  isBondIndex?: boolean;
  onMatrixUpload?: (matrixData: any[]) => void;
}

const RebalancingUpload = ({
  rebalancingUploads,
  addRebalancingUpload,
  removeRebalancingUpload,
  isBondIndex = false,
  onMatrixUpload = () => {}
}: RebalancingUploadProps) => {
  const [selectedSelectionDate, setSelectedSelectionDate] = useState('04.04.2025');
  const [selectedRebalancingDate, setSelectedRebalancingDate] = useState('11.04.2025');

  const handleFileUpload = () => {
    // In a real implementation, this would handle actual file processing
    addRebalancingUpload(selectedSelectionDate, selectedRebalancingDate, 'rebalancing_data.csv');
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-6 mt-6">
      <h2 className="text-lg font-medium mb-4">Rebalancing Uploads (Optional)</h2>
      
      {isBondIndex ? (
        <Tabs defaultValue="matrix" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="matrix">Bond Matrix Upload</TabsTrigger>
            <TabsTrigger value="individual">Individual CSV Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="matrix">
            <BondMatrixUpload onMatrixUpload={onMatrixUpload} />
          </TabsContent>
          
          <TabsContent value="individual">
            {/* Individual upload content */}
            <p className="text-sm text-gray-500 mb-4">
              Upload individual rebalancing data in CSV format.
            </p>
            
            
            {rebalancingUploads.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-12 gap-4 mb-2 font-medium text-sm">
                  <div className="col-span-4">Selection Date</div>
                  <div className="col-span-4">Rebalancing Date</div>
                  <div className="col-span-3">File</div>
                  <div className="col-span-1">Actions</div>
                </div>
                
                {rebalancingUploads.map((upload, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 mb-3 items-center">
                    <div className="col-span-4">
                      <div className="py-2 px-3 border border-gray-200 rounded-md text-sm">
                        {upload.selectionDate}
                      </div>
                    </div>
                    <div className="col-span-4">
                      <div className="py-2 px-3 border border-gray-200 rounded-md text-sm">
                        {upload.rebalancingDate}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="py-2 px-3 border border-gray-200 rounded-md text-sm truncate">
                        {upload.file}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <button 
                        onClick={() => removeRebalancingUpload(index)}
                        className="p-2 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-12 gap-4 mb-4 items-end">
              <div className="col-span-4">
                <DatePicker
                  label="Selection Date"
                  value={selectedSelectionDate}
                  onChange={setSelectedSelectionDate}
                />
              </div>
              <div className="col-span-4">
                <DatePicker
                  label="Rebalancing Date"
                  value={selectedRebalancingDate}
                  onChange={setSelectedRebalancingDate}
                />
              </div>
              <div className="col-span-4">
                <label className="block">
                  <div className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-700">Upload rebalancing CSV</span>
                  </div>
                  <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                  />
                </label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Upload rebalancing data in CSV format to include in your simulation.
          </p>
          
          
          {rebalancingUploads.length > 0 && (
            <div className="mb-4">
              <div className="grid grid-cols-12 gap-4 mb-2 font-medium text-sm">
                <div className="col-span-4">Selection Date</div>
                <div className="col-span-4">Rebalancing Date</div>
                <div className="col-span-3">File</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {rebalancingUploads.map((upload, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 mb-3 items-center">
                  <div className="col-span-4">
                    <div className="py-2 px-3 border border-gray-200 rounded-md text-sm">
                      {upload.selectionDate}
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="py-2 px-3 border border-gray-200 rounded-md text-sm">
                      {upload.rebalancingDate}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="py-2 px-3 border border-gray-200 rounded-md text-sm truncate">
                      {upload.file}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <button 
                      onClick={() => removeRebalancingUpload(index)}
                      className="p-2 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-12 gap-4 mb-4 items-end">
            <div className="col-span-4">
              <DatePicker
                label="Selection Date"
                value={selectedSelectionDate}
                onChange={setSelectedSelectionDate}
              />
            </div>
            <div className="col-span-4">
              <DatePicker
                label="Rebalancing Date"
                value={selectedRebalancingDate}
                onChange={setSelectedRebalancingDate}
              />
            </div>
            <div className="col-span-4">
              <label className="block">
                <div className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-700">Upload rebalancing CSV</span>
                </div>
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
              </label>
            </div>
          </div>
        </>
      )}
      
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>Tip:</strong> {isBondIndex ? 'For matrix format, use Gigant IDs in header and weighting factors in cells. For individual CSV format, use' : 'CSV format should contain'} RIC, Weight/Shares columns.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Example: RIC,Shares,Weight,SelectionDate,RebalancingDate
          <br />
          AAPL.OQ,1000,25.5,2025-04-04,2025-04-11
          <br />
          MSFT.OQ,800,20.3,2025-04-04,2025-04-11
        </p>
      </div>
    </div>
  );
};

export default RebalancingUpload;
