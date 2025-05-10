
import React, { useState } from 'react';
import { Room } from '@/types';
import { RoomCard } from './RoomCard';

interface RoomGridProps {
  rooms: Room[];
  onUpdateStatus?: (roomId: string, status: Room['status']) => Promise<boolean>;
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
      console.log(`RoomGrid.handleUnlinkClient called for room ${roomId}`);
      onUnlinkClient(roomId);
    }
  };

  // Function to handle status updates, making sure it returns a Promise<boolean>
  const handleUpdateStatus = async (roomId: string, status: Room['status']) => {
    console.log(`RoomGrid.handleUpdateStatus called for room ${roomId} with status ${status}`);
    
    if (onUpdateStatus) {
      try {
        return await onUpdateStatus(roomId, status);
      } catch (error) {
        console.error("Error in RoomGrid.handleUpdateStatus:", error);
        return false;
      }
    }
    
    console.warn("onUpdateStatus is not defined in RoomGrid props");
    return false;
  };

  // Sort the rooms by number
  const sortedRooms = [...rooms].sort((a, b) => {
    return parseInt(a.number) - parseInt(b.number);
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {sortedRooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          hoveredRoomId={hoveredRoomId}
          setHoveredRoomId={setHoveredRoomId}
          onUpdateStatus={handleUpdateStatus}
          onLinkClient={handleLinkClient}
          onUnlinkClient={handleUnlinkClient}
          onUpdateRoomDetails={onUpdateRoomDetails}
          getClientInfo={getClientInfo}
        />
      ))}
    </div>
  );
};
