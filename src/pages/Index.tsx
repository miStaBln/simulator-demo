
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SimulationSidebar } from '@/components/simulator/SimulationSidebar';
import ResultsTabNavigation from '@/components/simulator/ResultsTabNavigation';
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
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'results');
  const [simulationState, setSimulationState] = useState(initialSimulationState);
  const [shouldResetSimulation, setShouldResetSimulation] = useState(false);
  const navigate = useNavigate();

  // Check if simulation data exists
  const hasSimulationData = () => {
    const dates = SimulationService.getAvailableDates();
    console.log('[Index] hasSimulationData check, dates:', dates, 'length:', dates.length);
    return dates.length > 0;
  };

  console.log('[Index] Rendering, activeTab:', activeTab, 'hasSimulationData:', hasSimulationData());

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
    setSimulationState({
      complete: isComplete,
      stocks,
      selectedIndex: selectedIdx,
    });
  };

  const handleRefresh = () => {
    setSimulationState(initialSimulationState);
    setShouldResetSimulation(true);
    SimulationService.clearResults();
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
        
        <SidebarInset style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          width: '100%',
          overflow: 'visible',
          position: 'relative'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            width: '100%',
            overflow: 'visible'
          }}>
            <ResultsTabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
              simulationComplete={hasSimulationData()}
            />
            
            <div style={{ 
              flex: 1, 
              overflow: 'auto', 
              width: '100%', 
              display: 'block',
              position: 'relative'
            }}>
              
              {activeTab === 'results' && hasSimulationData() && (
                <>
                  {console.log('[Index] Rendering SimulationResult component NOW')}
                  <div style={{ 
                    width: '100%', 
                    minHeight: '100vh', 
                    display: 'block', 
                    position: 'relative',
                    padding: '20px',
                    background: '#f0f0f0',
                    overflow: 'visible'
                  }}>
                    <SimulationResult />
                  </div>
                </>
              )}
              {activeTab === 'results' && !hasSimulationData() && (
                <div className="p-6 text-center text-muted-foreground">
                  Please run a simulation first to view results.
                </div>
              )}
              {activeTab === 'time-series' && hasSimulationData() && (
                <div className="p-6">
                  <TimeSeriesData />
                </div>
              )}
              {activeTab === 'time-series' && !hasSimulationData() && (
                <div className="p-6 text-center text-muted-foreground">
                  Please run a simulation first to view time series data.
                </div>
              )}
              {activeTab === 'proximity' && hasSimulationData() && (
                <div className="p-6">
                  <ProximityIndexData 
                    simulationComplete={hasSimulationData()} 
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
