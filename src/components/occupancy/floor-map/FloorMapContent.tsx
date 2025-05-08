
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
  
  // Constants for room counts per floor based on official inventory
  const totalRooms = {
    '1': 7,  // 101-107
    '2': 19, // 201-219
    '3': 10  // 301-310
  };
  
  // Constants for workstation counts per floor
  const totalWorkstations = {
    '1': 26, // WS-01 to WS-26
    '2': 38, // WS-27 to WS-64
    '3': 0   // No workstations on floor 3
  };
  
  return (
    <div className="space-y-8">
      {(activeView === 'unified' || activeView === 'rooms') && hasRooms && (
        <div className={activeView === 'unified' ? 'mb-10' : ''}>
          <h3 className="text-lg font-medium mb-4">
            Salas {floor}º Andar 
            <span className="text-sm text-muted-foreground ml-2">
              ({rooms.length}/{totalRooms[floor as keyof typeof totalRooms]})
            </span>
          </h3>
          <RoomGrid rooms={rooms} />
        </div>
      )}
      
      {(activeView === 'unified' || activeView === 'stations') && hasWorkstations && (
        <div>
          <h3 className="text-lg font-medium mb-4">
            Estações de Trabalho {floor}º Andar
            <span className="text-sm text-muted-foreground ml-2">
              ({workStations.length}/{totalWorkstations[floor as keyof typeof totalWorkstations]})
            </span>
          </h3>
          <WorkStationGrid 
            workStations={workStations} 
            currentFloor={floor} 
          />
        </div>
      )}
    </div>
  );
}
