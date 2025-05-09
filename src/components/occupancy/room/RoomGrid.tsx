
import React, { useState } from 'react';
import { Room } from '@/types';
import { RoomCard } from './RoomCard';

interface RoomGridProps {
  rooms: Room[];
  onUpdateStatus?: (roomId: string, status: Room['status']) => void;
  onLinkClient?: (roomId: string, clientId: string) => void;
  onUnlinkClient?: (roomId: string) => void;
  onUpdateRoomDetails?: (roomId: string, data: { area?: number, capacity?: number }) => void;
  getClientInfo?: (clientId?: string) => string;
}

export const RoomGrid: React.FC<RoomGridProps> = ({
  rooms,
  onUpdateStatus,
  onLinkClient,
  onUnlinkClient,
  onUpdateRoomDetails,
  getClientInfo
}) => {
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);

  // Function to handle client linking with proper UI update
  const handleLinkClient = (roomId: string, clientId: string) => {
    if (onLinkClient) {
      onLinkClient(roomId, clientId);
    }
  };

  // Function to handle client unlinking with proper UI update
  const handleUnlinkClient = (roomId: string) => {
    if (onUnlinkClient) {
      onUnlinkClient(roomId);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {rooms.map((room) => (
        <RoomCard
          key={room.id} // Usar apenas o ID para manter a ordem
          room={room}
          hoveredRoomId={hoveredRoomId}
          setHoveredRoomId={setHoveredRoomId}
          onUpdateStatus={onUpdateStatus}
          onLinkClient={handleLinkClient}
          onUnlinkClient={handleUnlinkClient}
          onUpdateRoomDetails={onUpdateRoomDetails}
          getClientInfo={getClientInfo}
        />
      ))}
    </div>
  );
};
