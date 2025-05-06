
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Room } from '@/types';
import { statusColors, statusLabels } from './StatusLegend';

interface RoomMapProps {
  rooms: Room[];
  currentFloor: string;
}

export const RoomMap: React.FC<RoomMapProps> = ({ rooms, currentFloor }) => {
  const floorRooms = rooms.filter((room) => room.floor === parseInt(currentFloor) as any);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Salas - {currentFloor}º Andar</CardTitle>
        <CardDescription>
          Total: {floorRooms.length} salas | Ocupadas:{' '}
          {floorRooms.filter((room) => room.status === 'occupied').length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="floor-map grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {floorRooms.map((room) => (
            <div
              key={room.id}
              className={cn(
                "room border-2 rounded-md p-3 cursor-pointer transition-all text-center relative",
                statusColors[room.status]
              )}
            >
              <div className="text-lg font-bold">{room.number}</div>
              <div className="text-xs text-gray-600">
                {room.area}m² | {room.capacity} pessoas
              </div>
              <div className="text-xs mt-1 font-medium">
                {statusLabels[room.status]}
              </div>
              {room.clientId && (
                <Badge variant="secondary" className="mt-2 w-full">
                  Cliente #{room.clientId.replace('client', '')}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
