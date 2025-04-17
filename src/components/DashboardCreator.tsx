
import React from 'react';
import { PlusCircle, Upload, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const DashboardCreator = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Index Insights <span className="text-sm text-gray-500 font-normal">Prototype</span></h1>
        
        <div className="flex space-x-4 mb-6">
          <div className="w-40">
            <label className="block text-sm mb-1">Identifier Type</label>
            <Select defaultValue="RIC">
              <SelectTrigger>
                <SelectValue placeholder="RIC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RIC">RIC</SelectItem>
                <SelectItem value="TICKER">TICKER</SelectItem>
                <SelectItem value="ISIN">ISIN</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm mb-1">Search Indices</label>
            <Input placeholder="Search Indices" className="w-full" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 border border-dashed">
          <CardContent className="p-0 flex flex-col items-center justify-center text-center h-80">
            <h2 className="text-xl font-medium mb-2">Start your new dashboard by adding a visualization</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Select a data source and then query and visualize your data with charts, stats and tables or create lists, markdowns and other widgets.
            </p>
            
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add visualization
            </Button>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-8">
          <Card className="p-6 border border-dashed">
            <CardContent className="p-0 flex flex-col items-center justify-center text-center h-36">
              <h3 className="text-lg font-medium mb-1">Import panel</h3>
              <p className="text-gray-500 mb-4 text-sm">
                Add visualizations that are shared with other dashboards.
              </p>
              
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add library panel
              </Button>
            </CardContent>
          </Card>
          
          <Card className="p-6 border border-dashed">
            <CardContent className="p-0 flex flex-col items-center justify-center text-center h-36">
              <h3 className="text-lg font-medium mb-1">Import a dashboard</h3>              
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardCreator;
