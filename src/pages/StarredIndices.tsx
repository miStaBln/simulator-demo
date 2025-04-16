
import React, { useState } from 'react';
import { Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useStarred } from '@/contexts/StarredContext';

const StarredIndices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { starredIndices, toggleStar, isStarred } = useStarred();
  
  const filteredIndices = starredIndices.filter(index => 
    index.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    index.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    index.ric.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="p-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold mb-2">Starred Indices</h1>
        
        <div className="flex justify-between mb-8">
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
        
        {filteredIndices.length > 0 ? (
          <div className="bg-white rounded-md shadow overflow-hidden">
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
    </div>
  );
};

export default StarredIndices;
