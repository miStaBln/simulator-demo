
import React from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IndexItem } from '@/contexts/StarredContext';

interface ConstituentData {
  ric: string;
  lastPrice: number;
  lastFx: number;
  weight: number;
}

interface IndexLevelDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  index: IndexItem | null;
}

const IndexLevelDetails = ({ open, onOpenChange, index }: IndexLevelDetailsProps) => {
  // Mock data for constituents
  const mockConstituents: ConstituentData[] = [
    { ric: 'AAPL.O', lastPrice: 187.35, lastFx: 1.0, weight: 0.35 },
    { ric: 'MSFT.O', lastPrice: 415.22, lastFx: 1.0, weight: 0.25 },
    { ric: 'AMZN.O', lastPrice: 184.67, lastFx: 1.0, weight: 0.20 },
    { ric: 'GOOGL.O', lastPrice: 175.89, lastFx: 1.0, weight: 0.15 },
    { ric: 'META.O', lastPrice: 476.10, lastFx: 1.0, weight: 0.05 },
  ];

  // Calculate total market cap
  const totalMarketCap = mockConstituents.reduce(
    (sum, constituent) => sum + constituent.lastPrice * constituent.weight,
    0
  );

  // Mock divisor
  const divisor = 12.5;

  // Calculate index level
  const indexLevel = totalMarketCap / divisor;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Index Level Calculation - {index?.name}</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Current Level</h3>
              <p className="text-2xl font-bold">{indexLevel.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Divisor</h3>
              <p className="text-2xl font-bold">{divisor.toFixed(4)}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">Constituents</h3>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RIC</TableHead>
                    <TableHead className="text-right">Last Price</TableHead>
                    <TableHead className="text-right">Last FX</TableHead>
                    <TableHead className="text-right">Weight</TableHead>
                    <TableHead className="text-right">Market Cap Contribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockConstituents.map((constituent) => (
                    <TableRow key={constituent.ric}>
                      <TableCell className="font-medium">{constituent.ric}</TableCell>
                      <TableCell className="text-right">{constituent.lastPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{constituent.lastFx.toFixed(4)}</TableCell>
                      <TableCell className="text-right">{(constituent.weight * 100).toFixed(2)}%</TableCell>
                      <TableCell className="text-right">
                        {(constituent.lastPrice * constituent.weight).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-medium">
                    <TableCell colSpan={4} className="text-right">Total Market Cap:</TableCell>
                    <TableCell className="text-right">{totalMarketCap.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md text-sm">
            <h3 className="font-medium mb-2">Calculation Formula</h3>
            <p>Index Level = Total Market Cap / Divisor</p>
            <p className="mt-1">= {totalMarketCap.toFixed(2)} / {divisor.toFixed(4)} = {indexLevel.toFixed(2)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IndexLevelDetails;
