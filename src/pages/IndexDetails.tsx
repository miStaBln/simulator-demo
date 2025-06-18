

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  FileBarChart, 
  Building, 
  ArrowLeft,
  Download,
  Clock,
  LineChart,
  Activity,
  History,
  TrendingUp
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useStarred, IndexItem } from '@/contexts/StarredContext';
import IndexTimeline from '@/components/IndexTimeline';
import IndexReport from '@/components/IndexReport';
import CorporateActions from '@/components/CorporateActions';
import Constituents from '@/components/Constituents';
import TickHistory from '@/components/TickHistory';
import IndexHistory from '@/components/IndexHistory';
import IndexKeyFigures from '@/components/IndexKeyFigures';

const IndexDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state } = location;
  const indexData = state?.indexData as IndexItem;
  const defaultTab = state?.defaultTab || 'index-details';
  const [showKeyFigures, setShowKeyFigures] = useState(false);
  
  const handleDownloadGuideline = () => {
    // TODO: Replace with actual PDF download logic when available
    // For now, show a toast indicating no guideline is available
    toast({
      title: "Guideline Download",
      description: "No guideline PDF is currently available for this index.",
      variant: "default"
    });
  };

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2"
              onClick={() => navigate('/events')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Events
            </Button>
            <h1 className="text-2xl font-semibold">Index Insights <span className="text-sm font-normal text-gray-500">Prototype</span></h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={() => setShowKeyFigures(true)}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            INDEX KEY FIGURES
          </Button>
        </div>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="index-details" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              INDEX DETAILS
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              INDEX TIMELINE
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
            <TabsTrigger value="tick-history" className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              TICK HISTORY
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="mr-2 h-4 w-4" />
              HISTORY
            </TabsTrigger>
          </TabsList>

          <TabsContent value="index-details" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Index Details</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center"
                    onClick={handleDownloadGuideline}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    DOWNLOAD GUIDELINE
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

          <TabsContent value="timeline">
            <IndexTimeline indexData={extendedData} />
          </TabsContent>

          <TabsContent value="constituents">
            <Constituents indexData={extendedData} />
          </TabsContent>

          <TabsContent value="report">
            <IndexReport indexData={extendedData} />
          </TabsContent>

          <TabsContent value="corporate-actions">
            <CorporateActions indexData={extendedData} />
          </TabsContent>
          
          <TabsContent value="tick-history">
            <TickHistory indexData={extendedData} />
          </TabsContent>

          <TabsContent value="history">
            <IndexHistory indexData={extendedData} />
          </TabsContent>
        </Tabs>

        <IndexKeyFigures 
          indexData={extendedData} 
          open={showKeyFigures} 
          onOpenChange={setShowKeyFigures}
        />
      </div>
    </div>
  );
};

export default IndexDetails;

