
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { WorkStation } from '@/types';

interface StationDialogHeaderProps {
  station: WorkStation;
}

export const StationDialogHeader: React.FC<StationDialogHeaderProps> = ({ station }) => {
  return (
    <DialogHeader>
      <DialogTitle>
        Estação {station.status === 'flex' ? 'Flex ' : ''}{station.number.replace('WS-', '')}
      </DialogTitle>
      <DialogDescription>
        {station.status === 'flex' 
          ? "Esta estação está marcada como Flex e pode ser convertida para uso fixo."
          : station.status === 'occupied' 
            ? "Esta estação está ocupada por um cliente."
            : "Detalhes da estação de trabalho."}
      </DialogDescription>
    </DialogHeader>
  );
};
