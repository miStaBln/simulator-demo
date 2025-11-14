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
  const [isBondIndex, setIsBondIndex] = useState<boolean>(false);
  
  useEffect(() => {
    // Get available simulation dates
    const dates = SimulationService.getAvailableDates();
    
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

    // Check if this is a bond index by looking at the first constituent
    if (dates.length > 0) {
      const firstDayData = SimulationService.getSimulationForDate(dates[0]);
      
      if (firstDayData?.closingIndexState?.composition?.clusters?.[0]?.constituents?.[0]) {
        const firstConstituent = firstDayData.closingIndexState.composition.clusters[0].constituents[0];
        const isBond = firstConstituent.assetIdentifier?.assetClass === 'BOND';
        setIsBondIndex(isBond);
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
    
    const dayData = SimulationService.getSimulationForDate(apiDate);
    
    if (dayData) {
      // Extract closing state data
      const closingResults = SimulationService.getResultsData(apiDate, 'closing');

      // Support both old (indexStateEvaluationDto) and new (evaluation) field names
      const closingEvaluation = dayData.closingIndexState?.evaluation || dayData.closingIndexState?.indexStateEvaluationDto;
      const closingIndexLevel = closingEvaluation?.indexLevel || 0;
      const closingDivisorValue = dayData.closingIndexState?.composition?.additionalNumbers?.divisor || 0;
      
      setClosingData(closingResults);
      setClosingLevel(closingIndexLevel);
      setClosingDivisor(closingDivisorValue);

      // Only extract opening data for non-bond indices
      if (!isBondIndex) {
        const openingResults = SimulationService.getResultsData(apiDate, 'opening');
        const openingEvaluation = dayData.openingIndexState?.evaluation || dayData.openingIndexState?.indexStateEvaluationDto;
        const openingIndexLevel = openingEvaluation?.indexLevel || 0;
        const openingDivisorValue = dayData.openingIndexState?.composition?.additionalNumbers?.divisor || 0;
        
        setOpeningData(openingResults);
        setOpeningLevel(openingIndexLevel);
        setOpeningDivisor(openingDivisorValue);
      }
    } else {
      setClosingData([]);
      setOpeningData([]);
      setClosingLevel(0);
      setOpeningLevel(0);
      setClosingDivisor(0);
      setOpeningDivisor(0);
    }
  }, [selectedDate, isBondIndex]);

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
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Simulation Result
        </h1>
        <p className="text-sm text-muted-foreground">
          Viewing data for {selectedDate} ({currentDateIndex + 1} of {availableDates.length} dates)
        </p>
      </div>
      
      {/* Date Navigation */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg border">
        <button
          onClick={() => navigateDate('prev')}
          disabled={currentDateIndex === 0}
          className="px-4 py-2 border rounded-md bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>
        
        <div className="px-4 py-2 bg-background border rounded-md font-semibold">
          {selectedDate}
        </div>
        
        <button
          onClick={() => navigateDate('next')}
          disabled={currentDateIndex === availableDates.length - 1}
          className="px-4 py-2 border rounded-md bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
        
        <span className="text-sm text-muted-foreground ml-auto">
          Date {currentDateIndex + 1} of {availableDates.length}
        </span>
      </div>
      
      {/* Index Metrics */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
          Index Metrics
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 border rounded-md">
            <div className="text-sm text-muted-foreground mb-1">Index Level</div>
            <div className="text-2xl font-bold">
              {closingLevel.toFixed(6)}
            </div>
          </div>
          <div className="p-4 bg-muted/50 border rounded-md">
            <div className="text-sm text-muted-foreground mb-1">Divisor</div>
            <div className="text-2xl font-bold">
              {closingDivisor.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Constituents Table */}
      {closingData.length > 0 && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
            Constituents ({closingData.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="p-3 text-left border font-semibold">Instrument</th>
                  <th className="p-3 text-right border font-semibold">Quantity</th>
                  <th className="p-3 text-right border font-semibold">Price</th>
                  <th className="p-3 text-right border font-semibold">Market Value</th>
                </tr>
              </thead>
              <tbody>
                {closingData.map((item, index) => {
                  const quantity = typeof item.quantity === 'string' ? parseFloat(item.quantity) : item.quantity;
                  const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                  const marketValue = typeof item.marketValue === 'string' ? parseFloat(item.marketValue) : item.marketValue;
                  
                  return (
                    <tr key={index} className="border-b hover:bg-muted/30">
                      <td className="p-3 border">
                        {item.instrumentId || item.ric || 'N/A'}
                      </td>
                      <td className="p-3 text-right border">
                        {!isNaN(quantity) ? quantity.toLocaleString() : 'N/A'}
                      </td>
                      <td className="p-3 text-right border">
                        {!isNaN(price) ? price.toFixed(4) : 'N/A'}
                      </td>
                      <td className="p-3 text-right border">
                        {!isNaN(marketValue) ? marketValue.toFixed(2) : (
                          !isNaN(quantity) && !isNaN(price) ? (quantity * price).toFixed(2) : 'N/A'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {closingData.length === 0 && (
        <div className="p-10 text-center bg-muted/50 border rounded-lg">
          <p className="text-lg text-muted-foreground">No constituent data available for this date</p>
        </div>
      )}
    </div>
  );
};

export default SimulationResult;
