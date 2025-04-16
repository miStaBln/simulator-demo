
import React, { useState } from 'react';
import DatePicker from './DatePicker';
import { Input } from '@/components/ui/input';
import { Plus, Eye, Play, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const SimulationData = () => {
  const [startDate, setStartDate] = useState('11.04.2025');
  const [endDate, setEndDate] = useState('15.04.2025');
  const [currency, setCurrency] = useState('USD');
  const [returnType, setReturnType] = useState('NTR');
  const [divisor, setDivisor] = useState('100000');
  const [backcasting, setBackcasting] = useState(false);
  
  // Stock data
  const [stocks, setStocks] = useState([
    { ric: 'VIV.N', shares: '141799.5338' },
    { ric: 'TSLA.OQ', shares: '4822.004677' },
    { ric: 'BLUE.OQ', shares: '236240.7767' },
    { ric: 'GM.N', shares: '27885.39995' },
    { ric: 'SHOT.OQ', shares: '2663397.548' },
    { ric: 'FRGE.N', shares: '1963906.376' },
    { ric: 'ML.N', shares: '14244.70203' },
    { ric: 'F.N', shares: '130400.8574' },
  ]);

  const addRow = () => {
    setStocks([...stocks, { ric: '', shares: '' }]);
  };

  const updateStock = (index: number, field: 'ric' | 'shares', value: string) => {
    const newStocks = [...stocks];
    newStocks[index][field] = value;
    setStocks(newStocks);
  };

  const removeStock = (index: number) => {
    setStocks(stocks.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
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
          
          <div className="flex items-center mt-6">
            <Switch 
              checked={backcasting} 
              onCheckedChange={setBackcasting}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-900">Backcasting</label>
          </div>
        </div>
      </div>
      
      {/* Composition Panel */}
      <div className="bg-white rounded-md shadow-sm p-6 mt-6">
        <h2 className="text-lg font-medium mb-4">Composition</h2>
        
        <div className="grid grid-cols-12 gap-4 mb-2 font-medium text-sm">
          <div className="col-span-5">RIC</div>
          <div className="col-span-5">Shares</div>
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
                value={stock.shares}
                onChange={(e) => updateStock(index, 'shares', e.target.value)}
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
        
        <div className="flex justify-end mt-6 space-x-4">
          <button className="flex items-center px-4 py-2 border border-teal-500 text-teal-500 rounded-md hover:bg-teal-50">
            <Eye className="h-4 w-4 mr-2" />
            VIEW RESULTS
          </button>
          
          <button className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600">
            <Play className="h-4 w-4 mr-2" />
            SIMULATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationData;
