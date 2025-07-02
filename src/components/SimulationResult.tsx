
import React, { useState, useEffect } from 'react';
import DatePicker from './DatePicker';
import DataTable from './DataTable';
import { SimulationService } from '@/services/simulationService';

const SimulationResult = () => {
  const [date, setDate] = useState('11.04.2025');
  const [closingData, setClosingData] = useState<any[]>([]);
  const [openingData, setOpeningData] = useState<any[]>([]);
  
  useEffect(() => {
    // Convert date format from DD.MM.YYYY to YYYY-MM-DD for API
    const formatDateForAPI = (dateStr: string) => {
      const [day, month, year] = dateStr.split('.');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const apiDate = formatDateForAPI(date);
    const closingResults = SimulationService.getResultsData(apiDate, 'closing');
    const openingResults = SimulationService.getResultsData(apiDate, 'opening');
    
    setClosingData(closingResults);
    setOpeningData(openingResults);
  }, [date]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-medium mb-4">Simulation Result</h1>
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <DatePicker 
            label="Date" 
            value={date} 
            onChange={setDate} 
          />
          <DataTable 
            title="Closing Index State" 
            data={closingData} 
          />
        </div>
        
        <div>
          <DatePicker 
            label="Date" 
            value={date} 
            onChange={setDate} 
          />
          <DataTable 
            title="Opening Index State" 
            data={openingData} 
          />
        </div>
      </div>
    </div>
  );
};

export default SimulationResult;
