
import React from 'react';
import DatePicker from '../DatePicker';

interface SimulationPeriodProps {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

const SimulationPeriod = ({ startDate, setStartDate, endDate, setEndDate }: SimulationPeriodProps) => {
  return (
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
  );
};

export default SimulationPeriod;
