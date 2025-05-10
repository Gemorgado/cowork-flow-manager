
import React, { useState, useEffect } from 'react';
import { Room, LocationStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { RoomDetailsHeader } from './room-details/RoomDetailsHeader';
import { RoomDetailsContainer } from './room-details/RoomDetailsContainer';
import { RoomClientActions } from './room-details/RoomClientActions';
import { RoomEditFooter } from './room-details/RoomEditFooter';

export interface RoomDetailsDialogContentProps {
  room: Room;
  getClientInfo: (clientId?: string) => string;
  onClose?: () => void;
  onUpdateStatus?: (roomId: string, status: LocationStatus) => void;
  onLinkClient?: (roomId: string, clientId: string) => void;
  onUnlinkClient?: (roomId: string) => void;
  onUpdateRoomDetails?: (roomId: string, data: { area?: number, capacity?: number }) => void;
  availableClients?: {id: string, name: string}[];
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
  availableClients = [],
  openLinkDialog
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<LocationStatus>(room.status);
  const [area, setArea] = useState<number>(room.area);
  const [capacity, setCapacity] = useState<number>(room.capacity);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);

  // Reset form when room changes
  useEffect(() => {
    console.log('RoomDetailsContent: Room updated, resetting form state', room);
    setSelectedStatus(room.status);
    setArea(room.area);
    setCapacity(room.capacity);
    setIsEditing(false);
    setIsSaving(false);
    setIsUnlinking(false);
  }, [room]);

  const handleStatusChange = async (status: LocationStatus) => {
    if (!onUpdateStatus) return;
    
    console.log(`RoomDetailsContent: Changing room ${room.id} status from ${selectedStatus} to ${status}`);
    setSelectedStatus(status);
    
    try {
      // Call the update function passed from parent
      await onUpdateStatus(room.id, status);
      toast({
        title: 'Status atualizado',
        description: `Sala ${room.number} agora está ${status}.`,
      });
    } catch (error) {
      console.error('Error updating room status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status da sala.',
        variant: 'destructive',
      });
      // Reset to previous status on error
      setSelectedStatus(room.status);
    }
  };

  const handleLinkClient = async () => {
    if (!onLinkClient || !selectedClientId) return;
    
    try {
      console.log(`Linking client ${selectedClientId} to room ${room.id}`);
      await onLinkClient(room.id, selectedClientId);
      toast({
        title: 'Cliente vinculado',
        description: `Cliente vinculado à sala ${room.number}.`,
      });
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error linking client:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível vincular o cliente à sala.',
        variant: 'destructive',
      });
    }
  };

  const handleUnlinkClient = async () => {
    if (!onUnlinkClient) return;
    
    setIsUnlinking(true);
    try {
      console.log(`Unlinking client from room ${room.id}`);
      await onUnlinkClient(room.id);
      toast({
        title: 'Cliente desvinculado',
        description: `Cliente desvinculado da sala ${room.number}.`,
      });
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error unlinking client:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível desvincular o cliente da sala.',
        variant: 'destructive',
      });
    } finally {
      setIsUnlinking(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!onUpdateRoomDetails) return;
    
    setIsSaving(true);
    try {
      console.log(`Updating room ${room.id} details: area=${area}, capacity=${capacity}`);
      await onUpdateRoomDetails(room.id, { 
        area,
        capacity
      });
      
      setIsEditing(false);
      toast({
        title: 'Detalhes atualizados',
        description: `Informações da sala ${room.number} foram atualizadas.`,
      });
    } catch (error) {
      console.error('Error updating room details:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as informações da sala.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setArea(room.area);
    setCapacity(room.capacity);
    setIsEditing(false);
  };

  return (
    <>
      <RoomDetailsHeader roomNumber={room.number} />

      <div className="space-y-4 py-4">
        <RoomDetailsContainer 
          room={room}
          selectedStatus={selectedStatus}
          area={area}
          capacity={capacity}
          isEditing={isEditing}
          getClientInfo={getClientInfo}
          onStatusChange={handleStatusChange}
          onCapacityChange={setCapacity}
          onAreaChange={setArea}
        />

        <RoomClientActions
          room={room}
          selectedClientId={selectedClientId}
          setSelectedClientId={setSelectedClientId}
          availableClients={availableClients}
          openLinkDialog={openLinkDialog}
          onLinkClient={handleLinkClient}
          onUnlinkClient={handleUnlinkClient}
          isUnlinking={isUnlinking}
        />
      </div>

      <RoomEditFooter 
        isEditing={isEditing}
        isSaving={isSaving}
        onSave={handleSaveDetails}
        onCancel={handleCancelEdit}
        onStartEditing={() => setIsEditing(true)}
      />
    </>
  );
};
