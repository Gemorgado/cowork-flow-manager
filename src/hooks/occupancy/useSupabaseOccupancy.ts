
import { useState, useEffect, useCallback } from 'react';
import { Room, WorkStation } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { calculateOccupancyRate, convertFlexToFixed } from '@/components/occupancy/utils/occupancyUtils';
import { fetchRooms } from './api/roomApi';
import { fetchWorkstations } from './api/workstationApi';
import { useFloorSelection } from './useFloorSelection';
import { 
  allocateFlexStations, 
  handleConvertFlexToFixed 
} from './operations/workstationOperations';
import { 
  handleUpdateRoomStatus, 
  handleUpdateRoomDetails, 
  handleLinkClientToRoom 
} from './operations/roomOperations';
import { seedSupabaseOccupancy } from '@/utils/seedSupabaseOccupancy';

export function useSupabaseOccupancy() {
  const { currentFloor, setCurrentFloor } = useFloorSelection('1');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [workStations, setWorkStations] = useState<WorkStation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [dataInitialized, setDataInitialized] = useState<boolean>(false);

  // Check if we need to initialize data
  const checkAndSeedData = useCallback(async () => {
    try {
      // Check if we have data
      const { data: roomsCheck, error: roomsError } = await supabase
        .from('rooms')
        .select('id')
        .limit(1);
      
      if (roomsError) throw roomsError;
      
      // If no rooms found, seed the data
      if (!roomsCheck || roomsCheck.length === 0) {
        await seedSupabaseOccupancy();
      }

      setDataInitialized(true);
    } catch (error) {
      console.error('Error checking or seeding data:', error);
      setDataInitialized(true); // Set to true anyway to proceed with the app
    }
  }, []);

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!dataInitialized) {
      await checkAndSeedData();
    }

    setIsLoading(true);
    const [fetchedRooms, fetchedWorkstations] = await Promise.all([
      fetchRooms(),
      fetchWorkstations()
    ]);
    
    setRooms(fetchedRooms);
    setWorkStations(fetchedWorkstations);
    setIsLoading(false);
  }, [dataInitialized, checkAndSeedData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter data by current floor
  const floorRooms = rooms.filter((room) => room.floor === parseInt(currentFloor) as any);
  const floorStations = workStations.filter(
    (station) => station.floor === parseInt(currentFloor) as any
  );

  // Calculate occupancy rates
  const roomOccupancy = calculateOccupancyRate(floorRooms);
  const stationOccupancy = calculateOccupancyRate(floorStations);

  // Handler for refresh button
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, [fetchData]);

  // Handler for allocating flex stations
  const handleAllocateFlexStations = useCallback(async (quantity: number) => {
    const success = await allocateFlexStations(
      workStations, 
      quantity, 
      fetchWorkstations
    );
    
    if (success) {
      setWorkStations(prev => 
        prev.map(station => 
          prev.slice(0, quantity).some(s => s.id === station.id && s.status === 'available')
            ? { ...station, status: 'flex' } 
            : station
        )
      );
    }
  }, [workStations]);

  // Handler for updating room status
  const updateRoomStatus = useCallback(async (roomId: string, status: any, clientId?: string) => {
    // Update local state optimistically
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId ? { ...room, status, clientId } : room
      )
    );
    
    // Make API call
    const success = await handleUpdateRoomStatus(roomId, status, clientId, () => {
      fetchRooms().then(setRooms);
    });
    
    // Revert on failure
    if (!success) {
      fetchRooms().then(setRooms);
    }
  }, []);

  // Handler for updating room details
  const updateRoomDetails = useCallback(async (roomId: string, data: { area?: number, priceClosed?: number }) => {
    // Update local state optimistically
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId 
          ? { ...room, area: data.area || room.area } 
          : room
      )
    );
    
    // Make API call
    const success = await handleUpdateRoomDetails(roomId, data, () => {
      fetchRooms().then(setRooms);
    });
    
    // Revert on failure
    if (!success) {
      fetchRooms().then(setRooms);
    }
  }, []);

  // Handler for converting flex to fixed
  const handleConvertFlexToFixedWorkstation = useCallback(async (stationId: string, clientId: string) => {
    // Update local state optimistically
    setWorkStations(prevStations => convertFlexToFixed(prevStations, stationId, clientId));
    
    // Make API call
    const success = await handleConvertFlexToFixed(
      workStations,
      stationId,
      clientId,
      () => fetchWorkstations().then(setWorkStations)
    );
    
    // Revert on failure
    if (!success) {
      fetchWorkstations().then(setWorkStations);
    }
  }, [workStations]);

  // Handler for linking a client to a room
  const linkClientToRoom = useCallback(async (roomId: string, clientId: string) => {
    // Update local state optimistically
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId 
          ? { ...room, clientId, status: 'occupied' } 
          : room
      )
    );
    
    // Make API call
    const success = await handleLinkClientToRoom(
      roomId,
      clientId,
      () => fetchRooms().then(setRooms)
    );
    
    // Revert on failure
    if (!success) {
      fetchRooms().then(setRooms);
    }
  }, []);

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
    allocateFlexStations: handleAllocateFlexStations,
    handleConvertFlexToFixed: handleConvertFlexToFixedWorkstation,
    updateRoomStatus,
    updateRoomDetails,
    linkClientToRoom,
  };
}
