
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Room, WorkStation } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { calculateOccupancyRate } from '@/components/occupancy/OccupancyStats';
import { convertFlexToFixed } from '@/components/occupancy/utils/occupancyUtils';

export function useSupabaseOccupancy() {
  const [currentFloor, setCurrentFloor] = useState<string>('1');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [workStations, setWorkStations] = useState<WorkStation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchRooms = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        const roomData: Room[] = data.map(room => ({
          id: room.id,
          number: room.number,
          floor: parseInt(room.floor) as any,
          status: room.status,
          clientId: room.client_id || undefined,
          area: room.area,
          capacity: room.capacity
        }));
        setRooms(roomData);
      }
    } catch (error: any) {
      console.error('Error fetching rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch rooms data',
        variant: 'destructive',
      });
    }
  }, []);

  const fetchWorkstations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('workstations')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        const stationsData: WorkStation[] = data.map(station => ({
          id: station.id,
          number: station.number,
          floor: parseInt(station.floor) as any,
          type: station.type as 'flex' | 'fixed',
          status: station.status,
          clientId: station.client_id || undefined
        }));
        setWorkStations(stationsData);
      }
    } catch (error: any) {
      console.error('Error fetching workstations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch workstations data',
        variant: 'destructive',
      });
    }
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchRooms(), fetchWorkstations()]);
    setIsLoading(false);
  }, [fetchRooms, fetchWorkstations]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const floorRooms = rooms.filter((room) => room.floor === parseInt(currentFloor) as any);
  const floorStations = workStations.filter(
    (station) => station.floor === parseInt(currentFloor) as any
  );

  const roomOccupancy = calculateOccupancyRate(floorRooms);
  const stationOccupancy = calculateOccupancyRate(floorStations);

  const handleConvertFlexToFixed = useCallback(async (stationId: string, clientId: string) => {
    try {
      // First update the local state for immediate UI feedback
      setWorkStations(prevStations => convertFlexToFixed(prevStations, stationId, clientId));
      
      // Then update the database
      const { error } = await supabase
        .from('workstations')
        .update({
          type: 'fixed',
          status: 'occupied',
          client_id: clientId
        })
        .eq('id', stationId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Workstation status updated',
      });
    } catch (error: any) {
      console.error('Error updating workstation:', error);
      toast({
        title: 'Error',
        description: 'Failed to update workstation',
        variant: 'destructive',
      });
      // Revert local state on error
      fetchWorkstations();
    }
  }, [fetchWorkstations]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, [fetchData]);

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
    handleConvertFlexToFixed,
  };
}
