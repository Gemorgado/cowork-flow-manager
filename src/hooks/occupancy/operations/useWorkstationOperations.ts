
import { useCallback } from 'react';
import { WorkStation } from '@/types';
import { 
  allocateFlexStations, 
  handleConvertFlexToFixed 
} from './workstationOperations';
import { convertFlexToFixed } from '@/components/occupancy/utils/occupancyUtils';
import { fetchWorkstations } from '../api/workstationApi';

export function useWorkstationOperations(
  workStations: WorkStation[], 
  setWorkStations: (stations: WorkStation[]) => void
) {
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
  }, [workStations, setWorkStations]);

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
  }, [workStations, setWorkStations]);

  return {
    allocateFlexStations: handleAllocateFlexStations,
    handleConvertFlexToFixed: handleConvertFlexToFixedWorkstation
  };
}
