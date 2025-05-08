
import { useQuery } from '@tanstack/react-query';
import { Room, WorkStation, FloorNumber } from '@/types';
import { supabase } from '@/lib/supabase';

export function useFloorMapData(floor: "1" | "2" | "3", hasCheckedData: boolean) {
  const { data: rooms, isLoading: isLoadingRooms, error: roomsError, refetch: refetchRooms } = useQuery({
    queryKey: ['rooms', floor],
    queryFn: async () => {
      console.log("Fetching rooms for floor:", floor);
      
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('floor', floor);
      
      if (error) {
        console.error("Error fetching rooms:", error);
        throw error;
      }
      
      console.log("Rooms data:", data);
      
      // Transform the response to match the Room type
      return (data || []).map(room => ({
        id: room.id,
        number: room.number,
        floor: parseInt(room.floor) as FloorNumber,
        status: room.status,
        clientId: room.client_id || undefined,
        area: room.area,
        capacity: room.capacity
      })) as Room[];
    },
    enabled: hasCheckedData,
  });

  const { data: workStations, isLoading: isLoadingStations, error: stationsError, refetch: refetchStations } = useQuery({
    queryKey: ['workstations', floor],
    queryFn: async () => {
      console.log("Fetching workstations for floor:", floor);
      
      const { data, error } = await supabase
        .from('workstations')
        .select('*')
        .eq('floor', floor);
      
      if (error) {
        console.error("Error fetching workstations:", error);
        throw error;
      }
      
      console.log("Workstations data:", data);
      
      return (data || []).map(station => ({
        id: station.id,
        number: station.number,
        floor: parseInt(station.floor) as FloorNumber,
        type: station.type as 'flex' | 'fixed',
        status: station.status,
        clientId: station.client_id || undefined
      })) as WorkStation[];
    },
    enabled: hasCheckedData,
  });

  const isLoading = isLoadingRooms || isLoadingStations || !hasCheckedData;
  const hasError = roomsError || stationsError;
  const hasNoData = (!rooms || rooms.length === 0) && (!workStations || workStations.length === 0);

  return {
    rooms,
    workStations,
    isLoading,
    hasError,
    hasNoData,
    refetchRooms,
    refetchStations
  };
}
