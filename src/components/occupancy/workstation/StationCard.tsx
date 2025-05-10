
import React from 'react';
import { WorkStation } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { DialogTrigger } from '@/components/ui/dialog';

interface StationCardProps {
  station: WorkStation;
  getStationStatusStyles: (status: string) => string;
  getClientName: (clientId?: string) => string;
}

export const StationCard: React.FC<StationCardProps> = ({ 
  station, 
  getStationStatusStyles,
  getClientName
}) => {
  return (
    <div className="flex flex-col items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <button
              className={cn(
                "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative",
                getStationStatusStyles(station.status),
                "transition-all duration-150 hover:scale-105"
              )}
              aria-label={`Estação ${station.number}`}
            >
              {/* Display only the number without "WS-" prefix */}
              {station.number.replace('WS-', '')}
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
            {station.clientId && (
              <div>Cliente: {getClientName(station.clientId)}</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
      <span className="mt-1 text-xs md:text-sm">{station.number.replace('WS-', '')}</span>
    </div>
  );
};
