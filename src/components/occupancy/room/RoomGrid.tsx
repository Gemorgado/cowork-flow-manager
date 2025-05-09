
import React, { useState } from 'react';
import { Room } from '@/types';
import { RoomCard } from './RoomCard';

interface RoomGridProps {
  rooms: Room[];
  onUpdateStatus?: (roomId: string, status: Room['status']) => void;
  onLinkClient?: (roomId: string, clientId: string) => void;
  onUpdateRoomDetails?: (roomId: string, data: { area?: number, capacity?: number }) => void;
  getClientInfo?: (clientId?: string) => string;
}

export const RoomGrid: React.FC<RoomGridProps> = ({
  rooms,
  onUpdateStatus,
  onLinkClient,
  onUpdateRoomDetails,
  getClientInfo
}) => {
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          hoveredRoomId={hoveredRoomId}
          setHoveredRoomId={setHoveredRoomId}
          onUpdateStatus={onUpdateStatus}
          onLinkClient={onLinkClient}
          onUpdateRoomDetails={onUpdateRoomDetails}
          getClientInfo={getClientInfo}
        />
      ))}
    </div>
  );
};
