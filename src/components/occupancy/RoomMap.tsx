
import React, { useCallback } from 'react';
import { Room, LocationStatus } from '@/types';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { updateRoomStatus, linkClientToRoom, unlinkClientFromRoom, updateRoomDetails } from '@/hooks/occupancy/api';
import { RoomGrid } from './room/RoomGrid';

interface RoomMapProps {
  rooms: Room[];
  currentFloor: string;
  onRoomsChanged?: () => void;
}

export const RoomMap: React.FC<RoomMapProps> = ({ 
  rooms, 
  currentFloor,
  onRoomsChanged
}) => {
  const floorRooms = rooms.filter((room) => room.floor === parseInt(currentFloor) as any);
  
  // Handler for updating room status
  const handleUpdateRoomStatus = useCallback(async (roomId: string, status: LocationStatus) => {
    try {
      console.log(`RoomMap.handleUpdateRoomStatus - roomId: ${roomId}, status: ${status}`);
      
      // If status is 'available', we remove client association
      const clientId = status === 'available' ? null : undefined;
      
      const success = await updateRoomStatus(roomId, status, clientId);
      if (success && onRoomsChanged) {
        onRoomsChanged();
      }
    } catch (error) {
      console.error("Error updating room status:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status da sala.',
        variant: 'destructive'
      });
    }
  }, [onRoomsChanged]);

  // Handler for client linking
  const handleLinkClient = useCallback(async (roomId: string, clientId: string) => {
    try {
      console.log(`RoomMap.handleLinkClient - roomId: ${roomId}, clientId: ${clientId}`);
      const success = await linkClientToRoom(roomId, clientId);
      if (success && onRoomsChanged) {
        // Ensure UI gets updated after linking the client
        onRoomsChanged();
      }
    } catch (error) {
      console.error("Error linking client to room:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível vincular o cliente à sala.',
        variant: 'destructive'
      });
    }
  }, [onRoomsChanged]);

  // Handler for client unlinking - fixed to ensure proper callbacks
  const handleUnlinkClient = useCallback(async (roomId: string) => {
    try {
      console.log(`RoomMap.handleUnlinkClient - roomId: ${roomId}`);
      // Track and log the entire operation
      console.log("Calling unlinkClientFromRoom API...");
      const success = await unlinkClientFromRoom(roomId);
      console.log(`API call result: ${success}`);
      
      if (success && onRoomsChanged) {
        console.log("Unlink successful, calling onRoomsChanged callback");
        // Add a small delay to ensure the DB has processed the change
        setTimeout(() => {
          onRoomsChanged();
        }, 100);
      }
    } catch (error) {
      console.error("Error unlinking client from room:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível desvincular o cliente da sala.',
        variant: 'destructive'
      });
    }
  }, [onRoomsChanged]);

  // Handler for updating room details
  const handleUpdateRoomDetails = useCallback(async (roomId: string, data: { area?: number, capacity?: number }) => {
    try {
      console.log(`RoomMap.handleUpdateRoomDetails - roomId: ${roomId}, data:`, data);
      const success = await updateRoomDetails(roomId, data);
      if (success && onRoomsChanged) {
        onRoomsChanged();
      }
    } catch (error) {
      console.error("Error updating room details:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar os detalhes da sala.',
        variant: 'destructive',
      });
    }
  }, [onRoomsChanged]);
  
  // If there are no rooms for this floor, show a message
  if (floorRooms.length === 0) {
    return (
      <div className="p-6 text-center">
        <Alert variant="default" className="justify-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Nenhuma sala encontrada para o {currentFloor}º andar.
            <br/>
            Use o botão "Popular Dados" para criar salas de exemplo.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <div className="mb-8">
        <RoomGrid 
          rooms={floorRooms} 
          onUpdateStatus={handleUpdateRoomStatus}
          onLinkClient={handleLinkClient}
          onUnlinkClient={handleUnlinkClient}
          onUpdateRoomDetails={handleUpdateRoomDetails}
        />
      </div>
    </TooltipProvider>
  );
};
