
import { useMemo } from 'react';
import { Room, WorkStation } from '@/types';
import { calculateOccupancyRate } from '@/components/occupancy/utils/occupancyUtils';

export function useOccupancyStats(
  rooms: Room[], 
  workStations: WorkStation[],
  currentFloor: string
) {
  // Filter data by current floor
  const floorRooms = useMemo(() => 
    rooms.filter((room) => room.floor === parseInt(currentFloor) as any),
    [rooms, currentFloor]
  );
  
  const floorStations = useMemo(() => 
    workStations.filter((station) => station.floor === parseInt(currentFloor) as any),
    [workStations, currentFloor]
  );

  // Calculate occupancy rates
  const roomOccupancy = useMemo(() => 
    calculateOccupancyRate(floorRooms),
    [floorRooms]
  );
  
  const stationOccupancy = useMemo(() => 
    calculateOccupancyRate(floorStations),
    [floorStations]
  );

  return {
    floorRooms,
    floorStations,
    roomOccupancy,
    stationOccupancy
  };
}
