import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from './DatePicker';
import { Input } from '@/components/ui/input';
import { Plus, Eye, Play, Trash2, Download, RefreshCw, Calendar, DollarSign } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock index data with parameters
const mockIndices = [
  { 
    id: 'SOLACTIVE1', 
    name: 'Solactive Tech Index', 
    currency: 'USD', 
    returnType: 'NTR', 
    divisor: '100000',
    constituents: [
      { ric: 'AAPL.OQ', shares: '10000', weight: '25' },
      { ric: 'MSFT.OQ', shares: '5000', weight: '20' },
      { ric: 'GOOGL.OQ', shares: '2000', weight: '18' },
      { ric: 'AMZN.OQ', shares: '3000', weight: '22' },
      { ric: 'META.OQ', shares: '4000', weight: '15' },
    ]
  },
  { 
    id: 'SOLACTIVE2', 
    name: 'Solactive Energy Index', 
    currency: 'EUR', 
    returnType: 'GTR', 
    divisor: '50000',
    constituents: [
      { ric: 'XOM.N', shares: '15000', weight: '22' },
      { ric: 'CVX.N', shares: '12000', weight: '20' },
      { ric: 'BP.L', shares: '30000', weight: '18' },
      { ric: 'SHEL.L', shares: '25000', weight: '20' },
      { ric: 'TTE.PA', shares: '10000', weight: '20' },
    ]
  },
  { 
    id: 'SOLACTIVE3', 
    name: 'Solactive Healthcare Index', 
    currency: 'GBP', 
    returnType: 'PR', 
    divisor: '75000',
    constituents: [
      { ric: 'JNJ.N', shares: '8000', weight: '22' },
      { ric: 'PFE.N', shares: '25000', weight: '18' },
      { ric: 'MRK.N', shares: '15000', weight: '20' },
      { ric: 'NOVN.S', shares: '10000', weight: '20' },
      { ric: 'ROG.S', shares: '5000', weight: '20' },
    ]
  },
];

