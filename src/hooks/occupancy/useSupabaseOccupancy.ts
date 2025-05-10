
import { useState } from 'react';
import { useOccupancyData } from './data/useOccupancyData';
import { useOccupancyStats } from './stats/useOccupancyStats';
import { useRoomOperations } from './operations/useRoomOperations';
import { useWorkstationOperations } from './operations/useWorkstationOperations';
import { useFloorSelection } from './useFloorSelection';
import { fetchRooms } from './api/roomApi';

export function useSupabaseOccupancy() {
  const { currentFloor, setCurrentFloor } = useFloorSelection('1');
  
  // Get occupancy data
  const {
    rooms,
    setRooms,
    workStations,
    setWorkStations,
    isLoading,
    isRefreshing,
    handleRefresh
  } = useOccupancyData();

  // Get occupancy statistics
  const {
    floorRooms,
    floorStations,
    roomOccupancy,
    stationOccupancy
  } = useOccupancyStats(rooms, workStations, currentFloor);

  // Get room operations
  const {
    updateRoomStatus,
    updateRoomDetails,
    linkClientToRoom,
    unlinkClientFromRoom,
    refreshRooms,
    isUpdatingStatus,
    isUpdatingDetails,
    isLinking,
    isUnlinking
  } = useRoomOperations(rooms, setRooms, fetchRooms);

  // Get workstation operations
  const {
    allocateFlexStations,
    handleConvertFlexToFixed
  } = useWorkstationOperations(workStations, setWorkStations);

  return {
    currentFloor,
    setCurrentFloor,
    rooms,
    workStations,
    floorRooms,
    floorStations,
    roomOccupancy,
    stationOccupancy,
    isLoading,
    isRefreshing,
    handleRefresh,
    allocateFlexStations,
    handleConvertFlexToFixed,
    updateRoomStatus,
    updateRoomDetails,
    linkClientToRoom,
    unlinkClientFromRoom,
    refreshRooms,
    isUpdatingStatus,
    isUpdatingDetails,
    isLinking,
    isUnlinking,
  };
}
