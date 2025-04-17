
import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SimulationParametersProps {
  currency: string;
  setCurrency: (currency: string) => void;
  returnType: string;
  setReturnType: (returnType: string) => void;
  divisor: string;
  setDivisor: (divisor: string) => void;
}

const SimulationParameters = ({ 
  currency, 
  setCurrency, 
  returnType, 
  setReturnType, 
  divisor, 
  setDivisor 
}: SimulationParametersProps) => {
  return (
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
  );
};

export default SimulationParameters;
