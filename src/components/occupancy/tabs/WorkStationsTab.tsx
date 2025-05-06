
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { WorkStation } from '@/types';
import { WorkStationGrid } from '../WorkStationGrid';
import { Skeleton } from '@/components/ui/skeleton';

interface WorkStationsTabProps {
  workStations: WorkStation[];
  currentFloor: string;
  isLoading?: boolean;
  onAllocateFlexToFixed?: (stationId: string, clientId: string) => void;
}

export const WorkStationsTab: React.FC<WorkStationsTabProps> = ({
  workStations,
  currentFloor,
  isLoading = false,
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
      {flexCount > 0 && !isLoading && (
        <div className="flex justify-end mb-4">
          <span className="text-xs text-muted-foreground">
            Estações Flex: {flexCount}
          </span>
        </div>
      )}
      
      {/* Loading skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
              <Skeleton className="mt-1 h-3 w-6" />
            </div>
          ))}
        </div>
      ) : (
        /* Unified grid for all station types */
        <WorkStationGrid 
          workStations={workStations} 
          currentFloor={currentFloor} 
          onAllocateFlexToFixed={onAllocateFlexToFixed} 
        />
      )}
    </CardContent>
  );
};
