
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Room, WorkStation } from '@/types';
import { RoomsTab } from './tabs/RoomsTab';
import { WorkStationsTab } from './tabs/WorkStationsTab';
import { FloorMap } from './room/FloorMap';

interface OccupancyTabsProps {
  rooms: Room[];
  workStations: WorkStation[];
  currentFloor: string;
  isLoading: boolean;
  onAllocateFlexToFixed: (stationId: string, clientId: string) => void;
}

export const OccupancyTabs: React.FC<OccupancyTabsProps> = ({
  rooms,
  workStations,
  currentFloor,
  isLoading,
  onAllocateFlexToFixed
}) => {
  return (
    <Tabs defaultValue="floor-map">
      <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/5 backdrop-blur-sm shadow-sm">
        <TabsTrigger value="floor-map">Mapa por Pavimento</TabsTrigger>
        <TabsTrigger value="rooms">Salas</TabsTrigger>
        <TabsTrigger value="workstations">Estações</TabsTrigger>
      </TabsList>
      
      <TabsContent value="floor-map" className="mt-0">
        <FloorMap />
      </TabsContent>
      
      <TabsContent value="rooms" className="mt-0">
        <RoomsTab 
          rooms={rooms.filter(room => room.floor === parseInt(currentFloor))} 
          isLoading={isLoading} 
        />
      </TabsContent>
      
      <TabsContent value="workstations" className="mt-0">
        <WorkStationsTab 
          workStations={workStations.filter(station => station.floor === parseInt(currentFloor))} 
          isLoading={isLoading}
          onAllocateFlexToFixed={onAllocateFlexToFixed}
        />
      </TabsContent>
    </Tabs>
  );
};
