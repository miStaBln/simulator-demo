import React from 'react';
import { BarChart2, LineChart, Hexagon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  simulationComplete: boolean;
}

const ResultsTabNavigation = ({ activeTab, onTabChange, simulationComplete }: ResultsTabNavigationProps) => {
  const tabs = [
    { id: 'results', label: 'RESULTS', icon: BarChart2 },
    { id: 'time-series', label: 'TIME SERIES', icon: LineChart },
    { id: 'proximity', label: 'SOLACTIVE PROXIMITY INDEX', icon: Hexagon },
  ];

  if (!simulationComplete) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔬</div>
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">
            No Simulation Results
          </h3>
          <p className="text-muted-foreground">
            Configure and run a simulation from the sidebar to view results here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border">
        <div className="flex space-x-1 px-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium transition-colors",
                  isActive 
                    ? "border-b-2 border-primary text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultsTabNavigation;