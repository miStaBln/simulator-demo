
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  FileBarChart, 
  Building, 
  ArrowLeft,
  BarChart2,
  Clock
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStarred, IndexItem } from '@/contexts/StarredContext';
import IndexTimeline from '@/components/IndexTimeline';

const IndexDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const indexData = state?.indexData as IndexItem;
  const [activeTimelineEvent, setActiveTimelineEvent] = useState<string | null>(null);
  
  if (!indexData) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4">No index data found</div>
        <Button onClick={() => navigate('/inventory')}>
          <ArrowLeft className="mr-2" />
          Return to Inventory
        </Button>
      </div>
    );
  }

  // Add additional data for display
  const extendedData = {
    ...indexData,
    status: 'PROD',
    startDate: '2025-04-16',
    assetClass: 'Equity',
    indexType: 'PERFORMANCE',
    region: 'Europe/Berlin'
  };

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate('/inventory')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold">Index Insights <span className="text-sm font-normal text-gray-500">Prototype</span></h1>
        </div>
        
        <Tabs defaultValue="index-details" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="index-details" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              INDEX DETAILS
            </TabsTrigger>
            <TabsTrigger value="constituents" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              CONSTITUENTS
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center">
              <FileBarChart className="mr-2 h-4 w-4" />
              REPORT
            </TabsTrigger>
            <TabsTrigger value="corporate-actions" className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              CORPORATE ACTIONS
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              INDEX TIMELINE
            </TabsTrigger>
          </TabsList>

          <TabsContent value="index-details" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Index Details</h2>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    ANALYSE
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Index Identifiers</h3>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 w-1/3 text-gray-600">Gigant Id</td>
                          <td className="py-3">{extendedData.id}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 w-1/3 text-gray-600">Name</td>
                          <td className="py-3">{extendedData.name}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 w-1/3 text-gray-600">Ticker</td>
                          <td className="py-3">{extendedData.ticker}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 w-1/3 text-gray-600">RIC</td>
                          <td className="py-3">{extendedData.ric}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 w-1/3 text-gray-600">ISIN</td>
                          <td className="py-3">{extendedData.isin}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Index Calculation Parameters</h3>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 w-1/3 text-gray-600">Currency</td>
                          <td className="py-3">{extendedData.currency}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Index Settings</h3>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 w-1/3 text-gray-600">Owner</td>
                          <td className="py-3">{extendedData.owner}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 w-1/3 text-gray-600">Status</td>
                          <td className="py-3">{extendedData.status}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 w-1/3 text-gray-600">Start Date</td>
                          <td className="py-3">{extendedData.startDate}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 w-1/3 text-gray-600">Index Family</td>
                          <td className="py-3">{extendedData.family}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 w-1/3 text-gray-600">Asset Class</td>
                          <td className="py-3">{extendedData.assetClass}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 w-1/3 text-gray-600">Index Type</td>
                          <td className="py-3">{extendedData.indexType}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 w-1/3 text-gray-600">Region</td>
                          <td className="py-3">{extendedData.region}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="constituents">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4">Constituents</h2>
                <p className="text-gray-500">This tab is not implemented in the prototype.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4">Report</h2>
                <p className="text-gray-500">This tab is not implemented in the prototype.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="corporate-actions">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4">Corporate Actions</h2>
                <p className="text-gray-500">This tab is not implemented in the prototype.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeline">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4">Index Timeline</h2>
                <IndexTimeline 
                  indexData={extendedData} 
                  activeEvent={activeTimelineEvent}
                  setActiveEvent={setActiveTimelineEvent}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IndexDetails;
