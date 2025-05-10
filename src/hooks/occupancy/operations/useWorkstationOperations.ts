
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
  setWorkStations: React.Dispatch<React.SetStateAction<WorkStation[]>>
) {
  // Handler for allocating flex stations
  const handleAllocateFlexStations = useCallback(async (quantity: number): Promise<boolean> => {
    const success = await allocateFlexStations(
      workStations, 
      quantity, 
      fetchWorkstations
    );
    
    if (success) {
      setWorkStations((prev): WorkStation[] => 
        prev.map(station => 
          prev.slice(0, quantity).some(s => s.id === station.id && s.status === 'available')
            ? { ...station, status: 'flex' } 
            : station
        )
      );
    }
    
    return success;
  }, [workStations, setWorkStations]);

  // Handler for converting flex to fixed
  const handleConvertFlexToFixedWorkstation = useCallback(async (stationId: string, clientId: string): Promise<boolean> => {
    // Update local state optimistically
    setWorkStations((prevStations): WorkStation[] => convertFlexToFixed(prevStations, stationId, clientId));
    
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
    
    return success;
  }, [workStations, setWorkStations]);

  return {
    allocateFlexStations: handleAllocateFlexStations,
    handleConvertFlexToFixed: handleConvertFlexToFixedWorkstation
  };
}
