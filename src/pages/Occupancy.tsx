
import React from 'react';
import { OccupancyStats } from '@/components/occupancy/OccupancyStats';
import { StatusLegend } from '@/components/occupancy/StatusLegend';
import { OccupancyTabs } from '@/components/occupancy/OccupancyTabs';
import { OccupancySummary } from '@/components/occupancy/OccupancySummary';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useSupabaseOccupancy } from '@/hooks/occupancy/useSupabaseOccupancy';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { OccupancyFloorSelector } from '@/components/occupancy/OccupancyFloorSelector';
import { OccupancyVisualizer } from '@/components/occupancy/visualization/OccupancyVisualizer';
import { OccupancyVisualizationProvider } from '@/components/occupancy/visualization/OccupancyVisualizationContext';

const Occupancy = () => {
  const {
    currentFloor,
    setCurrentFloor,
    rooms,
    workStations,
    roomOccupancy,
    stationOccupancy,
    isLoading,
    isRefreshing,
    handleRefresh,
    handleConvertFlexToFixed,
  } = useSupabaseOccupancy();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-medium">Mapa de Ocupação</h1>
        <div className="flex items-center gap-2">
          <OccupancyFloorSelector 
            currentFloor={currentFloor} 
            setCurrentFloor={setCurrentFloor} 
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-1 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10"
          >
            <RefreshCw className={cn("h-4 w-4", (isRefreshing || isLoading) && "animate-spin")} />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28 col-span-2" />
          </>
        ) : (
          <>
            <OccupancyStats 
              roomOccupancy={roomOccupancy} 
              stationOccupancy={stationOccupancy} 
            />
            <StatusLegend />
          </>
        )}
      </div>

      {/* Visualization using the new module */}
      <div className="mb-6">
        {isLoading ? (
          <Skeleton className="h-[400px]" />
        ) : (
          <OccupancyVisualizationProvider>
            <OccupancyVisualizer 
              rooms={rooms} 
              workStations={workStations}
              currentFloor={currentFloor}
            />
          </OccupancyVisualizationProvider>
        )}
      </div>

      <OccupancyTabs 
        rooms={rooms} 
        workStations={workStations} 
        currentFloor={currentFloor}
        isLoading={isLoading}
        onAllocateFlexToFixed={handleConvertFlexToFixed}
      />
      
      {!isLoading ? (
        <OccupancySummary 
          rooms={rooms.filter(room => room.floor === parseInt(currentFloor) as any)}
          workStations={workStations.filter(station => station.floor === parseInt(currentFloor) as any)}
        />
      ) : (
        <Skeleton className="h-32" />
      )}
    </div>
  );
};

export default Occupancy;
