
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TabNavigation from '@/components/TabNavigation';
import SimulationData from '@/components/SimulationData';
import SimulationResult from '@/components/SimulationResult';
import TimeSeriesData from '@/components/TimeSeriesData';
import ProximityIndexData from '@/components/ProximityIndexData';
import { toast } from '@/hooks/use-toast';
import { SimulationService } from '@/services/simulationService';

const initialSimulationState = {
  stocks: [],
  selectedIndex: '',
  complete: false
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'simulation-data');
  const [simulationState, setSimulationState] = useState(initialSimulationState);
  const [shouldResetSimulation, setShouldResetSimulation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (tabFromUrl) {
      // Only allow navigation to other tabs if simulation is complete
      if (tabFromUrl !== 'simulation-data' && !simulationState.complete) {
        navigate('/simulator?tab=simulation-data');
        toast({
          title: "Simulation Required",
          description: "Please run a simulation first to view results",
          variant: "destructive",
        });
      } else {
        setActiveTab(tabFromUrl);
      }
    }
  }, [tabFromUrl, simulationState.complete]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/simulator?tab=${tab}`);
  };

  const handleSimulationComplete = (isComplete: boolean, stocks: any[], selectedIdx: string = '') => {
    setSimulationState({
      complete: isComplete,
      stocks,
      selectedIndex: selectedIdx,
    });
  };

  const handleRefresh = () => {
    setSimulationState(initialSimulationState);
    setShouldResetSimulation(true);
    toast({
      title: "Simulation Reset",
      description: "All simulation data has been reset",
    });
  };

  const handleResetComplete = () => {
    setShouldResetSimulation(false);
  };

  return (
    <div className="flex flex-col h-full">
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        simulationComplete={simulationState.complete}
        onRefresh={handleRefresh}
      />
      <div className="flex-1 overflow-auto">
        {activeTab === 'simulation-data' && (
          <SimulationData 
            onSimulationComplete={handleSimulationComplete}
            shouldReset={shouldResetSimulation}
            onResetComplete={handleResetComplete}
          />
        )}
        {activeTab === 'results' && simulationState.complete && <SimulationResult />}
        {activeTab === 'time-series' && simulationState.complete && (
          <TimeSeriesData 
            simulationComplete={simulationState.complete} 
            selectedIndex={simulationState.selectedIndex} 
          />
        )}
        {activeTab === 'proximity' && simulationState.complete && (
          <ProximityIndexData 
            simulationComplete={simulationState.complete} 
            stocks={simulationState.stocks} 
          />
        )}
      </div>
    </div>
  );
};

export default Index;
