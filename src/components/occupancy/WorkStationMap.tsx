
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { WorkStation } from '@/types';
import { statusColors, statusLabels } from './StatusLegend';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface WorkStationMapProps {
  workStations: WorkStation[];
  currentFloor: string;
}

export const WorkStationMap: React.FC<WorkStationMapProps> = ({ workStations, currentFloor }) => {
  const floorStations = workStations.filter(
    (station) => station.floor === parseInt(currentFloor) as any
  );

  const fixedStations = floorStations.filter((station) => station.type === 'fixed');
  const flexStations = floorStations.filter((station) => station.type === 'flex');

  // Calculate flex occupancy rate
  const flexOccupancyRate = flexStations.length > 0 
    ? Math.round((flexStations.filter(s => s.status === 'occupied').length / flexStations.length) * 100) 
    : 0;

  // Function to get client info for tooltip
  const getClientInfo = (clientId?: string) => {
    if (!clientId) return "Nenhum cliente";
    // In a real app, we would fetch client details here
    return `Cliente #${clientId.replace('client', '')}`;
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
                  {station.status === 'occupied' ? 'Ocupado' : 'Livre'}
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
          
          <div className="pt-4">
            <p className="text-sm font-medium mb-2">Ações</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Editar</Button>
              <Button variant="default" size="sm">Vincular Cliente</Button>
              {station.clientId && (
                <Button variant="destructive" size="sm">Desvincular</Button>
              )}
            </div>
          </div>
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
                <div className="text-[10px] font-medium">Flex</div>
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
            <div>
              <p className="text-sm font-medium mb-1">Cliente</p>
              <p>{getClientInfo(station.clientId)}</p>
            </div>
          </div>
          
          <div className="pt-4">
            <p className="text-sm font-medium mb-2">Ações</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Editar</Button>
              <Button variant="default" size="sm">Vincular Cliente</Button>
              {station.clientId && (
                <Button variant="destructive" size="sm">Desvincular</Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Render flex occupancy meter (donut chart)
  const renderFlexOccupancyMeter = () => {
    if (flexStations.length === 0) return null;
    
    const occupiedCount = flexStations.filter(s => s.status === 'occupied').length;
    const circumference = 2 * Math.PI * 30; // 30 is the radius
    const dashOffset = circumference * (1 - (occupiedCount / flexStations.length));
    
    return (
      <div className="flex flex-col items-center mb-8">
        <h4 className="text-lg font-medium mb-2">Ocupação Flex</h4>
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
              stroke="#4ade80"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{flexOccupancyRate}%</div>
              <div className="text-xs text-gray-500">Ocupação</div>
              <div className="text-xs text-gray-500">{occupiedCount}/{flexStations.length}</div>
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
        {/* Flex occupancy meter (donut chart) */}
        {flexStations.length > 0 && renderFlexOccupancyMeter()}
        
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
