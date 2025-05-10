
import React from 'react';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2, Unlink, Building } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ClientOption {
  id: string;
  name: string;
}

interface RoomClientActionsProps {
  room: Room;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  availableClients: ClientOption[];
  openLinkDialog?: (room: Room) => void;
  onLinkClient?: () => void;
  onUnlinkClient?: () => void;
  isUnlinking: boolean;
}

export const RoomClientActions: React.FC<RoomClientActionsProps> = ({
  room,
  selectedClientId,
  setSelectedClientId,
  availableClients,
  openLinkDialog,
  onLinkClient,
  onUnlinkClient,
  isUnlinking
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
  if (openLinkDialog) {
    return (
      <div className="space-y-4 mt-4 pt-4 border-t">
        <Button 
          onClick={() => openLinkDialog(room)}
          className="w-full"
          variant="outline"
        >
          <Building className="mr-2 h-4 w-4" />
          Vincular Empresa
        </Button>
      </div>
    );
  }

  // If we have clients available, show dropdown
  if (availableClients.length > 0) {
    return (
      <div className="space-y-4 mt-4 pt-4 border-t">
        <Label htmlFor="client">Vincular Cliente</Label>
        <Select 
          value={selectedClientId} 
          onValueChange={setSelectedClientId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {availableClients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={onLinkClient}
          className="mt-2 w-full"
          disabled={!selectedClientId}
        >
          Vincular Cliente
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
