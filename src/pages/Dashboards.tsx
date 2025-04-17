
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Grid3X3, Settings, MoreHorizontal, Pencil, Trash2, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import DashboardCreator from '@/components/DashboardCreator';
import { Widget } from '@/components/dashboards/DashboardEditor';

interface Dashboard {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  indices: number;
  widgets: Widget[];
}

const Dashboards = () => {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<Dashboard[]>(() => {
    const savedDashboards = localStorage.getItem('dashboards');
    return savedDashboards ? JSON.parse(savedDashboards) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('dashboards', JSON.stringify(dashboards));
  }, [dashboards]);
  
  const createNewDashboard = (name: string, description: string = "", widgets: Widget[] = []) => {
    const newDashboard: Dashboard = {
      id: `dash-${Date.now()}`,
      name,
      description,
      lastModified: new Date().toISOString(),
      indices: 0,
      widgets
    };
    
    setDashboards([...dashboards, newDashboard]);
    toast({
      title: "Dashboard created",
      description: `${name} has been created successfully.`
    });
  };
  
  const deleteDashboard = (id: string) => {
    const dashboard = dashboards.find(d => d.id === id);
    setDashboards(dashboards.filter(dash => dash.id !== id));
    
    if (dashboard) {
      toast({
        title: "Dashboard deleted",
        description: `${dashboard.name} has been removed.`
      });
    }
  };
  
  const viewDashboard = (dashboard: Dashboard) => {
    // Future implementation: navigate to a dashboard viewer
    toast({
      title: "View dashboard",
      description: "This feature is coming soon."
    });
  };
  
  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">My Dashboards</h1>
          
          {dashboards.length > 0 && (
            <Button 
              onClick={() => navigate('/dashboard-editor')} 
              className="bg-teal-500 hover:bg-teal-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Dashboard
            </Button>
          )}
        </div>
      </div>
      
      {dashboards.length === 0 ? (
        <DashboardCreator />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboards.map(dashboard => (
            <Card key={dashboard.id} className="overflow-hidden">
              <div 
                className="h-32 bg-gray-100 flex items-center justify-center cursor-pointer"
                onClick={() => viewDashboard(dashboard)}
              >
                <Layout className="h-12 w-12 text-gray-400" />
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{dashboard.name}</h3>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => viewDashboard(dashboard)}>
                        <Layout className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard-editor', { state: { dashboard } })}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteDashboard(dashboard.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <p className="text-sm text-gray-500 mb-3">{dashboard.description || 'No description'}</p>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{dashboard.widgets.length} widgets</span>
                  <span>Modified {new Date(dashboard.lastModified).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboards;
