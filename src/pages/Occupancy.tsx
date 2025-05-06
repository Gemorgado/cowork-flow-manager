
import React from 'react';
import { OccupancyFloorSelector } from '@/components/occupancy/OccupancyFloorSelector';
import { OccupancyStats } from '@/components/occupancy/OccupancyStats';
import { StatusLegend } from '@/components/occupancy/StatusLegend';
import { OccupancyTabs } from '@/components/occupancy/OccupancyTabs';
import { OccupancySummary } from '@/components/occupancy/OccupancySummary';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useOccupancy } from '@/hooks/occupancy/useOccupancy';
import { cn } from '@/lib/utils';

const Occupancy = () => {
  const {
    currentFloor,
    setCurrentFloor,
    rooms,
    workStations,
    roomOccupancy,
    stationOccupancy,
    isRefreshing,
    handleRefresh,
    handleConvertFlexToFixed,
  } = useOccupancy();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-medium">Mapa de Ocupação</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10"
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
        onAllocateFlexToFixed={handleConvertFlexToFixed}
      />
      
      {/* Summary section */}
      <OccupancySummary 
        rooms={rooms}
        workStations={workStations}
      />
    </div>
  );
};

export default Occupancy;
