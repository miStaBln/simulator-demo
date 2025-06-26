
import React from 'react';
import { Eye, Play, RefreshCw, RotateCcw } from 'lucide-react';

interface BottomActionsProps {
  simulationComplete: boolean;
  loading: boolean;
  handleSimulate: () => void;
  viewResults: () => void;
}

const BottomActions = ({ simulationComplete, loading, handleSimulate, viewResults }: BottomActionsProps) => {
  return (
    <div className="flex items-center justify-start space-x-3">
      <button 
        onClick={() => window.location.reload()}
        className="flex items-center px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
      >
        <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
        RESET
      </button>
      
      <button 
        onClick={handleSimulate}
        disabled={loading}
        className="flex items-center px-4 py-1.5 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-teal-300 transition-colors"
      >
        {loading ? (
          <>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            SIMULATING...
          </>
        ) : (
          <>
            <Play className="h-3.5 w-3.5 mr-1.5" />
            SIMULATE
          </>
        )}
      </button>
      
      {simulationComplete && (
        <button 
          onClick={viewResults}
          className="flex items-center px-3 py-1.5 text-sm border border-teal-500 text-teal-500 rounded-md hover:bg-teal-50 transition-colors"
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          VIEW RESULTS
        </button>
      )}
    </div>
  );
};

export default BottomActions;
