
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface IndexItem {
  id: string;
  name: string;
  ticker: string;
  ric: string;
  isin: string;
  family: string;
  currency: string;
  owner: string;
  level?: number;
}

interface StarredContextType {
  starredIndices: IndexItem[];
  toggleStar: (index: IndexItem) => void;
  isStarred: (id: string) => boolean;
}

const StarredContext = createContext<StarredContextType | undefined>(undefined);

export const StarredProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [starredIndices, setStarredIndices] = useState<IndexItem[]>(() => {
    const saved = localStorage.getItem('starredIndices');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('starredIndices', JSON.stringify(starredIndices));
  }, [starredIndices]);

  const toggleStar = (index: IndexItem) => {
    setStarredIndices(prev => {
      const isAlreadyStarred = prev.some(item => item.id === index.id);
      if (isAlreadyStarred) {
        return prev.filter(item => item.id !== index.id);
      } else {
        return [...prev, index];
      }
    });
  };

  const isStarred = (id: string) => {
    return starredIndices.some(item => item.id === id);
  };

  return (
    <StarredContext.Provider value={{ starredIndices, toggleStar, isStarred }}>
      {children}
    </StarredContext.Provider>
  );
};

export const useStarred = () => {
  const context = useContext(StarredContext);
  if (context === undefined) {
    throw new Error('useStarred must be used within a StarredProvider');
  }
  return context;
};
