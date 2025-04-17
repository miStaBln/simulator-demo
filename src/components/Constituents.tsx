
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { IndexItem } from '@/contexts/StarredContext';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

interface ConstituentsProps {
  indexData: IndexItem;
}

interface Constituent {
  ric: string;
  name: string;
  shares: string;
  weight: string;
  price: string;
  currency: string;
  mcap: string;
  sector: string;
  country: string;
}

const Constituents: React.FC<ConstituentsProps> = ({ indexData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for constituents
  const constituents: Constituent[] = [
    {
      ric: 'TSLA.OQ',
      name: 'Tesla Inc',
      shares: '4822.004677',
      weight: '21.45%',
      price: '252.31',
      currency: 'USD',
      mcap: '800.23B',
      sector: 'Consumer Discretionary',
      country: 'United States'
    },
    {
      ric: 'BLUE.OQ',
      name: 'Blue Inc',
      shares: '236240.7767',
      weight: '18.32%',
      price: '5.15',
      currency: 'USD',
      mcap: '12.76B',
      sector: 'Technology',
      country: 'United States'
    },
    {
      ric: 'VIV.N',
      name: 'Vivid Corp',
      shares: '141799.5338',
      weight: '17.21%',
      price: '8.58',
      currency: 'USD',
      mcap: '9.45B',
      sector: 'Communication Services',
      country: 'United States'
    },
    {
      ric: 'FRGE.N',
      name: 'Forge Industries',
      shares: '1963908.376',
      weight: '15.67%',
      price: '0.6195',
      currency: 'USD',
      mcap: '4.32B',
      sector: 'Industrials',
      country: 'Canada'
    },
    {
      ric: 'GM.N',
      name: 'General Motors Co',
      shares: '27885.39995',
      weight: '14.31%',
      price: '43.63',
      currency: 'USD',
      mcap: '51.36B',
      sector: 'Consumer Discretionary',
      country: 'United States'
    },
    {
      ric: 'SHOT.OQ',
      name: 'ShotTech Ltd',
      shares: '2663397.548',
      weight: '13.04%',
      price: '0.4568',
      currency: 'USD',
      mcap: '1.58B',
      sector: 'Technology',
      country: 'United Kingdom'
    }
  ];
  
  const filteredConstituents = constituents.filter(
    constituent => 
      constituent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      constituent.ric.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Index Constituents</h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Constituents"
                className="pl-10 h-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            
            <Filter className="h-5 w-5 text-gray-500" />
            <SlidersHorizontal className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RIC</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Shares</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Country</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConstituents.map((constituent, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{constituent.ric}</TableCell>
                <TableCell>{constituent.name}</TableCell>
                <TableCell>{constituent.shares}</TableCell>
                <TableCell>{constituent.weight}</TableCell>
                <TableCell>{constituent.price}</TableCell>
                <TableCell>{constituent.currency}</TableCell>
                <TableCell>{constituent.mcap}</TableCell>
                <TableCell>{constituent.sector}</TableCell>
                <TableCell>{constituent.country}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Constituents;
