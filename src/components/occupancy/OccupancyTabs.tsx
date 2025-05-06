
import React from 'react';
import { Room, WorkStation } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RoomsTab } from './tabs/RoomsTab';
import { WorkStationsTab } from './tabs/WorkStationsTab';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Laptop, ChevronUp } from 'lucide-react';

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
  onAllocateFlexToFixed
}) => {
  const [activeTab, setActiveTab] = React.useState<string>("rooms");
  
  // Filter for current floor
  const floorRooms = rooms.filter(room => room.floor === parseInt(currentFloor) as any);

  return (
    <TooltipProvider>
      <div className="w-full space-y-4">
        <div className="flex justify-center">
          <ToggleGroup type="single" value={activeTab} onValueChange={(value) => value && setActiveTab(value)} className="w-full max-w-md">
            <ToggleGroupItem value="rooms" className="w-full flex items-center justify-center gap-2">
              <ChevronUp className="h-4 w-4" />
              <span>Salas</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="stations" className="w-full flex items-center justify-center gap-2">
              <Laptop className="h-4 w-4" />
              <span>Estações</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {activeTab === "rooms" && (
          <Card className="backdrop-blur-sm bg-white/5 border border-white/10 shadow-md shadow-black/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">{currentFloor}º Andar</CardTitle>
              <CardDescription>
                {floorRooms.length} salas | {floorRooms.filter(room => room.status === 'occupied').length} ocupadas
              </CardDescription>
            </CardHeader>
            <RoomsTab rooms={rooms} currentFloor={currentFloor} />
          </Card>
        )}
        
        {activeTab === "stations" && (
          <Card className="backdrop-blur-sm bg-white/5 border border-white/10 shadow-md shadow-black/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">{currentFloor}º Andar</CardTitle>
            </CardHeader>
            <WorkStationsTab workStations={workStations} currentFloor={currentFloor} onAllocateFlexToFixed={onAllocateFlexToFixed} />
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};
