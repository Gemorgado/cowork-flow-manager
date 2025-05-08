
import React, { useState, useCallback } from 'react';
import { Room, LocationStatus } from '@/types';
import { useForm } from 'react-hook-form';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RoomEditDialog, ClientLinkDialog } from './room/RoomDialogs';
import { StandardFloorLayout, Floor2Layout } from './room/FloorLayouts';
import { getClientInfo, mockClients } from './room/RoomUtils';
import { RoomGrid } from './room/RoomGrid';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { updateRoomStatus, linkClientToRoom } from '@/hooks/occupancy/api';

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
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isClientLinkDialogOpen, setIsClientLinkDialogOpen] = useState(false);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  
  // Form for room editing with proper type definition
  const roomForm = useForm<{
    status: string;
    area: number;
    capacity: number;
  }>({
    defaultValues: {
      status: 'available',
      area: 0,
      capacity: 0
    }
  });

  // Handler for opening edit dialog
  const handleOpenEditDialog = (room: Room) => {
    setSelectedRoom(room);
    roomForm.reset({
      status: room.status,
      area: room.area,
      capacity: room.capacity
    });
    setIsEditDialogOpen(true);
  };

  // Handler for room update
  const handleRoomUpdate = (data: any) => {
    console.log("Updating room with data:", data);
    // Here you would call your API to update the room
    // For now, we'll just close the dialog
    setIsEditDialogOpen(false);
  };

  // Handler for opening client link dialog
  const handleOpenClientLinkDialog = (room: Room) => {
    setSelectedRoom(room);
    setIsClientLinkDialogOpen(true);
  };

  // Handler for updating room status
  const handleUpdateRoomStatus = useCallback(async (roomId: string, status: LocationStatus) => {
    try {
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
      const success = await linkClientToRoom(roomId, clientId);
      if (success && onRoomsChanged) {
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
  
  console.log("RoomMap rendering with rooms:", floorRooms);
  
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
        {/* Use the RoomGrid component to display rooms in a grid layout */}
        <RoomGrid 
          rooms={floorRooms} 
          onUpdateStatus={handleUpdateRoomStatus}
          onLinkClient={handleLinkClient}
        />
      </div>

      {/* Specialized floor layouts if needed */}
      {false && (parseInt(currentFloor) === 2 ? (
        <Floor2Layout 
          rooms={rooms}
          floorRooms={floorRooms}
          hoveredRoomId={hoveredRoomId}
          setHoveredRoomId={setHoveredRoomId}
          getClientInfo={getClientInfo}
        />
      ) : (
        <StandardFloorLayout 
          rooms={rooms}
          floorRooms={floorRooms}
          hoveredRoomId={hoveredRoomId}
          setHoveredRoomId={setHoveredRoomId}
          getClientInfo={getClientInfo}
        />
      ))}
      
      {/* Room edit dialog */}
      {selectedRoom && (
        <RoomEditDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          selectedRoom={selectedRoom}
          roomForm={roomForm}
          handleRoomUpdate={handleRoomUpdate}
        />
      )}
      
      {/* Client link dialog */}
      {selectedRoom && (
        <ClientLinkDialog
          isOpen={isClientLinkDialogOpen}
          onOpenChange={setIsClientLinkDialogOpen}
          selectedRoom={selectedRoom}
          selectedClientId={selectedClientId}
          setSelectedClientId={setSelectedClientId}
          mockClients={mockClients}
          handleClientLink={handleLinkClient}
        />
      )}
    </TooltipProvider>
  );
};
