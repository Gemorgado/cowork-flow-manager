
import React from 'react';
import { Room } from '@/types';
import { RoomCard } from './RoomCard';

interface RoomGridProps {
  rooms: Room[];
  onUpdateStatus?: (roomId: string, status: Room['status']) => void;
  onLinkClient?: (roomId: string, clientId: string) => void;
}

export function RoomGrid({ 
  rooms, 
  onUpdateStatus,
  onLinkClient
}: RoomGridProps) {
  // Get the floor from the first room to determine layout
  const floor = rooms.length > 0 ? rooms[0].floor : 1;
  
  // Different grid layouts based on floor and room count
  const getGridClasses = () => {
    // Base grid classes for responsiveness
    let baseClasses = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
    
    // Adjust for different floor layouts
    switch (floor) {
      case 1: // 7 rooms on floor 1 (101-107)
        return `${baseClasses} lg:grid-cols-4 xl:grid-cols-7`;
      case 2: // 19 rooms on floor 2 (201-219)
        return `${baseClasses} lg:grid-cols-5 xl:grid-cols-7`;
      case 3: // 10 rooms on floor 3 (301-310)
        return `${baseClasses} lg:grid-cols-4 xl:grid-cols-5`;
      default:
        return `${baseClasses} lg:grid-cols-4`;
    }
  };

  console.log("RoomGrid rendering with", rooms.length, "rooms for floor", floor);

  return (
    <div className={`mt-6 grid ${getGridClasses()} gap-3 sm:gap-4 p-2 sm:p-4`}>
      {rooms.map(room => (
        <RoomCard 
          key={room.id} 
          room={room} 
          onUpdateStatus={onUpdateStatus}
          onLinkClient={onLinkClient}
        />
      ))}
    </div>
  );
}
