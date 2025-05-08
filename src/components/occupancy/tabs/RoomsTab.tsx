
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Room, LocationStatus } from '@/types';
import { RoomMap } from '../RoomMap';
import { Skeleton } from '@/components/ui/skeleton';

interface RoomsTabProps {
  rooms: Room[];
  currentFloor: string;
  isLoading?: boolean;
  onDataChange?: () => void;
}

export const RoomsTab: React.FC<RoomsTabProps> = ({
  rooms,
  currentFloor,
  isLoading = false,
  onDataChange
}) => {
  return (
    <CardContent>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <RoomMap 
          rooms={rooms} 
          currentFloor={currentFloor} 
          onRoomsChanged={onDataChange}
        />
      )}
    </CardContent>
  );
};
