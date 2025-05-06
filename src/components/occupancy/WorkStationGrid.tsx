
import React from 'react';
import { WorkStation } from '@/types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { StationDialogContent } from './workstation/StationDialogContent';
import { getClientInfo } from './workstation/StationUtils';
import { statusColors } from './StatusLegend';
import { cn } from '@/lib/utils';

interface WorkStationGridProps {
  workStations: WorkStation[];
  currentFloor: string;
  onAllocateFlexToFixed?: (stationId: string, clientId: string) => void;
}

export const WorkStationGrid: React.FC<WorkStationGridProps> = ({
  workStations,
  currentFloor,
  onAllocateFlexToFixed,
}) => {
  // Filter stations by floor
  const floorStations = workStations.filter(
    (station) => station.floor === parseInt(currentFloor) as any
  );
  
  // Handle allocating a flex station to a fixed client
  const handleAllocateFlexToFixed = (stationId: string) => {
    if (onAllocateFlexToFixed) {
      onAllocateFlexToFixed(stationId, 'client1');
    }
  };

  return (
    <div className="mb-8">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {floorStations.map(station => (
          <Dialog key={station.id}>
            <div className="flex flex-col items-center">
              <DialogTrigger asChild>
                <button
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center",
                    station.status === 'available' ? 'bg-gray-200' : 
                    station.status === 'occupied' ? 'bg-green-500' :
                    station.status === 'flex' ? 'bg-yellow-300' :
                    station.status === 'maintenance' ? 'bg-red-500' :
                    station.status === 'reserved' ? 'bg-yellow-500' : '',
                    "hover:opacity-90 transition-opacity"
                  )}
                  aria-label={`Estação ${station.number}`}
                />
              </DialogTrigger>
              <span className="mt-1 text-xs md:text-sm">{station.number}</span>
            </div>
            <DialogContent className="sm:max-w-md">
              <StationDialogContent
                station={station}
                getClientInfo={getClientInfo}
                onAllocate={() => handleAllocateFlexToFixed(station.id)}
              />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};
