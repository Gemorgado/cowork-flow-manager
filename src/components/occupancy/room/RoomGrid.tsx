
import React from 'react';
import { Room } from '@/types';
import { RoomCard } from './RoomCard';

interface RoomGridProps {
  rooms: Room[];
}

export function RoomGrid({ rooms }: RoomGridProps) {
  // Get the floor from the first room to determine layout
  const floor = rooms.length > 0 ? rooms[0].floor : 1;
  
  // Different grid layouts based on floor
  const getGridClasses = () => {
    switch (floor) {
      case 1: // 7 rooms on floor 1 (101-107)
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7";
      case 2: // 19 rooms on floor 2 (201-219)
        return "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7";
      case 3: // 10 rooms on floor 3 (301-310)
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5";
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
    }
  };

  return (
    <div className={`mt-6 grid ${getGridClasses()} gap-2 sm:gap-4 p-2 sm:p-8`}>
      {rooms.map(room => <RoomCard key={room.id} room={room} />)}
    </div>
  );
}
