
import React, { useState, useEffect } from 'react';
import { Search, X, Download, Filter, ArrowUpDown, Info } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from '@/hooks/use-toast';

// Interface for proximity index data
interface ProximityIndex {
  id: string;
  name: string;
  proximityScore: number;
  currency: string;
  constituents: Array<{
    ric: string;
    weight: string;
  }>;
}

// Generate sample indices with proximity scores
const generateProximityData = (userStocks: Array<{ric: string, weight: string}>) => {
  // Sample Solactive indices
  const indices = [
    { 
      id: 'SOLACTIVE1', 
      name: 'Solactive Tech Index', 
      currency: 'USD',
      constituents: [
        { ric: 'AAPL.OQ', weight: '25' },
        { ric: 'MSFT.OQ', weight: '20' },
        { ric: 'GOOGL.OQ', weight: '18' },
        { ric: 'AMZN.OQ', weight: '22' },
        { ric: 'META.OQ', weight: '15' },
      ]
    },
    { 
      id: 'SOLACTIVE2', 
      name: 'Solactive Energy Index', 
      currency: 'EUR',
      constituents: [
        { ric: 'XOM.N', weight: '22' },
        { ric: 'CVX.N', weight: '20' },
        { ric: 'BP.L', weight: '18' },
        { ric: 'SHEL.L', weight: '20' },
        { ric: 'TTE.PA', weight: '20' },
      ]
    },
    { 
      id: 'SOLACTIVE3', 
      name: 'Solactive Healthcare Index', 
      currency: 'GBP',
      constituents: [
        { ric: 'JNJ.N', weight: '22' },
        { ric: 'PFE.N', weight: '18' },
        { ric: 'MRK.N', weight: '20' },
        { ric: 'NOVN.S', weight: '20' },
        { ric: 'ROG.S', weight: '20' },
      ]
    },
    { 
      id: 'SOLACTIVE4', 
      name: 'Solactive Automotive Index', 
      currency: 'USD',
      constituents: [
        { ric: 'TSLA.OQ', weight: '25' },
        { ric: 'GM.N', weight: '20' },
        { ric: 'F.N', weight: '15' },
        { ric: 'TM.N', weight: '20' },
        { ric: 'VWAGY.PK', weight: '20' },
      ]
    },
    { 
      id: 'SOLACTIVE5', 
      name: 'Solactive Media Index', 
      currency: 'USD',
      constituents: [
        { ric: 'NFLX.OQ', weight: '20' },
        { ric: 'DIS.N', weight: '20' },
        { ric: 'CMCSA.OQ', weight: '15' },
        { ric: 'PARA.OQ', weight: '15' },
        { ric: 'WBD.OQ', weight: '15' },
        { ric: 'META.OQ', weight: '15' },
      ]
    },
    { 
      id: 'SOLACTIVE6', 
      name: 'Solactive Emerging Tech Index', 
      currency: 'USD',
      constituents: [
        { ric: 'TSLA.OQ', weight: '20' },
        { ric: 'NVDA.OQ', weight: '20' },
        { ric: 'AMD.OQ', weight: '15' },
        { ric: 'PLTR.N', weight: '15' },
        { ric: 'COIN.OQ', weight: '15' },
        { ric: 'SQ.N', weight: '15' },
      ]
    },
    { 
      id: 'SOLACTIVE7', 
      name: 'Solactive Specialty Retail Index', 
      currency: 'USD',
      constituents: [
        { ric: 'AMZN.OQ', weight: '20' },
        { ric: 'WMT.N', weight: '15' },
        { ric: 'TGT.N', weight: '15' },
        { ric: 'HD.N', weight: '15' },
        { ric: 'LOW.N', weight: '15' },
        { ric: 'COST.OQ', weight: '20' },
      ]
    },
    { 
      id: 'SOLACTIVE8', 
      name: 'Solactive Fintech Index', 
      currency: 'USD',
      constituents: [
        { ric: 'PYPL.OQ', weight: '20' },
        { ric: 'SQ.N', weight: '15' },
        { ric: 'AFRM.OQ', weight: '15' },
        { ric: 'COIN.OQ', weight: '15' },
        { ric: 'SOFI.OQ', weight: '15' },
        { ric: 'V.N', weight: '20' },
      ]
    }
  ];

  // Calculate proximity score based on overlap with user stocks
  return indices.map(index => {
    // Calculate proximity score (0-100)
    let matchingConstituents = 0;
    let weightSum = 0;
    
    // Count how many of user's stocks are in this index
    userStocks.forEach(userStock => {
      const constituent = index.constituents.find(c => c.ric === userStock.ric);
      if (constituent) {
        matchingConstituents++;
        // Add weighted similarity based on weights
        const userWeight = parseFloat(userStock.weight);
        const indexWeight = parseFloat(constituent.weight);
        const weightDiff = Math.abs(userWeight - indexWeight);
        const weightSimilarity = 100 - (weightDiff / Math.max(userWeight, indexWeight) * 100);
        weightSum += weightSimilarity;
      }
    });
    
    // Calculate final score based on:
    // 1. Percentage of user stocks in this index
    // 2. Average weight similarity of matching constituents
    const coverageScore = (matchingConstituents / userStocks.length) * 100;
    const weightScore = matchingConstituents > 0 ? weightSum / matchingConstituents : 0;
    
    // Final score is weighted average of the two scores
    const proximityScore = Math.round((coverageScore * 0.7 + weightScore * 0.3) * 100) / 100;
    
    return {
      ...index,
      proximityScore
    };
  }).sort((a, b) => b.proximityScore - a.proximityScore); // Sort by proximity score descending
};

