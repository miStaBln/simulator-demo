
import React, { useState } from 'react';
import DatePicker from './DatePicker';
import DataTable from './DataTable';

const SimulationResult = () => {
  const [date, setDate] = useState('11.04.2025');
  
  // Sample data for tables
  const closingData = [
    { ric: 'BLUE.OQ', cas: '', quantity: '236240.7767', price: '5.15', currency: 'USD', fx: '1' },
    { ric: 'VIV.N', cas: '', quantity: '141799.5338', price: '8.58', currency: 'USD', fx: '1' },
    { ric: 'FRGE.N', cas: '', quantity: '1963908.376', price: '0.6195', currency: 'USD', fx: '1' },
    { ric: 'GM.N', cas: '', quantity: '27885.39995', price: '43.63', currency: 'USD', fx: '1' },
    { ric: 'SHOT.OQ', cas: '', quantity: '2663397.548', price: '0.4568', currency: 'USD', fx: '1' },
    { ric: 'TSLA.OQ', cas: '', quantity: '4822.004677', price: '252.31', currency: 'USD', fx: '1' },
    { ric: 'F.N', cas: '', quantity: '130400.8574', price: '9.33', currency: 'USD', fx: '1' },
    { ric: 'ML.N', cas: '', quantity: '14244.70203', price: '85.41', currency: 'USD', fx: '1' },
  ];

  const openingData = [
    { ric: 'BLUE.OQ', cas: '', quantity: '236240.7767', price: '5.15', currency: 'USD', fx: '1' },
    { ric: 'VIV.N', cas: '', quantity: '141799.5338', price: '8.5578459999999968', currency: 'USD', fx: '1' },
    { ric: 'FRGE.N', cas: '', quantity: '1963908.376', price: '0.6195', currency: 'USD', fx: '1' },
    { ric: 'GM.N', cas: '', quantity: '27885.39995', price: '43.63', currency: 'USD', fx: '1' },
    { ric: 'TSLA.OQ', cas: '', quantity: '4822.004677', price: '252.31', currency: 'USD', fx: '1' },
    { ric: 'SHOT.OQ', cas: '', quantity: '2663397.548', price: '0.4568', currency: 'USD', fx: '1' },
    { ric: 'F.N', cas: '', quantity: '130400.8574', price: '9.33', currency: 'USD', fx: '1' },
    { ric: 'ML.N', cas: '', quantity: '14244.70203', price: '85.41', currency: 'USD', fx: '1' },
  ];

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
