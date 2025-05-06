
import React from 'react';
import { cn } from '@/lib/utils';
import { WorkStation } from '@/types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { StationDialogContent } from './StationDialogContent';
import { statusColors } from '../StatusLegend';

interface FixedStationProps {
  station: WorkStation;
  getClientInfo: (clientId?: string) => string;
  onAllocateFlexToFixed: () => void;
  allocatingFlexToFixed: boolean;
}

export const FixedStation: React.FC<FixedStationProps> = ({
  station,
  getClientInfo,
  onAllocateFlexToFixed,
  allocatingFlexToFixed,
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
        <StationDialogContent 
          station={station}
          getClientInfo={getClientInfo}
          onAllocate={onAllocateFlexToFixed}
          allocatingFlexToFixed={allocatingFlexToFixed}
        />
      </DialogContent>
    </Dialog>
  );
};
