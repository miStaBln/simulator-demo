
import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStarred } from '@/contexts/StarredContext';

const StarredIndicesWidget = () => {
  const { starredIndices } = useStarred();
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Star className="h-4 w-4 text-yellow-400" />
        <h3 className="text-sm font-medium">Starred Indices</h3>
      </div>
      
      {starredIndices.length === 0 ? (
        <div className="text-sm text-gray-500 flex-1 flex items-center justify-center">
          No starred indices yet
        </div>
      ) : (
        <div className="space-y-2 flex-1">
          {starredIndices.map((index) => (
            <div 
              key={index.id}
              onClick={() => navigate('/index-details', { state: { index } })}
              className="p-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-medium">{index.name}</div>
              <div className="text-xs text-gray-500">
                {index.ticker} | {index.currency}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StarredIndicesWidget;
