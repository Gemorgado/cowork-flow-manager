
import React, { useState, useEffect } from 'react';
import { Room, LocationStatus } from '@/types';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { RoomStatusSelect } from './room-details/RoomStatusSelect';
import { RoomClientInfo } from './room-details/RoomClientInfo';
import { RoomBasicInfo } from './room-details/RoomBasicInfo';
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
    setSelectedStatus(room.status);
    setArea(room.area);
    setCapacity(room.capacity);
    setIsEditing(false);
  }, [room]);

  const handleStatusChange = (status: LocationStatus) => {
    setSelectedStatus(status);
    if (onUpdateStatus) {
      onUpdateStatus(room.id, status);
      toast({
        title: 'Status atualizado',
        description: `Sala ${room.number} agora está ${status}.`,
      });
    }
  };

  const handleLinkClient = () => {
    if (onLinkClient && selectedClientId) {
      onLinkClient(room.id, selectedClientId);
      toast({
        title: 'Cliente vinculado',
        description: `Cliente vinculado à sala ${room.number}.`,
      });
    }
  };

  const handleUnlinkClient = async () => {
    if (!onUnlinkClient) return;
    
    setIsUnlinking(true);
    try {
      await onUnlinkClient(room.id);
      if (onClose) {
        onClose();
      }
    } finally {
      setIsUnlinking(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!onUpdateRoomDetails) return;
    
    setIsSaving(true);
    try {
      await onUpdateRoomDetails(room.id, { 
        area: area,
        capacity: capacity
      });
      setIsEditing(false);
      toast({
        title: 'Detalhes atualizados',
        description: `Informações da sala ${room.number} foram atualizadas.`,
      });
    } catch (error) {
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
      <DialogHeader>
        <DialogTitle>Sala {room.number}</DialogTitle>
        <DialogDescription>
          Detalhes e informações da sala.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <RoomStatusSelect 
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
          />
          
          <RoomClientInfo 
            clientId={room.clientId}
            getClientInfo={getClientInfo}
          />
          
          <RoomBasicInfo 
            floor={room.floor}
            capacity={capacity}
            area={area}
            isEditing={isEditing}
            onCapacityChange={setCapacity}
            onAreaChange={setArea}
          />
        </div>

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
