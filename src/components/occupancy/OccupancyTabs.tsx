
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Room, WorkStation } from '@/types';
import { RoomMap } from './RoomMap';
import { WorkStationMap } from './WorkStationMap';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OccupancyTabsProps {
  rooms: Room[];
  workStations: WorkStation[];
  currentFloor: string;
  onAllocateFlexToFixed?: (stationId: string, clientId: string) => void;
}

export const OccupancyTabs: React.FC<OccupancyTabsProps> = ({
  rooms,
  workStations,
  currentFloor,
  onAllocateFlexToFixed,
}) => {
  return (
    <TooltipProvider>
      <Tabs defaultValue="rooms" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="rooms">Salas</TabsTrigger>
          <TabsTrigger value="stations">Estações</TabsTrigger>
        </TabsList>
        <TabsContent value="rooms" className="mt-4">
          <RoomMap rooms={rooms} currentFloor={currentFloor} />
        </TabsContent>
        <TabsContent value="stations" className="mt-4">
          <WorkStationMap 
            workStations={workStations} 
            currentFloor={currentFloor}
            onAllocateFlexToFixed={onAllocateFlexToFixed}
          />
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
};
