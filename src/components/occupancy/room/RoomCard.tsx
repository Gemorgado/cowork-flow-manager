
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Room } from '@/types';
import { statusColors, statusLabels } from '../StatusLegend';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface RoomCardProps {
  room: Room;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get client name for display
  const getClientName = (clientId?: string) => {
    if (!clientId) return "Nenhum cliente";
    // In a real app, you would fetch the client name
    return `Cliente #${clientId.replace('client', '')}`;
  };

  return (
    <Dialog key={room.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <div
              className={cn(
                "rounded-xl backdrop-blur-sm bg-white/5 p-3 flex flex-col",
                "shadow-md shadow-black/10 cursor-pointer",
                "hover:-translate-y-0.5 hover:shadow-lg/20 transition-all duration-150",
                statusColors[room.status].replace('bg-', 'bg-opacity-20 bg-')
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="text-sm font-medium mb-1 text-muted-foreground">{room.number}</span>
              <Badge 
                variant="outline" 
                className={cn(
                  "w-fit px-2 py-0.5 rounded-full text-xs",
                  statusColors[room.status].replace('bg-', 'bg-opacity-90 bg-')
                )}
              >
                {statusLabels[room.status]}
              </Badge>
              {room.clientId && (
                <div className="mt-1 text-[9px] text-muted-foreground truncate">
                  {getClientName(room.clientId)}
                </div>
              )}
            </div>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="backdrop-blur-md bg-black/40 border-white/10">
          <div className="p-1 text-sm">
            <div className="font-medium">Sala {room.number}</div>
            <div>Status: {statusLabels[room.status]}</div>
            <div>Área: {room.area}m²</div>
            <div>Capacidade: {room.capacity} pessoas</div>
            {room.clientId && <div>Cliente: {getClientName(room.clientId)}</div>}
          </div>
        </TooltipContent>
      </Tooltip>
    </Dialog>
  );
};
