
import React from 'react';
import { WorkStation, LocationStatus } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { StationDialogContent } from './workstation/StationDialogContent';
import { EmptyFloorMessage } from './workstation/EmptyFloorMessage';
import { StationCard } from './workstation/StationCard';
import { mockClients } from './room/RoomUtils';

interface WorkStationGridProps {
  workStations: WorkStation[];
  currentFloor: string;
  onAllocateFlexToFixed?: (stationId: string, clientId: string) => void;
  onUpdateStatus?: (stationId: string, status: LocationStatus) => Promise<boolean>;
  onLinkClient?: (stationId: string, clientId: string) => void;
  clients?: Array<{id: string, companyName: string}>;
}

export const WorkStationGrid: React.FC<WorkStationGridProps> = ({
  workStations,
  currentFloor,
  onAllocateFlexToFixed,
  onUpdateStatus,
  onLinkClient,
  clients = []
}) => {
  // Get the actual client name from the clients array
  const getActualClientName = (clientId?: string): string => {
    if (!clientId) return '';
    const client = clients.find(c => c.id === clientId);
    return client ? client.companyName : mockClients.find(c => c.id === clientId)?.name || `Cliente ${clientId.substring(0, 5)}`;
  };

  // Filter stations by floor
  const floorStations = workStations.filter(
    (station) => station.floor === parseInt(currentFloor) as any
  );
  
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
      <EmptyFloorMessage message="O 3º andar não possui estações de trabalho." />
    );
  }
  
  // If there are no stations for this floor, show a message
  if (floorStations.length === 0) {
    return (
      <EmptyFloorMessage 
        message="Nenhuma estação de trabalho encontrada para o 3º andar.
                Use o botão 'Popular Dados' para criar estações de exemplo." 
      />
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
        <div key={`row-${rowIndex}-${currentFloor}`} className="flex gap-4 mb-4 justify-center">
          {row.map(station => (
            <Dialog key={`station-${station.id}`}>
              <StationCard 
                station={station} 
                getStationStatusStyles={getStationStatusStyles}
                getClientName={getActualClientName}
              />
              <DialogContent className="sm:max-w-md">
                <StationDialogContent
                  station={station}
                  getClientInfo={(clientId) => getActualClientName(clientId)}
                  onAllocate={() => onAllocateFlexToFixed && onAllocateFlexToFixed(station.id, 'client1')}
                  onUpdateStatus={onUpdateStatus ? async (status) => {
                    if (onUpdateStatus) {
                      return await onUpdateStatus(station.id, status);
                    }
                    return false;
                  } : undefined}
                  onLinkClient={onLinkClient ? (clientId) => onLinkClient(station.id, clientId) : undefined}
                  availableClients={clients.length > 0 ? clients.map(c => ({ id: c.id, name: c.companyName })) : mockClients}
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ))}
    </div>
  );
}
