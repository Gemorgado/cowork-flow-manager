
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Room } from '@/types';
import { RoomMap } from '../RoomMap';
import { Skeleton } from '@/components/ui/skeleton';

interface RoomsTabProps {
  rooms: Room[];
  currentFloor: string;
  isLoading?: boolean;
}

export const RoomsTab: React.FC<RoomsTabProps> = ({
  rooms,
  currentFloor,
  isLoading = false,
}) => {
  return (
    <CardContent className="pt-2">
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="w-24 h-20 rounded-2xl" />
          ))}
        </div>
      ) : (
        <RoomMap rooms={rooms} currentFloor={currentFloor} />
      )}
    </CardContent>
  );
};
