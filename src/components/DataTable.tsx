
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps {
  title: string;
  data: any[];
  isBondIndex?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ title, data, isBondIndex = false }) => {
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? data : data.slice(0, 10);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">{title}</h2>
        <div className="text-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RIC</TableHead>
              <TableHead>CAS</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>FX</TableHead>
              {isBondIndex && (
                <>
                  <TableHead>Weighting Cap Factor</TableHead>
                  <TableHead>Base Market Value</TableHead>
                  <TableHead>Composition Entered At</TableHead>
                  <TableHead>Composition Left At</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.ric}</TableCell>
                <TableCell>{item.cas}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.currency}</TableCell>
                <TableCell>{item.fx}</TableCell>
                {isBondIndex && (
                  <>
                    <TableCell>{item.weightingCapFactor || '-'}</TableCell>
                    <TableCell>{item.baseMarketValue || '-'}</TableCell>
                    <TableCell>{item.compositionEnteredAt || '-'}</TableCell>
                    <TableCell>{item.compositionLeftAt || '-'}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data.length > 10 && (
        <div className="px-6 py-4 border-t border-gray-200 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {showAll ? 'Show Less' : `Show All ${data.length} Results`}
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