interface ProximityIndexDataProps {
  simulationComplete: boolean;
  stocks: Array<{ric: string, weight: string, shares: string}>;
}

const ProximityIndexData = ({ simulationComplete, stocks }: ProximityIndexDataProps) => {
  const [proximityIndices, setProximityIndices] = useState<ProximityIndex[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (simulationComplete && stocks.length > 0) {
      // Generate proximity data based on user stocks
      const proximityData = generateProximityData(stocks);
      setProximityIndices(proximityData);
    }
  }, [simulationComplete, stocks]);

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    
    // Re-sort the data
    setProximityIndices([...proximityIndices].sort((a, b) => {
      return newOrder === 'desc' 
        ? b.proximityScore - a.proximityScore 
        : a.proximityScore - b.proximityScore;
    }));
  };

  const filteredIndices = proximityIndices.filter(index => 
    index.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    index.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    // Create CSV content
    const headers = "Index ID,Index Name,Proximity Score,Currency\n";
    const rows = filteredIndices.map(index => 
      `${index.id},${index.name},${index.proximityScore},${index.currency}`
    ).join("\n");
    const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "solactive_proximity_indices.csv");
    document.body.appendChild(link);
    
    // Trigger download and cleanup
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: "Proximity indices data has been downloaded"
    });
  };

  if (!simulationComplete) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full min-h-[400px]">
        <h2 className="text-lg font-medium mb-4 text-center">Solactive Proximity Index</h2>
        <p className="text-gray-500 text-center">
          Run the simulation first to see similar Solactive indices based on your components.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-medium mb-6">Solactive Proximity Index</h2>
      <div className="bg-white rounded-md shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">Proximity Score</h3>
                    <Info className="h-4 w-4 ml-2 text-gray-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    The proximity score (0-100) measures how similar an index is to your simulation 
                    based on constituent overlap and weight similarity. Higher scores indicate greater similarity.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleExport}
              className="flex items-center px-3 py-1.5 text-green-500 text-sm border border-green-500 rounded hover:bg-green-50"
            >
              <Download className="h-4 w-4 mr-2" />
              EXPORT
            </button>
            
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search indices"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 border rounded text-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Index ID</TableHead>
              <TableHead>Index Name</TableHead>
              <TableHead>
                <button 
                  className="flex items-center space-x-1"
                  onClick={toggleSortOrder}
                >
                  <span>Proximity Score</span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>Currency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIndices.length > 0 ? (
              filteredIndices.map((index) => (
                <TableRow key={index.id}>
                  <TableCell className="font-medium">{index.id}</TableCell>
                  <TableCell>{index.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-full max-w-[200px] bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${index.proximityScore}%` }}
                        ></div>
                      </div>
                      <span>{index.proximityScore.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{index.currency}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No matching indices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProximityIndexData;
