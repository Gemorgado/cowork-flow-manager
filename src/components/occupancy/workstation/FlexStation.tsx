
import React from 'react';
import { cn } from '@/lib/utils';
import { WorkStation } from '@/types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { StationDialogContent } from './StationDialogContent';
import { statusColors } from '../StatusLegend';

interface FlexStationProps {
  station: WorkStation;
  getClientInfo: (clientId?: string) => string;
}

export const FlexStation: React.FC<FlexStationProps> = ({
  station,
  getClientInfo,
}) => {
  const statusLabels: Record<string, string> = {
    'available': 'Livre',
    'occupied': 'Ocupado',
    'flex': 'Flex',
    'reserved': 'Reservado',
    'maintenance': 'Manutenção',
  };

  return (
    <Dialog>
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
        <StationDialogContent 
          station={station}
          getClientInfo={getClientInfo}
        />
      </DialogContent>
    </Dialog>
  );
};
