
import React from 'react';
import { Room, LocationStatus } from '@/types';
import { RoomStatusSelect } from './RoomStatusSelect';
import { RoomClientInfo } from './RoomClientInfo';
import { RoomBasicInfo } from './RoomBasicInfo';

interface RoomDetailsContainerProps {
  room: Room;
  selectedStatus: LocationStatus;
  area: number;
  capacity: number;
  isEditing: boolean;
  getClientInfo: (clientId?: string) => string;
  onStatusChange: (status: LocationStatus) => void;
  onCapacityChange: (value: number) => void;
  onAreaChange: (value: number) => void;
}

export const RoomDetailsContainer: React.FC<RoomDetailsContainerProps> = ({
  room,
  selectedStatus,
  area,
  capacity,
  isEditing,
  getClientInfo,
  onStatusChange,
  onCapacityChange,
  onAreaChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <RoomStatusSelect 
        selectedStatus={selectedStatus}
        onStatusChange={onStatusChange}
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
        onCapacityChange={onCapacityChange}
        onAreaChange={onAreaChange}
      />
    </div>
  );
};
