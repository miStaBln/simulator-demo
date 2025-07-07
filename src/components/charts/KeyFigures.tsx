
import React from 'react';
import { KeyFigures as KeyFiguresType } from '@/utils/timeSeriesCalculations';

interface KeyFiguresProps {
  keyFigures: KeyFiguresType;
}

const KeyFigures: React.FC<KeyFiguresProps> = ({ keyFigures }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Key Figures</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Return</h3>
          <p className={`text-2xl font-bold ${keyFigures.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {keyFigures.totalReturn.toFixed(2)}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Maximum Drawdown</h3>
          <p className="text-2xl font-bold text-red-600">
            -{keyFigures.maxDrawdown.toFixed(2)}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Start Level</h3>
          <p className="text-xl font-semibold">{keyFigures.startLevel.toFixed(4)}</p>
          <p className="text-xs text-gray-400">{keyFigures.startDate}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">End Level</h3>
          <p className="text-xl font-semibold">{keyFigures.endLevel.toFixed(4)}</p>
          <p className="text-xs text-gray-400">{keyFigures.endDate}</p>
        </div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-sm text-gray-600">
          Simulation period: <strong>{keyFigures.numberOfDays} days</strong> from {keyFigures.startDate} to {keyFigures.endDate}
        </p>
      </div>
    </div>
  );
};

export default KeyFigures;
