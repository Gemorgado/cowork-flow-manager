
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { WorkStation } from '@/types';
import { WorkStationGrid } from '../WorkStationGrid';

interface WorkStationsTabProps {
  workStations: WorkStation[];
  currentFloor: string;
  onAllocateFlexToFixed?: (stationId: string, clientId: string) => void;
}

export const WorkStationsTab: React.FC<WorkStationsTabProps> = ({
  workStations,
  currentFloor,
  onAllocateFlexToFixed
}) => {
  // Filter stations by floor
  const floorStations = workStations.filter(station => station.floor === parseInt(currentFloor) as any);

  // Count fixed and flex stations for display
  const flexStations = floorStations.filter(station => station.type === 'flex');
  const flexCount = flexStations.length;
  
  return (
    <CardContent>
      {/* Simple text indicator instead of donuts */}
      {flexCount > 0 && (
        <div className="flex justify-end mb-4">
          <span className="text-xs text-muted-foreground">
            Estações Flex: {flexCount}
          </span>
        </div>
      )}
      
      {/* Unified grid for all station types */}
      <WorkStationGrid 
        workStations={workStations} 
        currentFloor={currentFloor} 
        onAllocateFlexToFixed={onAllocateFlexToFixed} 
      />
    </CardContent>
  );
};
