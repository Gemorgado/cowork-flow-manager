
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface RoomDetailsHeaderProps {
  roomNumber?: string;
}

export const RoomDetailsHeader: React.FC<RoomDetailsHeaderProps> = ({ roomNumber }) => {
  return (
    <DialogHeader>
      <DialogTitle>Sala {roomNumber}</DialogTitle>
      <DialogDescription>
        Detalhes e informações da sala.
      </DialogDescription>
    </DialogHeader>
  );
};
