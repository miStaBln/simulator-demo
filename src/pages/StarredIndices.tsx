
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, FileText, Filter, SlidersHorizontal, Maximize } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useStarred, IndexItem } from '@/contexts/StarredContext';
import IndexLevelDetails from '@/components/IndexLevelDetails';

const StarredIndices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<IndexItem | null>(null);
  const [isLevelDetailsOpen, setIsLevelDetailsOpen] = useState(false);
  const { starredIndices, toggleStar, isStarred } = useStarred();
  const navigate = useNavigate();
  
  // Add mock levels to starred indices
  const starredWithLevels = starredIndices.map(index => ({
    ...index,
    level: parseFloat((Math.random() * 500 + 100).toFixed(2))
  }));
  
  const filteredIndices = starredWithLevels.filter(index => 
    index.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    index.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    index.ric.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const viewDetails = (index: IndexItem) => {
    navigate('/index-details', { state: { indexData: index } });
  };
  
  const openLevelDetails = (index: any) => {
    setSelectedIndex(index);
    setIsLevelDetailsOpen(true);
  };
  
  return (
    <div className="p-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold mb-2">Starred Indices</h1>
        
        <div className="flex justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="flex items-center border rounded p-2 w-40">
                <span className="text-sm font-medium">RIC</span>
                <SlidersHorizontal className="ml-auto h-4 w-4" />
              </div>
            </div>
            
            <div className="relative w-64">
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Starred Indices"
                className="pl-10 h-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        
        {filteredIndices.length > 0 ? (
          <div className="bg-white rounded-md shadow overflow-hidden">
            <div className="flex justify-end p-2 border-b">
              <Search className="h-5 w-5 text-gray-500 mr-2" />
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <Maximize className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead className="w-24">Giant id</TableHead>
                    <TableHead className="w-64">Name</TableHead>
                    <TableHead className="w-32">Ticker</TableHead>
                    <TableHead className="w-32">RIC</TableHead>
                    <TableHead className="w-32">ISIN</TableHead>
                    <TableHead className="w-40">Family</TableHead>
                    <TableHead className="w-24">Currency</TableHead>
                    <TableHead className="w-24">Owner</TableHead>
                    <TableHead className="w-24">Level</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIndices.map((index) => (
                    <TableRow key={index.id}>
                      <TableCell>
                        <button 
                          onClick={() => toggleStar(index)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <Star 
                            className="h-4 w-4 text-yellow-400 fill-yellow-400" 
                          />
                        </button>
                      </TableCell>
                      <TableCell>{index.id}</TableCell>
                      <TableCell>{index.name}</TableCell>
                      <TableCell>{index.ticker}</TableCell>
                      <TableCell>{index.ric}</TableCell>
                      <TableCell>{index.isin}</TableCell>
                      <TableCell>{index.family}</TableCell>
                      <TableCell>{index.currency}</TableCell>
                      <TableCell>{index.owner}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openLevelDetails(index)}
                          className="font-medium text-blue-500 hover:text-blue-700"
                        >
                          {index.level?.toFixed(2)}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => viewDetails(index)}
                          size="sm"
                          variant="secondary" 
                          className="bg-teal-500 hover:bg-teal-600 text-white"
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md">
            <p className="text-gray-500">No starred indices yet. Star indices from the inventory page to see them here.</p>
          </div>
        )}
      </div>

      <IndexLevelDetails 
        open={isLevelDetailsOpen}
        onOpenChange={setIsLevelDetailsOpen}
        index={selectedIndex}
      />
    </div>
  );
};

export default StarredIndices;
