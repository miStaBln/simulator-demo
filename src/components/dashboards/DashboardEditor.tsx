
import React, { useState, useEffect } from 'react';
import { Layout, ChevronLeft, Plus, Calendar, Star, Bell, GripVertical, X, Maximize2, Minimize2 } from 'lucide-react';
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
import { IndexEventsWidget } from '@/pages/Events';
import { useStarred } from '@/contexts/StarredContext';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type WidgetType = 'starred' | 'events' | 'indexEvents';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size?: 'small' | 'medium' | 'large';
}

interface SortableWidgetProps {
  widget: Widget;
  children: React.ReactNode;
  onRemove: () => void;
  onSizeChange: (size: 'small' | 'medium' | 'large') => void;
}

const SortableWidget = ({ widget, children, onRemove, onSizeChange }: SortableWidgetProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: widget.id,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sizeClass = widget.size === 'small' 
    ? 'col-span-1 h-64' 
    : widget.size === 'large' 
      ? 'col-span-2 h-96' 
      : 'col-span-1 h-80';

  return (
    <div ref={setNodeRef} style={style} className={sizeClass}>
      <div className="border rounded-lg shadow-sm h-full overflow-hidden bg-white flex flex-col">
        <div className="flex items-center justify-between p-3 border-b bg-gray-50">
          <div className="flex items-center">
            <div {...attributes} {...listeners} className="cursor-move mr-2">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <h3 className="font-medium text-sm">{widget.title}</h3>
          </div>
          <div className="flex items-center gap-1">
            {widget.size !== 'small' && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onSizeChange('small')}>
                <Minimize2 className="h-3 w-3" />
              </Button>
            )}
            {widget.size !== 'large' && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onSizeChange('large')}>
                <Maximize2 className="h-3 w-3" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-red-500" onClick={onRemove}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

interface DashboardEditorProps {
  onSave: (name: string, widgets: Widget[]) => void;
}

const DashboardEditor: React.FC<DashboardEditorProps> = ({ onSave }) => {
  const navigate = useNavigate();
  const [dashboardName, setDashboardName] = useState('');
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { starredIndices } = useStarred();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const addWidget = (type: WidgetType) => {
    const titles = {
      starred: 'Starred Indices',
      events: 'Upcoming Events',
      indexEvents: 'Index Events',
    };
    
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      title: titles[type],
      size: 'medium'
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };

  const changeWidgetSize = (id: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, size } : widget
    ));
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

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'starred':
        return <StarredIndicesWidget />;
      case 'events':
        return <UpcomingEventsWidget />;
      case 'indexEvents':
        return <IndexEventsWidget indices={starredIndices} />;
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
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => addWidget('indexEvents')}
              >
                <Bell className="mr-2 h-4 w-4" />
                Index Events
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
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => addWidget('indexEvents')}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Index Events
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <DndContext 
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-4">
              {widgets.map((widget) => (
                <SortableWidget 
                  key={widget.id} 
                  widget={widget}
                  onRemove={() => removeWidget(widget.id)}
                  onSizeChange={(size) => changeWidgetSize(widget.id, size)}
                >
                  {renderWidget(widget)}
                </SortableWidget>
              ))}
            </div>
          </SortableContext>
          
          <DragOverlay>
            {activeId ? (
              <div className="border rounded-lg shadow-lg h-80 w-full bg-white opacity-70">
                <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                  <h3 className="font-medium text-sm">
                    {widgets.find(w => w.id === activeId)?.title}
                  </h3>
                </div>
                <div className="p-4 h-full"></div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default DashboardEditor;
