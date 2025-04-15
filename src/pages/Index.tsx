
import React, { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import SimulationResult from '@/components/SimulationResult';

const Index = () => {
  const [activeTab, setActiveTab] = useState('results');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-full mx-auto">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="p-0">
          {activeTab === 'simulation-data' && (
            <div className="p-6">
              <h1 className="text-xl font-medium">Simulation Data</h1>
              <p className="text-gray-500">This tab would contain the simulation data inputs.</p>
            </div>
          )}
          
          {activeTab === 'results' && <SimulationResult />}
          
          {activeTab === 'time-series' && (
            <div className="p-6">
              <h1 className="text-xl font-medium">Time Series</h1>
              <p className="text-gray-500">This tab would contain time series charts and data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
