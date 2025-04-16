
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Maximize, Star, FileText } from 'lucide-react';
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

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toggleStar, isStarred } = useStarred();
  const navigate = useNavigate();
  
  const indices = [
    { id: '94498', name: 'Solactive Transatlantic Equity Selection EUR PR Index', ticker: 'SOLATSP Index', ric: '.SOLATSP', isin: 'DE000SL0QLK6', family: 'DEFAULT_DEFAULT', currency: 'EUR', owner: 'SOLAC' },
    { id: '94497', name: 'Solactive Transatlantic Equity Selection EUR NTR Index', ticker: 'SOLATSN Index', ric: '.SOLATSN', isin: 'DE000SL0QLL4', family: 'DEFAULT_DEFAULT', currency: 'EUR', owner: 'SOLAC' },
    { id: '94495', name: 'GS BASKET API GSXACHSB PR', ticker: 'GSXACHSB', ric: '.GSXACHSB', isin: 'GSXACHSB', family: 'DEFAULT_LASPEYRE', currency: 'USD', owner: 'GSX' },
    { id: '94490', name: 'GS BASKET API GSSKMBHE PR', ticker: 'GSSKMBHE', ric: '.GSSKMBHE-PR', isin: 'GSSKMBHE', family: 'DEFAULT_LASPEYRE', currency: 'JPY', owner: 'GSX' },
    { id: '94487', name: 'GS BASKET API GSVCCRMD PR', ticker: 'GSVCCRMD', ric: '.GSVCCRMD', isin: 'GSVCCRMD', family: 'DEFAULT_LASPEYRE', currency: 'CNH', owner: 'GSX' },
    { id: '94486', name: 'GS BASKET API GSVCCREM PR', ticker: 'GSVCCREM', ric: '.GSVCCREM', isin: 'GSVCCREM', family: 'DEFAULT_LASPEYRE', currency: 'CNY', owner: 'GSX' },
    { id: '94485', name: 'GS BASKET API GSCBCMIR PR', ticker: 'GSCBCMIR', ric: '.GSCBCMIR', isin: 'GSCBCMIR', family: 'DEFAULT_LASPEYRE', currency: 'CNY', owner: 'GSX' },
    { id: '94483', name: 'GS BASKET API GSVCUITH PR', ticker: 'GSVCUITH', ric: '.GSVCUITH', isin: 'GSVCUITH', family: 'DEFAULT_LASPEYRE', currency: 'USD', owner: 'GSX' },
    { id: '94484', name: 'GS BASKET API GSVCUITS PR', ticker: 'GSVCUITS', ric: '.GSVCUITS', isin: 'GSVCUITS', family: 'DEFAULT_LASPEYRE', currency: 'USD', owner: 'GSX' },
    { id: '94482', name: 'GS BASKET API GSSKJPHR PR', ticker: 'GSSKJPHR', ric: '.GSSKJPHR', isin: 'GSSKJPHR', family: 'DEFAULT_LASPEYRE', currency: 'JPY', owner: 'GSX' },
  ];
  
  const filteredIndices = indices.filter(index => 
    index.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    index.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    index.ric.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewDetails = (index: IndexItem) => {
    navigate('/index-details', { state: { indexData: index } });
  };
  
  return (
    <div className="p-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold mb-2">Index Insights <span className="text-sm font-normal text-gray-500">Prototype</span></h1>
        
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
                placeholder="Search Indices"
                className="pl-10 h-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        
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
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIndices.map((index) => (
                  <TableRow key={index.id}>
                    <TableCell>
                      <button 
                        onClick={() => toggleStar(index as IndexItem)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Star 
                          className={`h-4 w-4 ${isStarred(index.id) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
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
                        onClick={() => viewDetails(index as IndexItem)}
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
      </div>
    </div>
  );
};

export default Inventory;
