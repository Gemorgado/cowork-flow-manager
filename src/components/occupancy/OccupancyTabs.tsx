
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Room, WorkStation } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RoomsTab } from './tabs/RoomsTab';
import { WorkStationsTab } from './tabs/WorkStationsTab';

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
  // Filter for current floor
  const floorRooms = rooms.filter((room) => room.floor === parseInt(currentFloor) as any);
  
  return (
    <TooltipProvider>
      <Tabs defaultValue="rooms" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="rooms">Salas</TabsTrigger>
          <TabsTrigger value="stations">Estações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rooms" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Salas - {currentFloor}º Andar</CardTitle>
              <CardDescription>
                Total: {floorRooms.length} salas | Ocupadas:{' '}
                {floorRooms.filter((room) => room.status === 'occupied').length}
              </CardDescription>
            </CardHeader>
            <RoomsTab 
              rooms={rooms} 
              currentFloor={currentFloor}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="stations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Estações - {currentFloor}º Andar</CardTitle>
              <CardDescription>
                Fixas: {workStations.filter(s => s.floor === parseInt(currentFloor) && s.type === 'fixed').length} | 
                Flex: {workStations.filter(s => s.floor === parseInt(currentFloor) && s.type === 'flex').length}
              </CardDescription>
            </CardHeader>
            <WorkStationsTab 
              workStations={workStations}
              currentFloor={currentFloor}
              onAllocateFlexToFixed={onAllocateFlexToFixed}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
};
