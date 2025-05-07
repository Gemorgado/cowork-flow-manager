
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Room, WorkStation, LocationStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { calculateOccupancyRate, convertFlexToFixed } from '@/components/occupancy/utils/occupancyUtils';

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

  const allocateFlexStations = useCallback(async (quantity: number) => {
    try {
      // First update the local state for immediate UI feedback
      const availableStations = workStations.filter(station => station.status === 'available');
      
      if (availableStations.length < quantity) {
        throw new Error(`Só existem ${availableStations.length} estações disponíveis`);
      }
      
      // Randomly select stations to convert to FLEX
      const stationsToUpdate = availableStations.slice(0, quantity);
      
      setWorkStations(prev => 
        prev.map(station => 
          stationsToUpdate.some(s => s.id === station.id) 
            ? { ...station, status: 'flex' } 
            : station
        )
      );
      
      // Then update the database
      const { error } = await supabase
        .from('workstations')
        .update({ status: 'flex' })
        .in('id', stationsToUpdate.map(s => s.id));

      if (error) {
        throw error;
      }

      toast({
        title: 'Sucesso',
        description: `${quantity} estações alocadas como FLEX`,
      });
      
    } catch (error: any) {
      console.error('Error allocating flex stations:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Falha ao alocar estações FLEX',
        variant: 'destructive',
      });
      // Revert local state on error
      fetchWorkstations();
    }
  }, [workStations, fetchWorkstations]);

  const updateRoomStatus = useCallback(async (roomId: string, status: LocationStatus, clientId?: string) => {
    try {
      // First update the local state for immediate UI feedback
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId ? { ...room, status, clientId } : room
        )
      );
      
      // Then update the database
      const updateData: any = { status };
      if (clientId !== undefined) {
        updateData.client_id = clientId || null;
      }

      const { error } = await supabase
        .from('rooms')
        .update(updateData)
        .eq('id', roomId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Sucesso',
        description: 'Status da sala atualizado',
      });
    } catch (error: any) {
      console.error('Error updating room:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar status da sala',
        variant: 'destructive',
      });
      // Revert local state on error
      fetchRooms();
    }
  }, [fetchRooms]);

  const updateRoomDetails = useCallback(async (roomId: string, data: { area?: number, priceClosed?: number }) => {
    try {
      // First update the local state for immediate UI feedback
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId 
            ? { ...room, area: data.area || room.area } 
            : room
        )
      );
      
      // Then update the database
      const { error } = await supabase
        .from('rooms')
        .update(data)
        .eq('id', roomId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Sucesso',
        description: 'Detalhes da sala atualizados',
      });
    } catch (error: any) {
      console.error('Error updating room details:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar detalhes da sala',
        variant: 'destructive',
      });
      // Revert local state on error
      fetchRooms();
    }
  }, [fetchRooms]);

  const handleConvertFlexToFixed = useCallback(async (stationId: string, clientId: string) => {
    try {
      // Get a reference to the station being converted
      const stationToConvert = workStations.find(s => s.id === stationId);
      
      if (!stationToConvert || stationToConvert.status !== 'flex') {
        throw new Error('Estação não está marcada como FLEX');
      }
      
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
      
      // Find a free workstation to convert to FLEX (to maintain the total number of FLEX stations)
      const availableStation = workStations.find(s => s.status === 'available');
      
      if (availableStation) {
        // Update local state
        setWorkStations(prev => 
          prev.map(station => 
            station.id === availableStation.id 
              ? { ...station, status: 'flex' } 
              : station
          )
        );
        
        // Update database
        await supabase
          .from('workstations')
          .update({ status: 'flex' })
          .eq('id', availableStation.id);
      }

      toast({
        title: 'Sucesso',
        description: 'Estação FLEX convertida para FIXA',
      });
    } catch (error: any) {
      console.error('Error updating workstation:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Falha ao converter estação FLEX',
        variant: 'destructive',
      });
      // Revert local state on error
      fetchWorkstations();
    }
  }, [workStations, fetchWorkstations]);

  const linkClientToRoom = useCallback(async (roomId: string, clientId: string) => {
    try {
      // First update the local state for immediate UI feedback
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId 
            ? { ...room, clientId, status: 'occupied' } 
            : room
        )
      );
      
      // Then update the database - we'll need to create an entry in the ClientRoom junction table
      // and also update the room status
      const { error: roomUpdateError } = await supabase
        .from('rooms')
        .update({ 
          status: 'occupied',
          client_id: clientId 
        })
        .eq('id', roomId);

      if (roomUpdateError) {
        throw roomUpdateError;
      }

      toast({
        title: 'Sucesso',
        description: 'Cliente vinculado à sala',
      });
    } catch (error: any) {
      console.error('Error linking client to room:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao vincular cliente à sala',
        variant: 'destructive',
      });
      // Revert local state on error
      fetchRooms();
    }
  }, [fetchRooms]);

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
    allocateFlexStations,
    handleConvertFlexToFixed,
    updateRoomStatus,
    updateRoomDetails,
    linkClientToRoom,
  };
}
