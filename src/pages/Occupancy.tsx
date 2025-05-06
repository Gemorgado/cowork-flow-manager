
import React, { useState } from 'react';
import { generateRooms, generateWorkStations } from '@/mock/locations';
import { OccupancyFloorSelector } from '@/components/occupancy/OccupancyFloorSelector';
import { OccupancyStats, calculateOccupancyRate } from '@/components/occupancy/OccupancyStats';
import { StatusLegend } from '@/components/occupancy/StatusLegend';
import { OccupancyTabs } from '@/components/occupancy/OccupancyTabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Occupancy = () => {
  const [currentFloor, setCurrentFloor] = useState<string>('1');
  const [rooms] = useState(generateRooms());
  const [workStations] = useState(generateWorkStations());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const floorRooms = rooms.filter((room) => room.floor === parseInt(currentFloor) as any);
  const floorStations = workStations.filter(
    (station) => station.floor === parseInt(currentFloor) as any
  );

  const roomOccupancy = calculateOccupancyRate(floorRooms);
  const stationOccupancy = calculateOccupancyRate(floorStations);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate a refresh - in a real app this would fetch new data
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mapa de Ocupação</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Atualizar
          </Button>
          <OccupancyFloorSelector 
            currentFloor={currentFloor} 
            setCurrentFloor={setCurrentFloor} 
          />
        </div>
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
      
      {/* Summary section */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h2 className="text-lg font-semibold mb-2">Resumo da Ocupação</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total de Salas</p>
            <p className="text-xl font-bold">{rooms.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total de Estações</p>
            <p className="text-xl font-bold">{workStations.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Taxa de Ocupação Total</p>
            <p className="text-xl font-bold">
              {Math.round(
                ((rooms.filter(r => r.status === 'occupied').length + 
                workStations.filter(s => s.status === 'occupied').length) / 
                (rooms.length + workStations.length)) * 100
              )}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Occupancy;

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
