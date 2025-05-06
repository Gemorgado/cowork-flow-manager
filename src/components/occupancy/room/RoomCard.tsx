
import React from 'react';
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
  hoveredRoomId: string | null;
  setHoveredRoomId: (id: string | null) => void;
  getClientInfo: (clientId?: string) => string;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  hoveredRoomId,
  setHoveredRoomId,
  getClientInfo
}) => {
  return (
    <Dialog key={room.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <div
              className={cn(
                "w-24 h-20 rounded-2xl p-2 flex flex-col justify-between backdrop-blur-sm",
                "shadow-md shadow-black/10 transition-all duration-150",
                "border border-white/5 cursor-pointer",
                hoveredRoomId === room.id && "shadow-lg shadow-black/10 -translate-y-0.5",
                statusColors[room.status].replace('bg-', 'bg-opacity-80 bg-')
              )}
              onMouseEnter={() => setHoveredRoomId(room.id)}
              onMouseLeave={() => setHoveredRoomId(null)}
              onFocus={() => setHoveredRoomId(room.id)}
              onBlur={() => setHoveredRoomId(null)}
            >
              <span className="text-[10px] text-muted-foreground font-medium">{room.number}</span>
              <div className="mt-auto">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "w-full justify-center text-xs font-medium ring-2 ring-white/20",
                    statusColors[room.status].replace('bg-', 'bg-opacity-90 bg-')
                  )}
                >
                  {statusLabels[room.status]}
                </Badge>
                {room.clientId && (
                  <div className="mt-1 text-[9px] text-center text-muted-foreground truncate">
                    {getClientInfo(room.clientId)}
                  </div>
                )}
              </div>
            </div>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="backdrop-blur-md bg-black/40 border-white/10">
          <div className="p-1 text-sm">
            <div className="font-medium">Sala {room.number}</div>
            <div>Status: {statusLabels[room.status]}</div>
            <div>Área: {room.area}m²</div>
            <div>Capacidade: {room.capacity} pessoas</div>
            <div>Cliente: {getClientInfo(room.clientId)}</div>
            {room.clientId && <div>Contrato até: 31/12/2023</div>}
          </div>
        </TooltipContent>
      </Tooltip>
    </Dialog>
  );
};
