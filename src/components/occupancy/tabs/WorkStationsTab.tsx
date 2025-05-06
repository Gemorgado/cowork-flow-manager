
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { WorkStation } from '@/types';
import { WorkStationGrid } from '../WorkStationGrid';
import { OccupancyMeter } from '../workstation/OccupancyMeter';
import { calculateFlexOccupancyRate } from '../workstation/StationUtils';

interface WorkStationsTabProps {
  workStations: WorkStation[];
  currentFloor: string;
  onAllocateFlexToFixed?: (stationId: string, clientId: string) => void;
}

export const WorkStationsTab: React.FC<WorkStationsTabProps> = ({
  workStations,
  currentFloor,
  onAllocateFlexToFixed,
}) => {
  // Filter stations by floor
  const floorStations = workStations.filter(
    (station) => station.floor === parseInt(currentFloor) as any
  );

  // Separate flex stations for occupancy rates
  const flexStations = floorStations.filter((station) => station.type === 'flex');
  const allFlexStations = workStations.filter(s => s.type === 'flex');

  // Calculate occupancy rates
  const currentFloorFlexOccupancy = calculateFlexOccupancyRate(
    flexStations,
    s => s.type === 'flex'
  );
  
  const totalFlexOccupancy = calculateFlexOccupancyRate(
    allFlexStations,
    s => s.type === 'flex'
  );

  return (
    <CardContent>
      {/* Flex occupancy meters */}
      {flexStations.length > 0 || allFlexStations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {flexStations.length > 0 && (
            <OccupancyMeter 
              occupancyRate={currentFloorFlexOccupancy.rate} 
              occupied={currentFloorFlexOccupancy.occupied} 
              total={currentFloorFlexOccupancy.total}
              title="Ocupação Flex (Andar Atual)"
            />
          )}
          
          {allFlexStations.length > 0 && (
            <OccupancyMeter 
              occupancyRate={totalFlexOccupancy.rate} 
              occupied={totalFlexOccupancy.occupied} 
              total={totalFlexOccupancy.total}
              title="Ocupação Flex (Global)"
            />
          )}
        </div>
      ) : null}
      
      {/* Unified grid for all station types */}
      <WorkStationGrid 
        workStations={workStations}
        currentFloor={currentFloor}
        onAllocateFlexToFixed={onAllocateFlexToFixed}
      />
    </CardContent>
  );
};
