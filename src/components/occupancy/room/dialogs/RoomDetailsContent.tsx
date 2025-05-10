
import React, { useState, useCallback } from 'react';
import { Room, LocationStatus } from '@/types';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RoomDetailsHeader } from './room-details/RoomDetailsHeader';
import { RoomDetailsContainer } from './room-details/RoomDetailsContainer';
import { RoomClientActions } from './room-details/RoomClientActions';
import { RoomEditFooter } from './room-details/RoomEditFooter';

interface RoomDetailsDialogContentProps {
  room: Room;
  getClientInfo: (clientId?: string) => string;
  onClose?: () => void;
  onUpdateStatus?: (roomId: string, status: LocationStatus) => Promise<boolean>;
  onLinkClient?: (roomId: string, clientId: string) => void;
  onUnlinkClient?: (roomId: string) => void;
  onUpdateRoomDetails?: (roomId: string, data: { area?: number, capacity?: number }) => void;
  availableClients?: { id: string; companyName: string }[];
  openLinkDialog?: (room: Room) => void;
}

export const RoomDetailsDialogContent: React.FC<RoomDetailsDialogContentProps> = ({
  room,
  getClientInfo,
  onClose,
  onUpdateStatus,
  onLinkClient,
  onUnlinkClient,
  onUpdateRoomDetails,
  availableClients,
  openLinkDialog
}) => {
  // State for handling the current status
  const [selectedStatus, setSelectedStatus] = useState<LocationStatus>(room.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // State for editing room details
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [area, setArea] = useState(room.area);
  const [capacity, setCapacity] = useState(room.capacity);
  
  // Handler for status change
  const handleStatusChange = useCallback(async (status: LocationStatus) => {
    if (!onUpdateStatus) return;
    
    setIsUpdatingStatus(true);
    try {
      const success = await onUpdateStatus(room.id, status);
      
      if (success) {
        setSelectedStatus(status);
      }
    } catch (error) {
      console.error("Error updating room status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [room.id, onUpdateStatus]);
  
  // Handler for saving room details
  const handleSave = useCallback(() => {
    if (!onUpdateRoomDetails) return;
    
    setIsSaving(true);
    try {
      console.log(`Saving room details for ${room.id}:`, { area, capacity });
      // Create an object with only the properties that have changed
      const updates: { area?: number, capacity?: number } = {};
      if (area !== room.area) updates.area = area;
      if (capacity !== room.capacity) updates.capacity = capacity;
      
      // Only make the API call if there are actual changes
      if (Object.keys(updates).length > 0) {
        onUpdateRoomDetails(room.id, updates);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving room details:", error);
    } finally {
      setIsSaving(false);
    }
  }, [room.id, area, capacity, room.area, room.capacity, onUpdateRoomDetails]);
  
  // Handler for canceling edits
  const handleCancelEdit = useCallback(() => {
    setArea(room.area);
    setCapacity(room.capacity);
    setIsEditing(false);
  }, [room.area, room.capacity]);
  
  return (
    <>
      <DialogHeader className="pb-2">
        <DialogTitle>Sala {room.number}</DialogTitle>
        <RoomDetailsHeader 
          floor={room.floor} 
          number={room.number} 
        />
      </DialogHeader>

      <RoomDetailsContainer 
        room={room}
        selectedStatus={selectedStatus}
        area={area}
        capacity={capacity}
        isEditing={isEditing}
        getClientInfo={getClientInfo}
        onStatusChange={handleStatusChange}
        onAreaChange={setArea}
        onCapacityChange={setCapacity}
      />
      
      <RoomClientActions 
        room={room}
        onLinkClient={openLinkDialog}
        onUnlinkClient={onUnlinkClient}
      />
      
      <RoomEditFooter 
        isEditing={isEditing}
        isSaving={isSaving}
        onSave={handleSave}
        onCancel={handleCancelEdit}
        onStartEditing={() => setIsEditing(true)}
      />
    </>
  );
};
