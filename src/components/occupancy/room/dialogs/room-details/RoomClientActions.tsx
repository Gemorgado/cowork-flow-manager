
import React from 'react';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2, Unlink, Building } from 'lucide-react';

interface RoomClientActionsProps {
  room: Room;
  onLinkClient?: () => void;
  onUnlinkClient?: () => void;
  isUnlinking?: boolean;
}

export const RoomClientActions: React.FC<RoomClientActionsProps> = ({
  room,
  onLinkClient,
  onUnlinkClient,
  isUnlinking = false
}) => {
  const handleUnlinkClick = () => {
    console.log("RoomClientActions: Unlink button clicked, room:", room.id);
    if (onUnlinkClient) {
      console.log("Calling onUnlinkClient handler");
      onUnlinkClient();
    }
  };

  // If room has a client, show unlink button
  if (room.clientId) {
    return (
      <div className="pt-4 border-t">
        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleUnlinkClick}
          disabled={isUnlinking}
        >
          {isUnlinking ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Unlink className="mr-2 h-4 w-4" />
          )}
          Desvincular Cliente
        </Button>
      </div>
    );
  }

  // If no client but we have openLinkDialog, show link company button
  if (onLinkClient) {
    return (
      <div className="space-y-4 mt-4 pt-4 border-t">
        <Button 
          onClick={onLinkClient}
          className="w-full"
          variant="outline"
        >
          <Building className="mr-2 h-4 w-4" />
          Vincular Empresa
        </Button>
      </div>
    );
  }

  // Default case: no clients available
  return (
    <div className="space-y-4 mt-4 pt-4 border-t">
      <p className="text-sm text-muted-foreground">
        Nenhum cliente disponível para vincular
      </p>
    </div>
  );
};
