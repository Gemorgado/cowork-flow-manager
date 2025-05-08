
import React from 'react';
import { WorkStation } from '@/types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { StationDialogContent } from './workstation/StationDialogContent';
import { getClientInfo } from './workstation/StationUtils';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

  // Get status-based styling
  const getStationStatusStyles = (status: string) => {
    if (status === 'flex') return 'bg-yellow-300 hover:bg-yellow-400 text-yellow-900';
    if (status === 'occupied') return 'bg-green-500 hover:bg-green-600 text-white';
    if (status === 'reserved') return 'bg-yellow-500 hover:bg-yellow-600 text-white';
    if (status === 'maintenance') return 'bg-red-500 hover:bg-red-600 text-white';
    return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
  };
  
  console.log("WorkStationGrid rendering with", floorStations.length, "stations for floor", currentFloor);
  
  // If floor 3, show a message that no workstations are available on this floor
  if (currentFloor === '3') {
    return (
      <div className="p-6 text-center">
        <Alert variant="default" className="justify-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            O 3º andar não possui estações de trabalho.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // If there are no stations for this floor, show a message
  if (floorStations.length === 0) {
    return (
      <div className="p-6 text-center">
        <Alert variant="default" className="justify-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Nenhuma estação de trabalho encontrada para o {currentFloor}º andar.
            <br/>
            Use o botão "Popular Dados" para criar estações de exemplo.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Group stations into rows for better display
  const stationsPerRow = currentFloor === '1' ? 7 : 8;
  const stationRows = [];
  
  for (let i = 0; i < floorStations.length; i += stationsPerRow) {
    stationRows.push(floorStations.slice(i, i + stationsPerRow));
  }

  return (
    <div className="mb-8 overflow-x-auto">
      {stationRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 mb-4 justify-center">
          {row.map(station => (
            <Dialog key={station.id}>
              <div className="flex flex-col items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <button
                        className={cn(
                          "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative",
                          getStationStatusStyles(station.status),
                          "transition-all duration-200 hover:scale-105"
                        )}
                        aria-label={`Estação ${station.number}`}
                      >
                        {station.clientId && (
                          <span className="absolute -top-1 -right-1">
                            <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                              <User className="h-3 w-3" />
                            </Badge>
                          </span>
                        )}
                      </button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>
                      <div>Estação {station.number}</div>
                      <div>Status: {station.status}</div>
                      <div>Tipo: {station.type}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
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
      ))}
    </div>
  );
}
