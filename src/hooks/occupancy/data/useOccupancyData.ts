
import { useEffect } from 'react';
import { useOccupancyInitialization } from './useOccupancyInitialization';
import { useOccupancyFetch } from './useOccupancyFetch';
import { useOccupancyStats } from './useOccupancyStats';

export function useOccupancyData() {
  const {
    dataInitialized,
    isSeeding,
    checkAndSeedData,
    seedData
  } = useOccupancyInitialization();

  const {
    rooms,
    setRooms,
    workStations,
    setWorkStations,
    isLoading,
    isRefreshing,
    fetchData,
    handleRefresh
  } = useOccupancyFetch(dataInitialized, checkAndSeedData);

  const calculateOccupancyStats = useOccupancyStats(rooms, workStations);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get occupancy stats for charts
  const occupancyStats = calculateOccupancyStats();

  return {
    rooms,
    setRooms,
    workStations,
    setWorkStations,
    occupancyStats,
    isLoading,
    isRefreshing,
    isSeeding,
    handleRefresh,
    fetchData,
    seedData
  };
}
