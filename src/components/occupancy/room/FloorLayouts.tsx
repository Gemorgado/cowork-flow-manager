
import React from 'react';
import { Room } from '@/types';
import { RoomCard } from './RoomCard';

interface FloorLayoutProps {
  rooms: Room[];
  floorRooms: Room[];
  hoveredRoomId: string | null;
  setHoveredRoomId: (id: string | null) => void;
  getClientInfo: (clientId?: string) => string;
}

export const StandardFloorLayout: React.FC<FloorLayoutProps> = ({ 
  floorRooms,
  hoveredRoomId,
  setHoveredRoomId,
  getClientInfo
}) => {
  const getFloorLayout = () => {
    return floorRooms.length <= 7 
      ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-7'
      : floorRooms.length <= 10 
        ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-6'
        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  return (
    <div className={`floor-map grid ${getFloorLayout()} gap-4`}>
      {floorRooms.map(room => (
        <RoomCard 
          key={room.id} 
          room={room} 
          hoveredRoomId={hoveredRoomId}
          setHoveredRoomId={setHoveredRoomId}
          getClientInfo={getClientInfo}
        />
      ))}
    </div>
  );
};

export const Floor2Layout: React.FC<FloorLayoutProps> = ({ 
  floorRooms, 
  hoveredRoomId, 
  setHoveredRoomId,
  getClientInfo
}) => {
  // Salas 201-207 (primeira fileira)
  const topRow = floorRooms.filter(room => {
    const roomNum = parseInt(room.number);
    return roomNum >= 201 && roomNum <= 207;
  });
  
  // Salas 208-212 (coluna direita)
  const rightColumn = floorRooms.filter(room => {
    const roomNum = parseInt(room.number);
    return roomNum >= 208 && roomNum <= 212;
  });
  
  // Salas 213-219 (fileira inferior)
  const bottomRow = floorRooms.filter(room => {
    const roomNum = parseInt(room.number);
    return roomNum >= 213 && roomNum <= 219;
  });

  return (
    <div className="floor-layout-u relative">
      {/* Top row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4 mb-8">
        {topRow.map(room => (
          <RoomCard 
            key={room.id} 
            room={room} 
            hoveredRoomId={hoveredRoomId}
            setHoveredRoomId={setHoveredRoomId}
            getClientInfo={getClientInfo}
          />
        ))}
      </div>
      
      {/* Middle section (right column and empty space) */}
      <div className="grid grid-cols-5 gap-4 mb-8 hidden lg:grid">
        <div className="col-span-4"></div>
        <div className="col-span-1">
          <div className="grid grid-cols-1 gap-4">
            {rightColumn.map(room => (
              <RoomCard 
                key={room.id} 
                room={room} 
                hoveredRoomId={hoveredRoomId}
                setHoveredRoomId={setHoveredRoomId}
                getClientInfo={getClientInfo}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Middle section for mobile and tablet */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 lg:hidden">
        {rightColumn.map(room => (
          <RoomCard 
            key={room.id} 
            room={room} 
            hoveredRoomId={hoveredRoomId}
            setHoveredRoomId={setHoveredRoomId}
            getClientInfo={getClientInfo}
          />
        ))}
      </div>
      
      {/* Bottom row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4">
        {bottomRow.map(room => (
          <RoomCard 
            key={room.id} 
            room={room} 
            hoveredRoomId={hoveredRoomId}
            setHoveredRoomId={setHoveredRoomId}
            getClientInfo={getClientInfo}
          />
        ))}
      </div>
    </div>
  );
};
