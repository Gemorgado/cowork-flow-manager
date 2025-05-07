
import React, { useState } from 'react';
import { OccupancyStats } from '@/components/occupancy/OccupancyStats';
import { StatusLegend } from '@/components/occupancy/StatusLegend';
import { OccupancyTabs } from '@/components/occupancy/OccupancyTabs';
import { OccupancySummary } from '@/components/occupancy/OccupancySummary';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database } from 'lucide-react';
import { useSupabaseOccupancy } from '@/hooks/occupancy/useSupabaseOccupancy';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { OccupancyFloorSelector } from '@/components/occupancy/OccupancyFloorSelector';
import { seedSupabaseOccupancy } from '@/utils/seedSupabaseOccupancy';
import { toast } from '@/components/ui/use-toast';

const Occupancy = () => {
  const [currentFloor, setCurrentFloor] = useState<string>("1");
  const [isSeeding, setIsSeeding] = useState(false);
  
  const {
    rooms,
    workStations,
    roomOccupancy,
    stationOccupancy,
    isLoading,
    isRefreshing,
    handleRefresh,
    handleConvertFlexToFixed,
  } = useSupabaseOccupancy();

  console.log("Occupancy page data:", { 
    roomsCount: rooms.length, 
    workStationsCount: workStations.length,
    currentFloor 
  });

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const result = await seedSupabaseOccupancy();
      
      if (result.success) {
        toast({
          title: "Seed bem-sucedido",
          description: `Criados: ${result.roomsCount} salas e ${result.workstationsCount} estações.`,
        });
        // Refresh data after seeding
        handleRefresh();
      } else {
        toast({
          title: "Erro no seed",
          description: "Não foi possível popular os dados. Veja o console para detalhes.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Seed error:", error);
      toast({
        title: "Erro",
        description: "Falha ao popular dados",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-medium">Mapa de Ocupação</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedData}
            disabled={isSeeding || isRefreshing || isLoading}
            className="flex items-center gap-1 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10"
          >
            <Database className={cn("h-4 w-4", isSeeding && "animate-pulse")} />
            Popular Dados
          </Button>
          
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
