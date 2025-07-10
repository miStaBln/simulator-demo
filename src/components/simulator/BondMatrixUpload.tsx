
import React, { useState } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface BondMatrixUploadProps {
  onMatrixUpload: (matrixData: any[]) => void;
}

const BondMatrixUpload = ({ onMatrixUpload }: BondMatrixUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error("CSV must have at least a header and one data row");
      }

      // Parse header (first line) to get Gigant IDs
      const header = lines[0].split(',').map(cell => cell.trim());
      const gigantIds = header.slice(1); // Skip first column (dates)

      if (gigantIds.length === 0) {
        throw new Error("No Gigant IDs found in header");
      }

      // Parse data rows
      const matrixData = [];
      for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',').map(cell => cell.trim());
        const selectionDate = cells[0];
        
        if (!selectionDate) continue;

        // Convert date format from DD.MM.YY to DD.MM.YYYY if needed
        const formattedDate = formatDate(selectionDate);
        
        const rebalancingData = {
          selectionDate: formattedDate,
          rebalancingDate: formattedDate, // For bond indices, rebalancing date equals selection date
          components: [] as Array<{ ric: string; weight: string; weightingCapFactor: string }>
        };

        // Process each instrument's weight
        for (let j = 1; j < cells.length && j <= gigantIds.length; j++) {
          const weight = cells[j];
          const gigantId = gigantIds[j - 1];
          
          if (weight && weight !== '0' && gigantId) {
            rebalancingData.components.push({
              ric: gigantId,
              weight: weight,
              weightingCapFactor: '1.0'
            });
          }
        }

        if (rebalancingData.components.length > 0) {
          matrixData.push(rebalancingData);
        }
      }

      if (matrixData.length === 0) {
        throw new Error("No valid rebalancing data found in CSV");
      }

      onMatrixUpload(matrixData);
      
      toast({
        title: "Matrix uploaded successfully",
        description: `Processed ${matrixData.length} rebalancing entries with ${gigantIds.length} instruments`,
      });

    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to parse CSV file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const formatDate = (dateStr: string): string => {
    // Handle different date formats
    if (dateStr.includes('.')) {
      const parts = dateStr.split('.');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        // Convert YY to YYYY if needed
        const fullYear = year.length === 2 ? `20${year}` : year;
        return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${fullYear}`;
      }
    }
    return dateStr;
  };

  const downloadTemplate = () => {
    const template = [
      ',15477,49845,15476',
      '02.01.25,1,1,1',
      '01.02.25,1,0,0',
      '03.03.25,1,1,1',
      '02.04.25,1,1,0'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bond_matrix_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Bond Matrix Format Requirements:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>First row: Gigant IDs (comma-separated)</li>
              <li>First column: Selection dates (DD.MM.YY or DD.MM.YYYY format)</li>
              <li>Matrix cells: Weighting factors (use 0 for no weight, 1 for included)</li>
              <li>For bond indices: Rebalancing date equals selection date</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex-1">
          <div className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-700">
              {isUploading ? 'Processing...' : 'Upload Bond Matrix CSV'}
            </span>
          </div>
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>

        <Button
          variant="outline"
          size="sm"
          onClick={downloadTemplate}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Template
        </Button>
      </div>
    </div>
  );
};

export default BondMatrixUpload;