const SimulationData = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('11.04.2025');
  const [endDate, setEndDate] = useState('15.04.2025');
  const [currency, setCurrency] = useState('USD');
  const [returnType, setReturnType] = useState('NTR');
  const [divisor, setDivisor] = useState('100000');
  const [inputMethod, setInputMethod] = useState('manual');
  const [selectedIndex, setSelectedIndex] = useState('');
  const [indexDate, setIndexDate] = useState('11.04.2025');
  const [priceType, setPriceType] = useState('close');
  const [loading, setLoading] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  
  // Rebalancing data
  const [rebalancings, setRebalancings] = useState<any[]>([]);
  const [shareOrWeight, setShareOrWeight] = useState('shares');
  
  // Stock data
  const [stocks, setStocks] = useState([
    { ric: 'VIV.N', shares: '141799.5338', weight: '8.5' },
    { ric: 'TSLA.OQ', shares: '4822.004677', weight: '15.3' },
    { ric: 'BLUE.OQ', shares: '236240.7767', weight: '7.2' },
    { ric: 'GM.N', shares: '27885.39995', weight: '12.1' },
    { ric: 'SHOT.OQ', shares: '2663397.548', weight: '18.6' },
    { ric: 'FRGE.N', shares: '1963906.376', weight: '14.0' },
    { ric: 'ML.N', shares: '14244.70203', weight: '12.3' },
    { ric: 'F.N', shares: '130400.8574', weight: '12.0' },
  ]);

  // Price overrides
  const [priceOverrides, setPriceOverrides] = useState<Array<{ric: string, date: string, price: string}>>([]);
  
  const addRow = () => {
    setStocks([...stocks, { ric: '', shares: '', weight: '' }]);
  };

  const updateStock = (index: number, field: 'ric' | 'shares' | 'weight', value: string) => {
    const newStocks = [...stocks];
    newStocks[index][field] = value;
    setStocks(newStocks);
  };

  const removeStock = (index: number) => {
    setStocks(stocks.filter((_, i) => i !== index));
  };

  const addPriceOverride = () => {
    setPriceOverrides([...priceOverrides, { ric: '', date: startDate, price: '' }]);
  };

  const updatePriceOverride = (index: number, field: 'ric' | 'date' | 'price', value: string) => {
    const newPriceOverrides = [...priceOverrides];
    newPriceOverrides[index][field] = value;
    setPriceOverrides(newPriceOverrides);
  };

  const removePriceOverride = (index: number) => {
    setPriceOverrides(priceOverrides.filter((_, i) => i !== index));
  };

  const fetchIndexData = () => {
    toast({
      title: "Loading index data",
      description: `Fetching data for ${selectedIndex} on ${indexDate}`,
    });
    
    // Find the selected index data
    const selectedIndexData = mockIndices.find(index => index.id === selectedIndex);
    
    if (selectedIndexData) {
      // Update parameters based on the selected index
      setCurrency(selectedIndexData.currency);
      setReturnType(selectedIndexData.returnType);
      setDivisor(selectedIndexData.divisor);
      
      // Update stocks based on the selected index
      setStocks(selectedIndexData.constituents);
      
      toast({
        title: "Data loaded",
        description: "Index data has been successfully loaded and parameters prefilled",
      });
    } else {
      toast({
        title: "Error",
        description: "Selected index data not found",
        variant: "destructive",
      });
    }
  };

  const handleSelectedIndexChange = (indexId: string) => {
    setSelectedIndex(indexId);
  };

  const addRebalancing = () => {
    setRebalancings([
      ...rebalancings, 
      { 
        id: `rebal-${rebalancings.length + 1}`,
        selectionDate: startDate,
        rebalancingDate: startDate,
        components: [
          { ric: 'AAPL.OQ', shares: '1000', weight: '20' },
          { ric: 'MSFT.OQ', shares: '500', weight: '15' },
        ]
      }
    ]);
  };

  const removeRebalancing = (index: number) => {
    setRebalancings(rebalancings.filter((_, i) => i !== index));
  };

  const updateRebalancingDate = (index: number, field: 'selectionDate' | 'rebalancingDate', value: string) => {
    const newRebalancings = [...rebalancings];
    newRebalancings[index][field] = value;
    setRebalancings(newRebalancings);
  };

  const addRebalancingComponent = (rebalancingIndex: number) => {
    const newRebalancings = [...rebalancings];
    newRebalancings[rebalancingIndex].components.push({ ric: '', shares: '', weight: '' });
    setRebalancings(newRebalancings);
  };

  const updateRebalancingComponent = (
    rebalancingIndex: number, 
    componentIndex: number, 
    field: 'ric' | 'shares' | 'weight', 
    value: string
  ) => {
    const newRebalancings = [...rebalancings];
    newRebalancings[rebalancingIndex].components[componentIndex][field] = value;
    setRebalancings(newRebalancings);
  };

  const removeRebalancingComponent = (rebalancingIndex: number, componentIndex: number) => {
    const newRebalancings = [...rebalancings];
    newRebalancings[rebalancingIndex].components = 
      newRebalancings[rebalancingIndex].components.filter((_, i) => i !== componentIndex);
    setRebalancings(newRebalancings);
  };

  const handleSimulate = () => {
    setLoading(true);
    toast({
      title: "Simulation started",
      description: "Please wait while we process your simulation data",
    });
    
    // Simulate processing time
    setTimeout(() => {
      setLoading(false);
      setSimulationComplete(true);
      toast({
        title: "Simulation complete",
        description: "Your index simulation is ready to view",
      });
    }, 2000);
  };

  const viewResults = () => {
    // Update the global state or use a callback to inform the parent component to switch tabs
    navigate('/simulator?tab=time-series');
  };

  return (
    <div className="p-6 pb-24 md:pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="bg-white rounded-md shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Simulation Period</h2>
          
          <DatePicker 
            label="Start Date" 
            sublabel="Date"
            value={startDate} 
            onChange={setStartDate} 
          />
          
          <DatePicker 
            label="End Date" 
            sublabel="Date"
            value={endDate} 
            onChange={setEndDate} 
          />
        </div>
        
        {/* Right Panel */}
        <div className="bg-white rounded-md shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Parameters</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-1">Currency</label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-1">Return Type</label>
            <Select value={returnType} onValueChange={setReturnType}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select Return Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NTR">NTR</SelectItem>
                <SelectItem value="GTR">GTR</SelectItem>
                <SelectItem value="PR">PR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-1">Divisor</label>
            <Input 
              type="text" 
              value={divisor} 
              onChange={(e) => setDivisor(e.target.value)}
              className="w-full h-9"
            />
          </div>
        </div>
      </div>
      
      {/* Composition Panel */}
      <div className="bg-white rounded-md shadow-sm p-6 mt-6">
        <h2 className="text-lg font-medium mb-4">Composition</h2>
        
        <Tabs defaultValue="manual" onValueChange={setInputMethod}>
          <TabsList className="mb-4">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="index">From Existing Index</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual">
            <div>
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
                      onChange={(e) => updateStock(index, 'ric', e.target.value)}
                      className="w-full h-9"
                    />
                  </div>
                  <div className="col-span-5">
                    <Input
                      type="text"
                      value={shareOrWeight === 'shares' ? stock.shares : stock.weight}
                      onChange={(e) => updateStock(index, shareOrWeight === 'shares' ? 'shares' : 'weight', e.target.value)}
                      className="w-full h-9"
                    />
                  </div>
                  <div className="col-span-2">
                    <button 
                      onClick={() => removeStock(index)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={addRow}
                className="flex items-center mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add row
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="index">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Select Index</label>
                <Select value={selectedIndex} onValueChange={handleSelectedIndexChange}>
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
                  onValueChange={setShareOrWeight} 
                  className="flex space-x-4 mb-4"
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
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Rebalancings Panel */}
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
      
      {/* Price Overrides Panel */}
      <div className="bg-white rounded-md shadow-sm p-6 mt-6">
        <h2 className="text-lg font-medium mb-4">Price Uploads (Optional)</h2>
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
              <div key={index} className="grid grid-cols-12 gap-4 mb-3 items-center">
                <div className="col-span-4">
                  <Input
                    type="text"
                    value={override.ric}
                    onChange={(e) => updatePriceOverride(index, 'ric', e.target.value)}
                    className="w-full h-9"
                    placeholder="e.g., AAPL.OQ"
                  />
                </div>
                <div className="col-span-4">
                  <DatePicker 
                    label="Date"
                    value={override.date} 
                    onChange={(value) => updatePriceOverride(index, 'date', value)} 
                    sublabel=""
                  />
                </div>
                <div className="col-span-3">
                  <div className="relative">
                    <Input
                      type="text"
                      value={override.price}
                      onChange={(e) => updatePriceOverride(index, 'price', e.target.value)}
                      className="w-full h-9 pl-7"
                      placeholder="0.00"
                    />
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                  </div>
                </div>
                <div className="col-span-1">
                  <button 
                    onClick={() => removePriceOverride(index)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
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
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 md:static md:border-0 md:bg-transparent md:p-0 md:mt-6">
        <div className="flex justify-end space-x-4">
          {simulationComplete && (
            <button 
              onClick={viewResults}
              className="flex items-center px-4 py-2 border border-teal-500 text-teal-500 rounded-md hover:bg-teal-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              VIEW RESULTS
            </button>
          )}
          
          <button 
            onClick={handleSimulate}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-teal-300"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                SIMULATING...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                SIMULATE
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationData;
