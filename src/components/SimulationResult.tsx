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
  
  console.log('[SimulationResult] Component rendering', {
    selectedDate,
    availableDates: availableDates.length,
    closingData: closingData.length,
    openingData: openingData.length,
    closingLevel,
    isBondIndex
  });
  
  useEffect(() => {
    // Get available simulation dates
    const dates = SimulationService.getAvailableDates();
    console.log('[SimulationResult] Available dates from service:', dates);
    
    const formattedDates = dates.map(date => {
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`;
    });
    console.log('[SimulationResult] Formatted dates:', formattedDates);
    
    setAvailableDates(formattedDates);
    
    // Set initial date if available
    if (formattedDates.length > 0) {
      setSelectedDate(formattedDates[0]);
      setCurrentDateIndex(0);
      console.log('[SimulationResult] Set initial date:', formattedDates[0]);
    }

    // Check if this is a bond index by looking at the first constituent
    if (dates.length > 0) {
      const firstDayData = SimulationService.getSimulationForDate(dates[0]);
      console.log('[SimulationResult] First day data:', firstDayData);
      
      if (firstDayData?.closingIndexState?.composition?.clusters?.[0]?.constituents?.[0]) {
        const firstConstituent = firstDayData.closingIndexState.composition.clusters[0].constituents[0];
        const isBond = firstConstituent.assetIdentifier?.assetClass === 'BOND';
        console.log('[SimulationResult] Is bond index:', isBond);
        setIsBondIndex(isBond);
      }
    }
  }, []);

  useEffect(() => {
    console.log('[SimulationResult useEffect] Triggered with selectedDate:', selectedDate);
    
    // Convert date format from DD.MM.YYYY to YYYY-MM-DD for API
    const formatDateForAPI = (dateStr: string) => {
      const [day, month, year] = dateStr.split('.');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const apiDate = formatDateForAPI(selectedDate);
    console.log('[SimulationResult useEffect] Formatted API date:', apiDate);
    
    const dayData = SimulationService.getSimulationForDate(apiDate);
    console.log('[SimulationResult useEffect] Day data:', dayData);
    
    if (dayData) {
      // Extract closing state data
      const closingResults = SimulationService.getResultsData(apiDate, 'closing');
      console.log('[SimulationResult useEffect] Closing results:', closingResults);

      // Support both old (indexStateEvaluationDto) and new (evaluation) field names
      const closingEvaluation = dayData.closingIndexState?.evaluation || dayData.closingIndexState?.indexStateEvaluationDto;
      const closingIndexLevel = closingEvaluation?.indexLevel || 0;
      const closingDivisorValue = dayData.closingIndexState?.composition?.additionalNumbers?.divisor || 0;
      
      console.log('[SimulationResult useEffect] Setting closing data:', {
        closingIndexLevel,
        closingDivisorValue,
        closingResultsCount: closingResults.length
      });
      
      setClosingData(closingResults);
      setClosingLevel(closingIndexLevel);
      setClosingDivisor(closingDivisorValue);

      // Only extract opening data for non-bond indices
      if (!isBondIndex) {
        const openingResults = SimulationService.getResultsData(apiDate, 'opening');
        const openingEvaluation = dayData.openingIndexState?.evaluation || dayData.openingIndexState?.indexStateEvaluationDto;
        const openingIndexLevel = openingEvaluation?.indexLevel || 0;
        const openingDivisorValue = dayData.openingIndexState?.composition?.additionalNumbers?.divisor || 0;
        
        console.log('[SimulationResult useEffect] Setting opening data:', {
          openingIndexLevel,
          openingDivisorValue,
          openingResultsCount: openingResults.length
        });
        
        setOpeningData(openingResults);
        setOpeningLevel(openingIndexLevel);
        setOpeningDivisor(openingDivisorValue);
      }
    } else {
      console.log('[SimulationResult useEffect] No day data found, clearing state');
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
    <div style={{ 
      padding: '20px',
      background: '#ffffff',
      minHeight: '500px',
      border: '3px solid #000000'
    }}>
      {/* Very visible debug indicator */}
      <div style={{
        background: '#00FF00',
        color: '#000000',
        padding: '20px',
        border: '5px solid #FF0000',
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        <p>✅ SimulationResult IS RENDERING</p>
        <p>Dates available: {availableDates.length}</p>
        <p>Selected: {selectedDate}</p>
        <p>Data items: {closingData.length}</p>
        <p>Level: {closingLevel}</p>
        <p>Divisor: {closingDivisor}</p>
      </div>

      <h1 style={{ 
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#000000',
        background: '#FFEB3B',
        padding: '10px'
      }}>
        Simulation Result - {selectedDate}
      </h1>
      
      {/* Date Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
        padding: '16px',
        background: '#E3F2FD',
        border: '2px solid #2196F3'
      }}>
        <button
          onClick={() => navigateDate('prev')}
          disabled={currentDateIndex === 0}
          style={{
            padding: '8px 16px',
            border: '2px solid #000',
            borderRadius: '4px',
            background: currentDateIndex === 0 ? '#ccc' : '#fff',
            cursor: currentDateIndex === 0 ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          ← Previous
        </button>
        
        <div style={{ 
          padding: '8px 16px',
          background: '#fff',
          border: '2px solid #000',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          {selectedDate}
        </div>
        
        <button
          onClick={() => navigateDate('next')}
          disabled={currentDateIndex === availableDates.length - 1}
          style={{
            padding: '8px 16px',
            border: '2px solid #000',
            borderRadius: '4px',
            background: currentDateIndex === availableDates.length - 1 ? '#ccc' : '#fff',
            cursor: currentDateIndex === availableDates.length - 1 ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          Next →
        </button>
        
        <span style={{ fontSize: '14px', color: '#000' }}>
          Date {currentDateIndex + 1} of {availableDates.length}
        </span>
      </div>
      
      {/* Simple Data Display */}
      <div style={{
        background: '#fff',
        border: '3px solid #000',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#000',
          borderBottom: '2px solid #000',
          paddingBottom: '8px'
        }}>
          Index Metrics
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#E8F5E9', border: '2px solid #4CAF50', borderRadius: '4px' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Index Level</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000' }}>
              {closingLevel.toFixed(6)}
            </div>
          </div>
          <div style={{ padding: '16px', background: '#FFF3E0', border: '2px solid #FF9800', borderRadius: '4px' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Divisor</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000' }}>
              {closingDivisor.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Constituents Table */}
      {closingData.length > 0 && (
        <div style={{
          background: '#fff',
          border: '3px solid #000',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h2 style={{ 
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#000',
            borderBottom: '2px solid #000',
            paddingBottom: '8px'
          }}>
            Constituents ({closingData.length})
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #000' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd', fontWeight: 'bold' }}>Instrument</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', fontWeight: 'bold' }}>Quantity</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', fontWeight: 'bold' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', fontWeight: 'bold' }}>Market Value</th>
                </tr>
              </thead>
              <tbody>
                {closingData.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px', border: '1px solid #ddd', color: '#000' }}>
                      {item.instrumentId || 'N/A'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', color: '#000' }}>
                      {item.quantity?.toLocaleString() || 'N/A'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', color: '#000' }}>
                      {item.price?.toFixed(4) || 'N/A'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', color: '#000' }}>
                      {item.marketValue?.toFixed(2) || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {closingData.length === 0 && (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: '#ffebee',
          border: '2px solid #f44336',
          borderRadius: '8px',
          fontSize: '18px',
          color: '#000'
        }}>
          No constituent data available for this date
        </div>
      )}
    </div>
  );
};

export default SimulationResult;
