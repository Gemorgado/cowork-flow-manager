
import { useOccupancyInitialization } from './useOccupancyInitialization';
import { useOccupancyFetch } from './useOccupancyFetch';
import { useOccupancyStats } from './useOccupancyStats';
import { useInitialDataFetch } from './useInitialDataFetch';

/**
 * Main hook that combines all occupancy data functionality
 */
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

  // Handle initial data fetching
  useInitialDataFetch(fetchData);

  const calculateOccupancyStats = useOccupancyStats(rooms, workStations);
  
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
