
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TabNavigation from '@/components/TabNavigation';
import SimulationData from '@/components/SimulationData';
import SimulationResult from '@/components/SimulationResult';
import TimeSeriesData from '@/components/TimeSeriesData';

const Index = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'simulation-data');
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

  return (
    <div className="flex flex-col h-full">
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex-1 overflow-auto">
        {activeTab === 'simulation-data' && <SimulationData />}
        {activeTab === 'results' && <SimulationResult />}
        {activeTab === 'time-series' && <TimeSeriesData />}
      </div>
    </div>
  );
};

export default Index;
