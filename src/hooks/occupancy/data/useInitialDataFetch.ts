
import { useEffect } from 'react';
import { useCallback } from 'react';

/**
 * Hook to handle initial data fetching
 * 
 * @param fetchData Function to fetch initial data
 */
export function useInitialDataFetch(fetchData: () => Promise<void>) {
  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return {
    fetchData
  };
}
