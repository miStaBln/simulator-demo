
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DatePicker from './DatePicker';
import DataTable from './DataTable';
import { SimulationService } from '@/services/simulationService';

const SimulationResult = () => {
  const [selectedDate, setSelectedDate] = useState('11.04.2025');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [closingData, setClosingData] = useState<any[]>([]);
  const [openingData, setOpeningData] = useState<any[]>([]);
  const [closingLevel, setClosingLevel] = useState<number>(0);
  const [openingLevel, setOpeningLevel] = useState<number>(0);
  const [closingDivisor, setClosingDivisor] = useState<number>(0);
  const [openingDivisor, setOpeningDivisor] = useState<number>(0);
  
  useEffect(() => {
    // Get available simulation dates
    const simulationResult = SimulationService.getSimulationResult();
    if (simulationResult) {
      // Handle both old dummy format and new API format
      const simulationData = simulationResult.simulations || simulationResult;
      const dates = Object.keys(simulationData).sort();
      const formattedDates = dates.map(date => {
        const [year, month, day] = date.split('-');
        return `${day}.${month}.${year}`;
      });
      setAvailableDates(formattedDates);
      
      // Set initial date if available
      if (formattedDates.length > 0) {
        setSelectedDate(formattedDates[0]);
        setCurrentDateIndex(0);
      }
    }
  }, []);

  useEffect(() => {
    // Convert date format from DD.MM.YYYY to YYYY-MM-DD for API
    const formatDateForAPI = (dateStr: string) => {
      const [day, month, year] = dateStr.split('.');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const apiDate = formatDateForAPI(selectedDate);
    const simulationResult = SimulationService.getSimulationResult();
    
    if (simulationResult) {
      // Handle both old dummy format and new API format
      const simulationData = simulationResult.simulations || simulationResult;
      
      if (simulationData[apiDate]) {
        const dayData = simulationData[apiDate];
        // Extract closing state data
        const closingResults = SimulationService.getResultsData(apiDate, 'closing');

        const closingIndexLevel = dayData.closingIndexState?.indexStateEvaluationDto?.indexLevel || 0;
        const closingDivisorValue = dayData.closingIndexState?.composition?.additionalNumbers?.divisor || 0;
        
        // Extract opening state data
        const openingResults = SimulationService.getResultsData(apiDate, 'opening');
        const openingIndexLevel = dayData.openingIndexState?.indexStateEvaluationDto?.indexLevel || 0;
        const openingDivisorValue = dayData.openingIndexState?.composition?.additionalNumbers?.divisor || 0;
        
        setClosingData(closingResults);
        setOpeningData(openingResults);
        setClosingLevel(closingIndexLevel);
        setOpeningLevel(openingIndexLevel);
        setClosingDivisor(closingDivisorValue);
        setOpeningDivisor(openingDivisorValue);
      } else {
        setClosingData([]);
        setOpeningData([]);
        setClosingLevel(0);
        setOpeningLevel(0);
        setClosingDivisor(0);
        setOpeningDivisor(0);
      }
    }
  }, [selectedDate]);

  const navigateDate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentDateIndex > 0) {
      const newIndex = currentDateIndex - 1;
      setCurrentDateIndex(newIndex);
      setSelectedDate(availableDates[newIndex]);
    } else if (direction === 'next' && currentDateIndex < availableDates.length - 1) {
      const newIndex = currentDateIndex + 1;
      setCurrentDateIndex(newIndex);
      setSelectedDate(availableDates[newIndex]);
    }
  };

  const handleDateChange = (newDate: string) => {
    const dateIndex = availableDates.indexOf(newDate);
    if (dateIndex !== -1) {
      setCurrentDateIndex(dateIndex);
      setSelectedDate(newDate);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-medium mb-4">Simulation Result</h1>
      
      {/* Date Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigateDate('prev')}
          disabled={currentDateIndex === 0}
          className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <DatePicker 
          label="Simulation Date" 
          value={selectedDate} 
          onChange={handleDateChange}
        />
        
        <button
          onClick={() => navigateDate('next')}
          disabled={currentDateIndex === availableDates.length - 1}
          className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        
        <span className="text-sm text-gray-500">
          {currentDateIndex + 1} of {availableDates.length}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs text-gray-500">Level</div>
              <div className="text-lg font-medium">{closingLevel.toFixed(6)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs text-gray-500">Divisor</div>
              <div className="text-lg font-medium">{closingDivisor.toLocaleString()}</div>
            </div>
          </div>
          <DataTable 
            title="Closing Index State" 
            data={closingData} 
          />
        </div>
        
        <div>
          <div className="mb-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs text-gray-500">Level</div>
              <div className="text-lg font-medium">{openingLevel.toFixed(6)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs text-gray-500">Divisor</div>
              <div className="text-lg font-medium">{openingDivisor.toLocaleString()}</div>
            </div>
          </div>
          <DataTable 
            title="Next Day Opening State" 
            data={openingData} 
          />
        </div>
      </div>
    </div>
  );
};

export default SimulationResult;
