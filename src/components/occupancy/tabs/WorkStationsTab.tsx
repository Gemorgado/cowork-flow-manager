
import React, { useCallback } from 'react';
import { CardContent } from '@/components/ui/card';
import { WorkStation, LocationStatus } from '@/types';
import { WorkStationGrid } from '../WorkStationGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { updateStationStatus } from '@/hooks/occupancy/api/workstationApi';
import { convertFlexToFixed } from '@/hooks/occupancy/api/workstationApi';

interface WorkStationsTabProps {
  workStations: WorkStation[];
  currentFloor: string;
  isLoading?: boolean;
  onAllocateFlexToFixed?: (stationId: string, clientId: string) => void;
  onDataChange?: () => void;
}

export const WorkStationsTab: React.FC<WorkStationsTabProps> = ({
  workStations,
  currentFloor,
  isLoading = false,
  onAllocateFlexToFixed,
  onDataChange
}) => {
  // Filter stations by floor
  const floorStations = workStations.filter(station => station.floor === parseInt(currentFloor) as any);

  // Count fixed and flex stations for display
  const flexStations = floorStations.filter(station => station.type === 'flex');
  const flexCount = flexStations.length;
  
  // Handler for updating station status
  const handleUpdateStatus = useCallback(async (stationId: string, status: LocationStatus) => {
    try {
      await updateStationStatus(stationId, status);
      toast({
        title: 'Status atualizado',
        description: `Status da estação atualizado para ${status}.`
      });
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error("Error updating station status:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status da estação.',
        variant: 'destructive'
      });
    }
  }, [onDataChange]);

  // Handler for linking client to station
  const handleLinkClient = useCallback(async (stationId: string, clientId: string) => {
    try {
      // For workstations, linking a client also changes status to occupied
      await convertFlexToFixed(stationId, clientId);
      toast({
        title: 'Cliente vinculado',
        description: 'Cliente vinculado à estação com sucesso.'
      });
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error("Error linking client to station:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível vincular o cliente à estação.',
        variant: 'destructive'
      });
    }
  }, [onDataChange]);

  const handleAllocateFlexToFixed = useCallback(async (stationId: string, clientId: string) => {
    if (onAllocateFlexToFixed) {
      onAllocateFlexToFixed(stationId, clientId);
    }
  }, [onAllocateFlexToFixed]);
  
  return (
    <CardContent>
      {/* Simple text indicator instead of donuts */}
      {flexCount > 0 && !isLoading && (
        <div className="flex justify-end mb-4">
          <span className="text-xs text-muted-foreground">
            Estações Flex: {flexCount}
          </span>
        </div>
      )}
      
      {/* Loading skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
              <Skeleton className="mt-1 h-3 w-6" />
            </div>
          ))}
        </div>
      ) : (
        /* Unified grid for all station types */
        <WorkStationGrid 
          workStations={workStations} 
          currentFloor={currentFloor} 
          onAllocateFlexToFixed={handleAllocateFlexToFixed}
          onUpdateStatus={handleUpdateStatus}
          onLinkClient={handleLinkClient}
        />
      )}
    </CardContent>
  );
};
