
import React from 'react';
import { Room, WorkStation } from '@/types';
import { RoomGrid } from '../room/RoomGrid';
import { WorkStationGrid } from '../WorkStationGrid';

interface FloorMapContentProps {
  activeView: 'unified' | 'rooms' | 'stations';
  rooms: Room[] | null;
  workStations: WorkStation[] | null;
  floor: string;
}

export function FloorMapContent({ 
  activeView, 
  rooms, 
  workStations,
  floor 
}: FloorMapContentProps) {
  if (!rooms && !workStations) return null;
  
  const hasRooms = rooms && rooms.length > 0;
  const hasWorkstations = workStations && workStations.length > 0;
  
  return (
    <div className="space-y-8">
      {(activeView === 'unified' || activeView === 'rooms') && hasRooms && (
        <div className={activeView === 'unified' ? 'mb-10' : ''}>
          <h3 className="text-lg font-medium mb-4">Salas</h3>
          <RoomGrid rooms={rooms} />
        </div>
      )}
      
      {(activeView === 'unified' || activeView === 'stations') && hasWorkstations && (
        <div>
          <h3 className="text-lg font-medium mb-4">Estações de Trabalho</h3>
          <WorkStationGrid 
            workStations={workStations} 
            currentFloor={floor} 
          />
        </div>
      )}
    </div>
  );
}
