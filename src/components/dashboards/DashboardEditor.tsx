
import React, { useState } from 'react';
import { Layout, ChevronLeft, Plus, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import DashboardWindow from './DashboardWindow';
import StarredIndicesWidget from './StarredIndicesWidget';
import UpcomingEventsWidget from './UpcomingEventsWidget';

export type WidgetType = 'starred' | 'events';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
}

interface DashboardEditorProps {
  onSave: (name: string, widgets: Widget[]) => void;
}

const DashboardEditor: React.FC<DashboardEditorProps> = ({ onSave }) => {
  const navigate = useNavigate();
  const [dashboardName, setDashboardName] = useState('');
  const [widgets, setWidgets] = useState<Widget[]>([]);

  const addWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      title: type === 'starred' ? 'Starred Indices' : 'Upcoming Events'
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };

  const handleSave = () => {
    if (!dashboardName.trim()) {
      toast({
        title: "Dashboard name required",
        description: "Please provide a name for your dashboard.",
        variant: "destructive"
      });
      return;
    }
    
    onSave(dashboardName, widgets);
    navigate('/dashboards');
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'starred':
        return <StarredIndicesWidget />;
      case 'events':
        return <UpcomingEventsWidget />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboards')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Dashboard Editor</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/dashboards')}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Dashboard
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm mb-1">Dashboard Name</label>
        <Input 
          value={dashboardName}
          onChange={(e) => setDashboardName(e.target.value)}
          placeholder="Enter dashboard name"
          className="max-w-md"
        />
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium">Widgets</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Widget
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => addWidget('starred')}
              >
                <Star className="mr-2 h-4 w-4" />
                Starred Indices
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => addWidget('events')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Upcoming Events
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {widgets.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center">
          <Layout className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Your dashboard is empty</h3>
          <p className="text-gray-500 mb-4 max-w-md">
            Add widgets to create your custom dashboard view.
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Widget
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => addWidget('starred')}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Starred Indices
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => addWidget('events')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Upcoming Events
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {widgets.map((widget) => (
            <div key={widget.id} className="h-64">
              <DashboardWindow 
                title={widget.title}
                onRemove={() => removeWidget(widget.id)}
              >
                {renderWidget(widget)}
              </DashboardWindow>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardEditor;
