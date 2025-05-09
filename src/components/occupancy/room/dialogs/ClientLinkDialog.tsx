
import React from 'react';
import { Room } from '@/types';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { ClientOption } from '@/hooks/occupancy/useRoomClientLink';
import { 
  ClientSelector,
  ClientLinkHeader,
  ClientLinkActions
} from './client-link';

export interface ClientLinkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRoom: Room;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  availableClients: ClientOption[];
  isLoadingClients?: boolean;
  handleClientLink: () => void;
  isLinking?: boolean;
}

export const ClientLinkDialog: React.FC<ClientLinkDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedRoom,
  selectedClientId,
  setSelectedClientId,
  availableClients,
  isLoadingClients = false,
  handleClientLink,
  isLinking = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <ClientLinkHeader selectedRoom={selectedRoom} />
        
        <ClientSelector
          selectedClientId={selectedClientId}
          setSelectedClientId={setSelectedClientId}
          availableClients={availableClients}
          isLoadingClients={isLoadingClients}
        />
        
        <ClientLinkActions
          selectedClientId={selectedClientId}
          isLinking={isLinking}
          isLoadingClients={isLoadingClients}
          handleClientLink={handleClientLink}
        />
      </DialogContent>
    </Dialog>
  );
};
