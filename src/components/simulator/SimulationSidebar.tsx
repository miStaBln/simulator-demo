import React from 'react';
import { FileText, RefreshCw, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import SimulationData from '@/components/SimulationData';

interface SimulationSidebarProps {
  onSimulationComplete: (complete: boolean, stocks: any[], selectedIndex: string) => void;
  shouldReset: boolean;
  onResetComplete: () => void;
  onRefresh: () => void;
}

export function SimulationSidebar({
  onSimulationComplete,
  shouldReset,
  onResetComplete,
  onRefresh
}: SimulationSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar
      className={isCollapsed ? "w-16" : "w-96"}
      collapsible="icon"
      side="left"
    >
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Simulation Setup</h2>
            </div>
          )}
          <div className="flex items-center gap-2">
            {!isCollapsed && (
              <button
                onClick={onRefresh}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                title="Reset simulation data"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
            <SidebarTrigger className="p-2" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {!isCollapsed && (
          <div className="p-4">
            <SimulationData
              onSimulationComplete={onSimulationComplete}
              shouldReset={shouldReset}
              onResetComplete={onResetComplete}
            />
          </div>
        )}
        {isCollapsed && (
          <div className="flex flex-col items-center p-2 gap-2">
            <div className="p-2 rounded-md bg-accent/50">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </div>
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Reset simulation data"
            >
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}