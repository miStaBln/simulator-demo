
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SimulationSidebar } from '@/components/simulator/SimulationSidebar';
import ResultsTabNavigation from '@/components/simulator/ResultsTabNavigation';
import SimulationResult from '@/components/SimulationResult';
import TimeSeriesData from '@/components/TimeSeriesData';
import ProximityIndexData from '@/components/ProximityIndexData';
import { toast } from '@/hooks/use-toast';

const initialSimulationState = {
  stocks: [],
  selectedIndex: '',
  complete: false
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'results');
  const [simulationState, setSimulationState] = useState(initialSimulationState);
  const [shouldResetSimulation, setShouldResetSimulation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Index - State changed:', { activeTab, simulationComplete: simulationState.complete });
  }, [activeTab, simulationState.complete]);

  useEffect(() => {
    if (tabFromUrl && simulationState.complete) {
      setActiveTab(tabFromUrl);
    } else if (tabFromUrl && !simulationState.complete) {
      // If trying to access results without simulation, stay on results but show placeholder
      setActiveTab('results');
      navigate('/simulator?tab=results');
    }
  }, [tabFromUrl, simulationState.complete]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/simulator?tab=${tab}`);
  };

  const handleSimulationComplete = (isComplete: boolean, stocks: any[], selectedIdx: string = '') => {
    console.log('Index - handleSimulationComplete called:', { isComplete, stocks, selectedIdx });
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
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <SimulationSidebar
          onSimulationComplete={handleSimulationComplete}
          shouldReset={shouldResetSimulation}
          onResetComplete={handleResetComplete}
          onRefresh={handleRefresh}
        />
        
        <SidebarInset className="flex-1">
          <div className="flex flex-col h-full">
            <ResultsTabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
              simulationComplete={simulationState.complete}
            />
            
            <div className="flex-1 overflow-auto">
              {activeTab === 'results' && simulationState.complete && (
                <div className="p-6">
                  <SimulationResult />
                </div>
              )}
              {activeTab === 'results' && !simulationState.complete && (
                <div className="p-6 text-center text-muted-foreground">
                  Please run a simulation first to view results.
                </div>
              )}
              {activeTab === 'time-series' && simulationState.complete && (
                <div className="p-6">
                  <TimeSeriesData />
                </div>
              )}
              {activeTab === 'time-series' && !simulationState.complete && (
                <div className="p-6 text-center text-muted-foreground">
                  Please run a simulation first to view time series data.
                </div>
              )}
              {activeTab === 'proximity' && simulationState.complete && (
                <div className="p-6">
                  <ProximityIndexData 
                    simulationComplete={simulationState.complete} 
                    stocks={simulationState.stocks} 
                  />
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
