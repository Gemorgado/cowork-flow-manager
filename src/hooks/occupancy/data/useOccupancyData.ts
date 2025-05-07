
import { useState, useCallback, useEffect } from 'react';
import { Room, WorkStation } from '@/types';
import { supabase } from '@/lib/supabase';
import { fetchRooms } from '../api/roomApi';
import { fetchWorkstations } from '../api/workstationApi';
import { seedSupabaseOccupancy } from '@/utils/seedSupabaseOccupancy';

export function useOccupancyData() {
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
    handleRefresh,
    fetchData
  };
}
