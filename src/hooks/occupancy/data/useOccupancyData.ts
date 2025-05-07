
import { useState, useCallback, useEffect } from 'react';
import { Room, WorkStation } from '@/types';
import { supabase } from '@/lib/supabase';
import { fetchRooms } from '../api/roomApi';
import { fetchWorkstations } from '../api/workstationApi';
import { seedSupabaseOccupancy } from '@/utils/seedSupabaseOccupancy';
import { toast } from '@/components/ui/use-toast';

export function useOccupancyData() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [workStations, setWorkStations] = useState<WorkStation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [dataInitialized, setDataInitialized] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Check if we need to initialize data
  const checkAndSeedData = useCallback(async () => {
    try {
      // Check if we have data
      const { data: roomsCheck, error: roomsError } = await supabase
        .from('rooms')
        .select('id')
        .limit(1);
      
      if (roomsError) {
        console.error('Error checking rooms data:', roomsError);
        toast({
          title: 'Erro',
          description: 'Falha ao verificar dados existentes.',
          variant: 'destructive',
        });
        throw roomsError;
      }
      
      // If no rooms found, set flag but don't automatically seed
      if (!roomsCheck || roomsCheck.length === 0) {
        toast({
          title: 'Dados não encontrados',
          description: 'Use o botão "Atualizar" para popular dados de exemplo.',
        });
      }

      setDataInitialized(true);
    } catch (error) {
      console.error('Error checking or seeding data:', error);
      setDataInitialized(true); // Set to true anyway to proceed with the app
    }
  }, []);

  // Function to seed data manually
  const seedData = useCallback(async () => {
    try {
      setIsSeeding(true);
      await seedSupabaseOccupancy();
      toast({
        title: 'Sucesso',
        description: 'Dados de exemplo criados com sucesso!',
      });
      return true;
    } catch (error) {
      console.error('Error seeding data:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao popular dados de exemplo.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSeeding(false);
    }
  }, []);

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
    isSeeding,
    handleRefresh,
    fetchData,
    seedData
  };
}
