
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface RoomDetailsHeaderProps {
  floor?: number; // Add floor property
  roomNumber?: string;
}

export const RoomDetailsHeader: React.FC<RoomDetailsHeaderProps> = ({ 
  roomNumber,
  floor // Add floor parameter
}) => {
  return (
    <DialogHeader>
      <DialogTitle>Sala {roomNumber}</DialogTitle>
      <DialogDescription>
        Detalhes e informações da sala{floor ? ` no ${floor}º andar` : ''}.
      </DialogDescription>
    </DialogHeader>
  );
};
