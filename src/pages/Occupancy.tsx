
import React, { useState } from 'react';
import { generateRooms, generateWorkStations } from '@/mock/locations';
import { OccupancyFloorSelector } from '@/components/occupancy/OccupancyFloorSelector';
import { OccupancyStats, calculateOccupancyRate } from '@/components/occupancy/OccupancyStats';
import { StatusLegend } from '@/components/occupancy/StatusLegend';
import { OccupancyTabs } from '@/components/occupancy/OccupancyTabs';

const Occupancy = () => {
  const [currentFloor, setCurrentFloor] = useState<string>('1');
  const [rooms] = useState(generateRooms());
  const [workStations] = useState(generateWorkStations());

  const floorRooms = rooms.filter((room) => room.floor === parseInt(currentFloor) as any);
  const floorStations = workStations.filter(
    (station) => station.floor === parseInt(currentFloor) as any
  );

  const roomOccupancy = calculateOccupancyRate(floorRooms);
  const stationOccupancy = calculateOccupancyRate(floorStations);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mapa de Ocupação</h1>
        <OccupancyFloorSelector 
          currentFloor={currentFloor} 
          setCurrentFloor={setCurrentFloor} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OccupancyStats 
          roomOccupancy={roomOccupancy} 
          stationOccupancy={stationOccupancy} 
        />
        <StatusLegend />
      </div>

      <OccupancyTabs 
        rooms={rooms} 
        workStations={workStations} 
        currentFloor={currentFloor} 
      />
    </div>
  );
};

export default Occupancy;
