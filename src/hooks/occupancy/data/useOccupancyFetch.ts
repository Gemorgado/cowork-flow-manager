
import { useState, useCallback } from 'react';
import { Room, WorkStation } from '@/types';
import { fetchRooms } from '../api/roomApi';
import { fetchWorkstations } from '../api/workstationApi';
import { toast } from '@/components/ui/use-toast';

export function useOccupancyFetch(dataInitialized: boolean, checkAndSeedData: () => Promise<void>) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [workStations, setWorkStations] = useState<WorkStation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!dataInitialized) {
      await checkAndSeedData();
    }

    setIsLoading(true);
    try {
      const [fetchedRooms, fetchedWorkstations] = await Promise.all([
        fetchRooms(),
        fetchWorkstations()
      ]);
      
      setRooms(fetchedRooms);
      setWorkStations(fetchedWorkstations);
    } catch (error) {
      console.error('Error fetching occupancy data:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar dados de ocupação.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [dataInitialized, checkAndSeedData]);

  // Handler for refresh button
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, [fetchData]);

  return {
    rooms,
    setRooms,
    workStations,
    setWorkStations,
    isLoading,
    isRefreshing,
    fetchData,
    handleRefresh
  };
}
