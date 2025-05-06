
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Room } from '@/types';
import { RoomMap } from '../RoomMap';

interface RoomsTabProps {
  rooms: Room[];
  currentFloor: string;
}

export const RoomsTab: React.FC<RoomsTabProps> = ({
  rooms,
  currentFloor,
}) => {
  return (
    <CardContent className="pt-2">
      <RoomMap rooms={rooms} currentFloor={currentFloor} />
    </CardContent>
  );
};
