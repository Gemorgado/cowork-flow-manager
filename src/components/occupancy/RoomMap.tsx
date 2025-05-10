
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
      
      // Make the API call to update room status
      const success = await updateRoomStatus(roomId, status);
      console.log(`RoomMap: Status update API call result: ${success}`);
      
      if (success && onRoomsChanged) {
        console.log("Room status updated successfully, refreshing UI");
        onRoomsChanged();
      }
      
      return success;
    } catch (error) {
      console.error("Error updating room status:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status da sala.',
        variant: 'destructive'
      });
      return false;
    }
  }, [onRoomsChanged]);

  // Handler for client linking
  const handleLinkClient = useCallback(async (roomId: string, clientId: string) => {
    try {
      console.log(`RoomMap.handleLinkClient - roomId: ${roomId}, clientId: ${clientId}`);
      const success = await linkClientToRoom(roomId, clientId);
      if (success && onRoomsChanged) {
        // Ensure UI gets updated after linking the client
        console.log("Client linked successfully, refreshing UI");
        onRoomsChanged();
      }
      return success;
    } catch (error) {
      console.error("Error linking client to room:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível vincular o cliente à sala.',
        variant: 'destructive'
      });
      return false;
    }
  }, [onRoomsChanged]);

  // Handler for client unlinking
  const handleUnlinkClient = useCallback(async (roomId: string) => {
    try {
      console.log(`RoomMap.handleUnlinkClient - roomId: ${roomId}`);
      const success = await unlinkClientFromRoom(roomId);
      console.log(`API call result for unlinking: ${success}`);
      
      if (success && onRoomsChanged) {
        console.log("Client unlinked successfully, refreshing UI");
        // Use setTimeout to ensure the database has processed the changes
        setTimeout(() => {
          onRoomsChanged();
        }, 500);
      }
      return success;
    } catch (error) {
      console.error("Error unlinking client from room:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível desvincular o cliente da sala.',
        variant: 'destructive'
      });
      return false;
    }
  }, [onRoomsChanged]);

  // Handler for updating room details
  const handleUpdateRoomDetails = useCallback(async (roomId: string, data: { area?: number, capacity?: number }) => {
    try {
      console.log(`RoomMap.handleUpdateRoomDetails - roomId: ${roomId}, data:`, data);
      const success = await updateRoomDetails(roomId, data);
      if (success && onRoomsChanged) {
        console.log("Room details updated successfully, refreshing UI");
        onRoomsChanged();
      }
      return success;
    } catch (error) {
      console.error("Error updating room details:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar os detalhes da sala.',
        variant: 'destructive',
      });
      return false;
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
