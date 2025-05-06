
import React from 'react';
import { Room } from '@/types';
import { RoomCard } from './RoomCard';

interface RoomGridProps {
  rooms: Room[];
}

export function RoomGrid({ rooms }: RoomGridProps) {
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-2 sm:gap-4 p-2 sm:p-8">
      {rooms.map(room => <RoomCard key={room.id} room={room} />)}
    </div>
  );
}
