
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Grid3X3, Settings, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import DashboardCreator from '@/components/DashboardCreator';

interface Dashboard {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  indices: number;
}

const Dashboards = () => {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  
  // For the prototype, we'll start with an empty list to show the dashboard creator
  
  const createNewDashboard = (name: string, description: string) => {
    const newDashboard: Dashboard = {
      id: `dash-${dashboards.length + 1}`,
      name,
      description,
      lastModified: new Date().toISOString(),
      indices: 0
    };
    
    setDashboards([...dashboards, newDashboard]);
  };
  
  const deleteDashboard = (id: string) => {
    setDashboards(dashboards.filter(dash => dash.id !== id));
  };
  
  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">My Dashboards</h1>
          
          {dashboards.length > 0 && (
            <Button 
              onClick={() => setDashboards([])} 
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
              <div className="h-32 bg-gray-100 flex items-center justify-center">
                <Grid3X3 className="h-12 w-12 text-gray-400" />
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
                      <DropdownMenuItem>
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
                
                <p className="text-sm text-gray-500 mb-3">{dashboard.description}</p>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{dashboard.indices} indices</span>
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
