
import React from 'react';
import { Eye, Play, RefreshCw } from 'lucide-react';

interface BottomActionsProps {
  simulationComplete: boolean;
  loading: boolean;
  handleSimulate: () => void;
  viewResults: () => void;
}

const BottomActions = ({ simulationComplete, loading, handleSimulate, viewResults }: BottomActionsProps) => {
  return (
    <div className="bg-white border-t border-gray-200 p-4 z-40 md:static md:border-0 md:bg-transparent md:p-0 md:mt-6">
      <div className="flex justify-end space-x-4">
        {simulationComplete && (
          <button 
            onClick={viewResults}
            className="flex items-center px-4 py-2 border border-teal-500 text-teal-500 rounded-md hover:bg-teal-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            VIEW RESULTS
          </button>
        )}
        
        <button 
          onClick={handleSimulate}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-teal-300"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              SIMULATING...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              SIMULATE
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BottomActions;
