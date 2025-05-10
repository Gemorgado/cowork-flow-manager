
import React, { useCallback } from 'react';
import { Room, WorkStation, LocationStatus } from '@/types';
import { RoomGrid } from '../room/RoomGrid';
import { WorkStationGrid } from '../WorkStationGrid';
import { toast } from '@/components/ui/use-toast';
import { updateStationStatus, convertFlexToFixed } from '@/hooks/occupancy/api';

interface FloorMapContentProps {
  activeView: 'unified' | 'rooms' | 'stations';
  rooms: Room[] | null;
  workStations: WorkStation[] | null;
  floor: string;
  onDataChange?: () => void;
}

export function FloorMapContent({ 
  activeView, 
  rooms, 
  workStations,
  floor,
  onDataChange
}: FloorMapContentProps) {
  console.log("FloorMapContent rendering:", { 
    activeView, 
    rooms: rooms?.length, 
    workStations: workStations?.length, 
    floor 
  });
  
  if (!rooms && !workStations) {
    console.log("No rooms or workstations available");
    return null;
  }
  
  const floorRooms = rooms?.filter(room => room.floor === parseInt(floor) as any) || [];
  const floorWorkstations = workStations?.filter(ws => ws.floor === parseInt(floor) as any) || [];
  
  console.log(`Filtered data for floor ${floor}:`, { 
    floorRooms: floorRooms.length, 
    floorWorkstations: floorWorkstations.length 
  });
  
  // Constants for room counts per floor based on official inventory
  const totalRooms = {
    '1': 7,  // 101-107
    '2': 19, // 201-219
    '3': 10  // 301-310
  };
  
  // Constants for workstation counts per floor
  const totalWorkstations = {
    '1': 26, // WS-01 to WS-26
    '2': 38, // WS-27 to WS-64
    '3': 0   // No workstations on floor 3
  };
  
  // Handler for updating station status
  const handleUpdateStatus = useCallback(async (stationId: string, status: LocationStatus): Promise<boolean> => {
    try {
      const success = await updateStationStatus(stationId, status);
      if (success) {
        toast({
          title: 'Status atualizado',
          description: `Status da estação atualizado com sucesso.`
        });
        if (onDataChange) onDataChange();
      }
      return success;
    } catch (error) {
      console.error("Error updating station status:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status da estação.',
        variant: 'destructive'
      });
      return false;
    }
  }, [onDataChange]);

  // Handler for linking client to station
  const handleLinkClient = useCallback(async (stationId: string, clientId: string) => {
    try {
      const success = await convertFlexToFixed(stationId, clientId);
      if (success) {
        toast({
          title: 'Cliente vinculado',
          description: 'Cliente vinculado à estação com sucesso.'
        });
        if (onDataChange) onDataChange();
      }
      return success;
    } catch (error) {
      console.error("Error linking client to station:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível vincular o cliente à estação.',
        variant: 'destructive'
      });
      return false;
    }
  }, [onDataChange]);
  
  return (
    <div className="space-y-8">
      {(activeView === 'unified' || activeView === 'rooms') && rooms && (
        <div className={activeView === 'unified' ? 'mb-10' : ''}>
          <h3 className="text-lg font-medium mb-4">
            Salas {floor}º Andar 
            <span className="text-sm text-muted-foreground ml-2">
              ({floorRooms.length}/{totalRooms[floor as keyof typeof totalRooms]})
            </span>
          </h3>
          <RoomGrid rooms={floorRooms} />
        </div>
      )}
      
      {(activeView === 'unified' || activeView === 'stations') && workStations && (
        <div>
          <h3 className="text-lg font-medium mb-4">
            Estações de Trabalho {floor}º Andar
            <span className="text-sm text-muted-foreground ml-2">
              ({floorWorkstations.length}/{totalWorkstations[floor as keyof typeof totalWorkstations]})
            </span>
          </h3>
          <WorkStationGrid 
            workStations={workStations} 
            currentFloor={floor}
            onUpdateStatus={handleUpdateStatus}
            onLinkClient={handleLinkClient}
          />
        </div>
      )}
    </div>
  );
}
