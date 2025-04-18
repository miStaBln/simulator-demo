
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TabNavigation from '@/components/TabNavigation';
import SimulationData from '@/components/SimulationData';
import SimulationResult from '@/components/SimulationResult';
import TimeSeriesData from '@/components/TimeSeriesData';
import ProximityIndexData from '@/components/ProximityIndexData';

const Index = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'simulation-data');
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [simulationStocks, setSimulationStocks] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/simulator?tab=${tab}`);
  };

  const handleSimulationComplete = (isComplete: boolean, stocks: any[], selectedIdx: string = '') => {
    setSimulationComplete(isComplete);
    setSimulationStocks(stocks);
    setSelectedIndex(selectedIdx);
  };

  return (
    <div className="flex flex-col h-full">
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex-1 overflow-auto">
        {activeTab === 'simulation-data' && (
          <SimulationData onSimulationComplete={handleSimulationComplete} />
        )}
        {activeTab === 'results' && <SimulationResult />}
        {activeTab === 'time-series' && (
          <TimeSeriesData 
            simulationComplete={simulationComplete} 
            selectedIndex={selectedIndex} 
          />
        )}
        {activeTab === 'proximity' && (
          <ProximityIndexData 
            simulationComplete={simulationComplete} 
            stocks={simulationStocks} 
          />
        )}
      </div>
    </div>
  );
};

export default Index;
