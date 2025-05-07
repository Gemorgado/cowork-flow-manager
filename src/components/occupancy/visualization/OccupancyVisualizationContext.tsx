
import React, { createContext, useContext, useState } from 'react';
import { Room, WorkStation } from '@/types';

interface OccupancyVisualizationContextProps {
  visualizationType: 'rooms' | 'stations';
  setVisualizationType: (type: 'rooms' | 'stations') => void;
  activeVisualizationIndex: number | undefined;
  setActiveVisualizationIndex: (index: number | undefined) => void;
}

const OccupancyVisualizationContext = createContext<OccupancyVisualizationContextProps | undefined>(undefined);

export interface OccupancyVisualizationProviderProps {
  children: React.ReactNode;
}

export function OccupancyVisualizationProvider({ children }: OccupancyVisualizationProviderProps) {
  const [visualizationType, setVisualizationType] = useState<'rooms' | 'stations'>('rooms');
  const [activeVisualizationIndex, setActiveVisualizationIndex] = useState<number | undefined>(undefined);

  return (
    <OccupancyVisualizationContext.Provider
      value={{
        visualizationType,
        setVisualizationType,
        activeVisualizationIndex,
        setActiveVisualizationIndex
      }}
    >
      {children}
    </OccupancyVisualizationContext.Provider>
  );
}

export function useOccupancyVisualization() {
  const context = useContext(OccupancyVisualizationContext);
  
  if (context === undefined) {
    throw new Error('useOccupancyVisualization must be used within an OccupancyVisualizationProvider');
  }
  
  return context;
}
