
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export const RoomDetailsHeader: React.FC = () => {
  return (
    <DialogHeader>
      <DialogTitle>Sala</DialogTitle>
      <DialogDescription>
        Detalhes e informações da sala.
      </DialogDescription>
    </DialogHeader>
  );
};
