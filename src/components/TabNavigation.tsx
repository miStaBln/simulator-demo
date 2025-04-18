
import React from 'react';
import { FileText, BarChart2, LineChart, Hexagon, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  simulationComplete: boolean;
  onRefresh?: () => void;
}

const TabNavigation = ({ activeTab, onTabChange, simulationComplete, onRefresh }: TabNavigationProps) => {
  const tabs = [
    { id: 'simulation-data', label: 'SIMULATION DATA', icon: FileText, alwaysEnabled: true },
    { id: 'results', label: 'RESULTS', icon: BarChart2, alwaysEnabled: false },
    { id: 'time-series', label: 'TIME SERIES', icon: LineChart, alwaysEnabled: false },
    { id: 'proximity', label: 'SOLACTIVE PROXIMITY INDEX', icon: Hexagon, alwaysEnabled: false },
  ];

  return (
    <div className="border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isDisabled = !tab.alwaysEnabled && !simulationComplete;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && onTabChange(tab.id)}
                disabled={isDisabled}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium transition-colors",
                  isActive 
                    ? "border-b-2 border-teal-500 text-teal-500" 
                    : isDisabled
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        {activeTab === 'simulation-data' && (
          <button
            onClick={onRefresh}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Reset simulation data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;
