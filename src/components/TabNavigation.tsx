
import React from 'react';
import { FileText, BarChart2, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const tabs = [
    { id: 'simulation-data', label: 'SIMULATION DATA', icon: FileText },
    { id: 'results', label: 'RESULTS', icon: BarChart2 },
    { id: 'time-series', label: 'TIME SERIES', icon: LineChart },
  ];

  return (
    <div className="border-b border-gray-200">
      <div className="flex space-x-1">
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
                  ? "border-b-2 border-teal-500 text-teal-500" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
