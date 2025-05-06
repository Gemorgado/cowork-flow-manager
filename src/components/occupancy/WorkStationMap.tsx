
import React, { useState } from 'react';
import { WorkStation } from '@/types';
import { toast } from 'sonner';
import { OccupancyMeter } from './workstation/OccupancyMeter';
import { FixedStation } from './workstation/FixedStation';
import { FlexStation } from './workstation/FlexStation';
import { getClientInfo, calculateFlexOccupancyRate } from './workstation/StationUtils';

interface WorkStationMapProps {
  workStations: WorkStation[];
  currentFloor: string;
  onAllocateFlexToFixed?: (stationId: string, clientId: string) => void;
}

export const WorkStationMap: React.FC<WorkStationMapProps> = ({ 
  workStations, 
  currentFloor,
  onAllocateFlexToFixed
}) => {
  const [selectedStation, setSelectedStation] = useState<WorkStation | null>(null);
  const [allocatingFlexToFixed, setAllocatingFlexToFixed] = useState(false);
  
  // Filter stations by floor
  const floorStations = workStations.filter(
    (station) => station.floor === parseInt(currentFloor) as any
  );

  // Separate fixed and flex stations
  const fixedStations = floorStations.filter((station) => station.type === 'fixed');
  const flexStations = floorStations.filter((station) => station.type === 'flex');

  // Calculate occupancy rates
  const currentFloorFlexOccupancy = calculateFlexOccupancyRate(
    flexStations,
    s => s.type === 'flex'
  );
  
  const totalFlexOccupancy = calculateFlexOccupancyRate(
    workStations,
    s => s.type === 'flex'
  );

  // Handle station selection
  const handleStationSelect = (station: WorkStation) => {
    setSelectedStation(station);
  };

  // Handle allocating a flex station to a fixed client
  const handleAllocateFlexToFixed = () => {
    if (!selectedStation) return;
    
    setAllocatingFlexToFixed(true);
    
    // Simulate API call to convert flex to fixed
    setTimeout(() => {
      if (onAllocateFlexToFixed && selectedStation) {
        onAllocateFlexToFixed(selectedStation.id, 'client1');
        toast.success(`Estação ${selectedStation.number} alocada com sucesso!`);
      }
      setAllocatingFlexToFixed(false);
      setSelectedStation(null);
    }, 1000);
  };

  return (
    <>
      {/* Flex occupancy meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {flexStations.length > 0 && (
          <OccupancyMeter 
            occupancyRate={currentFloorFlexOccupancy.rate} 
            occupied={currentFloorFlexOccupancy.occupied} 
            total={currentFloorFlexOccupancy.total}
            title="Ocupação Flex (Andar Atual)"
          />
        )}
        
        {workStations.filter(s => s.type === 'flex').length > 0 && (
          <OccupancyMeter 
            occupancyRate={totalFlexOccupancy.rate} 
            occupied={totalFlexOccupancy.occupied} 
            total={totalFlexOccupancy.total}
            title="Ocupação Flex (Global)"
          />
        )}
      </div>
      
      {/* Fixed stations section */}
      {fixedStations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Estações Fixas</h3>
          <div className="floor-map grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
            {fixedStations.map(station => (
              <FixedStation 
                key={station.id}
                station={station}
                getClientInfo={getClientInfo}
                onAllocateFlexToFixed={handleAllocateFlexToFixed}
                allocatingFlexToFixed={allocatingFlexToFixed}
              />
            ))}
          </div>
        </div>
      )}

      {/* Flex stations section */}
      {flexStations.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Estações Flex</h3>
          <div className="floor-map grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
            {flexStations.map(station => (
              <FlexStation
                key={station.id}
                station={station}
                getClientInfo={getClientInfo}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
