
import React, { useState } from 'react';
import { Room } from '@/types';
import { useForm } from 'react-hook-form';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RoomEditDialog, ClientLinkDialog } from './room/RoomDialogs';
import { StandardFloorLayout, Floor2Layout } from './room/FloorLayouts';
import { getClientInfo, mockClients } from './room/RoomUtils';
import { RoomGrid } from './room/RoomGrid';

interface RoomMapProps {
  rooms: Room[];
  currentFloor: string;
}

export const RoomMap: React.FC<RoomMapProps> = ({ rooms, currentFloor }) => {
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

  // Handler for client linking
  const handleClientLink = () => {
    if (!selectedRoom || !selectedClientId) return;
    
    console.log(`Linking client ${selectedClientId} to room ${selectedRoom.id}`);
    // Here you would call your API to link the client to the room
    // For now, we'll just close the dialog
    setIsClientLinkDialogOpen(false);
  };

  console.log("RoomMap rendering with rooms:", floorRooms);
  
  return (
    <TooltipProvider>
      <div className="mb-8">
        {/* Use the RoomGrid component to display rooms in a grid layout */}
        <RoomGrid rooms={floorRooms} />
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
          handleClientLink={handleClientLink}
        />
      )}
    </TooltipProvider>
  );
};
