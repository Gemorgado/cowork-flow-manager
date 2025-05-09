
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Room } from '@/types';

interface ClientLinkHeaderProps {
  selectedRoom: Room;
}

export const ClientLinkHeader: React.FC<ClientLinkHeaderProps> = ({
  selectedRoom
}) => {
  return (
    <DialogHeader>
      <DialogTitle>Vincular Cliente à Sala {selectedRoom?.number}</DialogTitle>
      <DialogDescription>
        Selecione um cliente para vincular a esta sala.
      </DialogDescription>
    </DialogHeader>
  );
};
