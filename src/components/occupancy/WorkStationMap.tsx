
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { WorkStation } from '@/types';
import { statusColors, statusLabels } from './StatusLegend';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';

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
  
  const floorStations = workStations.filter(
    (station) => station.floor === parseInt(currentFloor) as any
  );

  const fixedStations = floorStations.filter((station) => station.type === 'fixed');
  const flexStations = floorStations.filter((station) => station.type === 'flex');

  // Calculate flex occupancy rate
  const flexOccupancyRate = flexStations.length > 0 
    ? Math.round((flexStations.filter(s => s.status === 'flex' || s.status === 'occupied').length / flexStations.length) * 100) 
    : 0;

  // Total flex stations across all floors
  const totalFlexStations = workStations.filter(s => s.type === 'flex');
  const totalFlexOccupied = workStations.filter(s => s.type === 'flex' && (s.status === 'flex' || s.status === 'occupied')).length;
  const totalFlexOccupancyRate = totalFlexStations.length > 0
    ? Math.round((totalFlexOccupied / totalFlexStations.length) * 100)
    : 0;

  // Function to get client info for tooltip
  const getClientInfo = (clientId?: string) => {
    if (!clientId) return "Nenhum cliente";
    // In a real app, we would fetch client details here
    return `Cliente #${clientId.replace('client', '')}`;
  };

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

  // Render fixed workstation with tooltip and dialog
  const renderFixedStation = (station: WorkStation) => (
    <Dialog key={station.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <div
              className={cn(
                "workstation w-16 h-16 rounded-full flex items-center justify-center transition-all border-2",
                statusColors[station.status]
              )}
            >
              <div className="text-center">
                <div className="font-bold">{station.number.split('-')[1]}</div>
                <div className="text-[10px] font-medium">
                  {statusLabels[station.status]}
                </div>
              </div>
            </div>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <div className="p-1">
            <div className="font-bold">Estação {station.number}</div>
            <div>Tipo: Fixa</div>
            <div>Status: {statusLabels[station.status]}</div>
            <div>Cliente: {getClientInfo(station.clientId)}</div>
            {station.clientId && <div>Contrato até: 31/12/2023</div>}
          </div>
        </TooltipContent>
      </Tooltip>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Estação {station.number}</DialogTitle>
          <DialogDescription>
            {station.status === 'flex' 
              ? "Esta estação está marcada como Flex e pode ser convertida para uso fixo." 
              : "Gerencie as informações desta estação fixa."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Tipo</p>
              <p>Fixa</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Status</p>
              <p>{statusLabels[station.status]}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Cliente</p>
              <p>{getClientInfo(station.clientId)}</p>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            {station.status === 'flex' ? (
              <Button 
                onClick={handleAllocateFlexToFixed} 
                disabled={allocatingFlexToFixed}
              >
                {allocatingFlexToFixed ? 'Convertendo...' : 'Converter para Uso Fixo'}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Editar</Button>
                <Button variant="default" size="sm">Vincular Cliente</Button>
                {station.clientId && (
                  <Button variant="destructive" size="sm">Desvincular</Button>
                )}
              </div>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Render flex station with tooltip and dialog
  const renderFlexStation = (station: WorkStation) => (
    <Dialog key={station.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <div
              className={cn(
                "workstation w-16 h-16 rounded-full flex items-center justify-center transition-all border-2 border-dashed",
                statusColors[station.status]
              )}
            >
              <div className="text-center">
                <div className="font-bold">{station.number.split('-')[1]}</div>
                <div className="text-[10px] font-medium">
                  {station.status === 'flex' ? 'Flex' : statusLabels[station.status]}
                </div>
              </div>
            </div>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <div className="p-1">
            <div className="font-bold">Estação {station.number}</div>
            <div>Tipo: Flex</div>
            <div>Status: {statusLabels[station.status]}</div>
            <div>Cliente: {getClientInfo(station.clientId)}</div>
            {station.clientId && <div>Contrato até: 31/12/2023</div>}
          </div>
        </TooltipContent>
      </Tooltip>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Estação Flex {station.number}</DialogTitle>
          <DialogDescription>
            Estações Flex são compartilhadas e não representam posições físicas específicas.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Tipo</p>
              <p>Flex</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Status</p>
              <p>{statusLabels[station.status]}</p>
            </div>
            {station.clientId && (
              <div>
                <p className="text-sm font-medium mb-1">Cliente</p>
                <p>{getClientInfo(station.clientId)}</p>
              </div>
            )}
          </div>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" size="sm">Editar</Button>
            {station.status !== 'occupied' && (
              <Button variant="default" size="sm">Alocar Cliente</Button>
            )}
            {station.clientId && (
              <Button variant="destructive" size="sm">Desalocar</Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Render flex occupancy meter (donut chart)
  const renderFlexOccupancyMeter = (occupancyRate: number, occupied: number, total: number, title: string) => {
    const circumference = 2 * Math.PI * 30; // 30 is the radius
    const dashOffset = circumference * (1 - (occupied / total));
    
    return (
      <div className="flex flex-col items-center">
        <h4 className="text-lg font-medium mb-2">{title}</h4>
        <div className="relative w-32 h-32">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="30"
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="30"
              fill="transparent"
              stroke="#eab308" // Yellow for flex
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <div className="text-xs text-gray-500">Ocupação</div>
              <div className="text-xs text-gray-500">{occupied}/{total}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estações - {currentFloor}º Andar</CardTitle>
        <CardDescription>
          Fixas: {fixedStations.length} | Flex: {flexStations.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Global Flex occupancy meter (donut chart) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {flexStations.length > 0 && (
            renderFlexOccupancyMeter(
              flexOccupancyRate, 
              flexStations.filter(s => s.status === 'flex' || s.status === 'occupied').length, 
              flexStations.length,
              "Ocupação Flex (Andar Atual)"
            )
          )}
          
          {totalFlexStations.length > 0 && (
            renderFlexOccupancyMeter(
              totalFlexOccupancyRate, 
              totalFlexOccupied, 
              totalFlexStations.length,
              "Ocupação Flex (Global)"
            )
          )}
        </div>
        
        {fixedStations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Estações Fixas</h3>
            <div className="floor-map grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
              {fixedStations.map(station => renderFixedStation(station))}
            </div>
          </div>
        )}

        {flexStations.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Estações Flex</h3>
            <div className="floor-map grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
              {flexStations.map(station => renderFlexStation(station))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
