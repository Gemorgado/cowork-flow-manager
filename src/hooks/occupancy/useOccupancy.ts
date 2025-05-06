
import { useState, useCallback } from 'react';
import { generateRooms, generateWorkStations } from '@/mock/locations';
import { Room, WorkStation } from '@/types';
import { calculateOccupancyRate } from '@/components/occupancy/OccupancyStats';
import { 
  allocateFlexStations, 
  convertFlexToFixed, 
  releaseFlexStations 
} from '@/components/occupancy/utils/occupancyUtils';

export function useOccupancy() {
  const [currentFloor, setCurrentFloor] = useState<string>('1');
  const [rooms] = useState(generateRooms());
  const [workStations, setWorkStations] = useState(generateWorkStations());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const floorRooms = rooms.filter((room) => room.floor === parseInt(currentFloor) as any);
  const floorStations = workStations.filter(
    (station) => station.floor === parseInt(currentFloor) as any
  );

  const roomOccupancy = calculateOccupancyRate(floorRooms);
  const stationOccupancy = calculateOccupancyRate(floorStations);

  // Function to handle allocation of flex stations
  const handleAllocateFlexStations = useCallback((count: number) => {
    setWorkStations(prevStations => allocateFlexStations(prevStations, count));
  }, []);

  // Function to handle conversion of flex to fixed
  const handleConvertFlexToFixed = useCallback((stationId: string, clientId: string) => {
    setWorkStations(prevStations => convertFlexToFixed(prevStations, stationId, clientId));
  }, []);

  // Function to handle release of flex stations
  const handleReleaseFlexStations = useCallback((count: number) => {
    setWorkStations(prevStations => releaseFlexStations(prevStations, count));
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate a refresh - in a real app this would fetch new data
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  }, []);

  // Test flex allocation
  const handleTestFlexAllocation = useCallback(() => {
    handleAllocateFlexStations(5);
  }, [handleAllocateFlexStations]);

  // Test flex release
  const handleTestFlexRelease = useCallback(() => {
    handleReleaseFlexStations(3);
  }, [handleReleaseFlexStations]);

  return {
    currentFloor,
    setCurrentFloor,
    rooms,
    workStations,
    floorRooms,
    floorStations,
    roomOccupancy,
    stationOccupancy,
    isRefreshing,
    handleRefresh,
    handleAllocateFlexStations,
    handleConvertFlexToFixed,
    handleReleaseFlexStations,
    handleTestFlexAllocation,
    handleTestFlexRelease,
  };
}
