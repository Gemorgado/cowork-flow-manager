
import React, { useState, useCallback } from 'react';
import { generateRooms, generateWorkStations, getRandomStatus } from '@/mock/locations';
import { OccupancyFloorSelector } from '@/components/occupancy/OccupancyFloorSelector';
import { OccupancyStats, calculateOccupancyRate } from '@/components/occupancy/OccupancyStats';
import { StatusLegend } from '@/components/occupancy/StatusLegend';
import { OccupancyTabs } from '@/components/occupancy/OccupancyTabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { WorkStation, LocationStatus } from '@/types';
import { toast } from 'sonner';

// Helper function to find a random available workstation
const findRandomAvailableStation = (workStations: WorkStation[]): WorkStation | null => {
  const availableStations = workStations.filter(
    station => station.status === 'available'
  );
  
  if (availableStations.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableStations.length);
  return availableStations[randomIndex];
};

const Occupancy = () => {
  const [currentFloor, setCurrentFloor] = useState<string>('1');
  const [rooms] = useState(generateRooms());
  const [workStations, setWorkStations] = useState(generateWorkStations());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const floorRooms = rooms.filter((room) => room.floor === parseInt(currentFloor) as any);
  const floorStations = workStations.filter(
    (station) => station.floor === parseInt(currentFloor) as any
  );

  const roomOccupancy = calculateOccupancyRate(floorRooms);
  const stationOccupancy = calculateOccupancyRate(floorStations);

  // Function to allocate flex stations
  const allocateFlexStations = useCallback((count: number) => {
    setWorkStations(prevStations => {
      const newStations = [...prevStations];
      let allocated = 0;
      
      // Find all available workstations
      const availableStations = newStations.filter(
        station => station.status === 'available'
      );
      
      if (availableStations.length < count) {
        toast.error(`Só foi possível alocar ${availableStations.length} estações flex. Capacidade insuficiente!`);
        count = availableStations.length;
      }
      
      // Randomly select and mark as flex
      while (allocated < count && availableStations.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableStations.length);
        const station = availableStations.splice(randomIndex, 1)[0];
        
        // Find this station in the original array and update it
        const stationIndex = newStations.findIndex(s => s.id === station.id);
        if (stationIndex !== -1) {
          newStations[stationIndex] = { ...newStations[stationIndex], status: 'flex' };
          allocated++;
        }
      }
      
      if (allocated > 0) {
        toast.success(`${allocated} estações flex foram alocadas com sucesso!`);
      }
      
      return newStations;
    });
  }, []);

  // Function to convert a flex station to fixed
  const convertFlexToFixed = useCallback((stationId: string, clientId: string) => {
    setWorkStations(prevStations => {
      const newStations = [...prevStations];
      
      // Find the station to convert
      const stationIndex = newStations.findIndex(s => s.id === stationId);
      if (stationIndex === -1 || newStations[stationIndex].status !== 'flex') {
        toast.error("Esta estação não está marcada como Flex!");
        return prevStations;
      }
      
      // Mark the station as occupied
      newStations[stationIndex] = { 
        ...newStations[stationIndex], 
        status: 'occupied',
        clientId 
      };
      
      // Find a random available station to mark as flex
      const replacement = findRandomAvailableStation(newStations);
      if (replacement) {
        const replacementIndex = newStations.findIndex(s => s.id === replacement.id);
        newStations[replacementIndex] = { ...newStations[replacementIndex], status: 'flex' };
        toast.success(`Estação ${newStations[stationIndex].number} convertida para Fixa. Uma nova estação Flex foi alocada automaticamente.`);
      } else {
        toast.warning(`Estação ${newStations[stationIndex].number} convertida para Fixa. Não há mais estações disponíveis para alocação Flex.`);
      }
      
      return newStations;
    });
  }, []);

  // Function to release flex stations
  const releaseFlexStations = useCallback((count: number) => {
    setWorkStations(prevStations => {
      const newStations = [...prevStations];
      let released = 0;
      
      // Find all flex workstations
      const flexStations = newStations.filter(
        station => station.status === 'flex'
      );
      
      if (flexStations.length < count) {
        toast.warning(`Só é possível liberar ${flexStations.length} estações flex.`);
        count = flexStations.length;
      }
      
      // Randomly select and mark as available
      while (released < count && flexStations.length > 0) {
        const randomIndex = Math.floor(Math.random() * flexStations.length);
        const station = flexStations.splice(randomIndex, 1)[0];
        
        // Find this station in the original array and update it
        const stationIndex = newStations.findIndex(s => s.id === station.id);
        if (stationIndex !== -1) {
          newStations[stationIndex] = { ...newStations[stationIndex], status: 'available', clientId: undefined };
          released++;
        }
      }
      
      if (released > 0) {
        toast.success(`${released} estações flex foram liberadas com sucesso!`);
      }
      
      return newStations;
    });
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate a refresh - in a real app this would fetch new data
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Test flex allocation
  const handleTestFlexAllocation = () => {
    allocateFlexStations(5);
  };

  // Test flex release
  const handleTestFlexRelease = () => {
    releaseFlexStations(3);
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

      {/* Test buttons for flex allocation - for demonstration */}
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={handleTestFlexAllocation}
          className="bg-yellow-50 border-yellow-300 hover:bg-yellow-100"
        >
          Alocar 5 Estações Flex (Teste)
        </Button>
        <Button 
          variant="outline" 
          onClick={handleTestFlexRelease}
          className="bg-gray-50 border-gray-300 hover:bg-gray-100"
        >
          Liberar 3 Estações Flex (Teste)
        </Button>
      </div>

      <OccupancyTabs 
        rooms={rooms} 
        workStations={workStations} 
        currentFloor={currentFloor} 
        onAllocateFlexToFixed={convertFlexToFixed}
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
          <div>
            <p className="text-sm text-gray-500">Estações Flex Alocadas</p>
            <p className="text-xl font-bold">
              {workStations.filter(s => s.status === 'flex').length}
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
