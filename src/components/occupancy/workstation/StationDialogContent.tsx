
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WorkStation } from '@/types';

interface StationDialogContentProps {
  station: WorkStation;
  getClientInfo: (clientId?: string) => string;
  onAllocate?: () => void;
  allocatingFlexToFixed?: boolean;
}

export const StationDialogContent: React.FC<StationDialogContentProps> = ({
  station,
  getClientInfo,
  onAllocate,
  allocatingFlexToFixed = false,
}) => {
  const isFixedType = station.type === 'fixed';
  const statusLabels: Record<string, string> = {
    'available': 'Livre',
    'occupied': 'Ocupado',
    'flex': 'Flex',
    'reserved': 'Reservado',
    'maintenance': 'Manutenção',
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Detalhes da Estação {isFixedType ? '' : 'Flex '}{station.number}
        </DialogTitle>
        <DialogDescription>
          {station.status === 'flex' && isFixedType
            ? "Esta estação está marcada como Flex e pode ser convertida para uso fixo."
            : isFixedType 
              ? "Gerencie as informações desta estação fixa."
              : "Estações Flex são compartilhadas e não representam posições físicas específicas."}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Tipo</p>
            <p>{isFixedType ? 'Fixa' : 'Flex'}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Status</p>
            <p>{statusLabels[station.status]}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Cliente</p>
            <p>{getClientInfo(station.clientId)}</p>
          </div>
        </div>
        
        <DialogFooter className="pt-4">
          {station.status === 'flex' && isFixedType ? (
            <Button 
              onClick={onAllocate} 
              disabled={allocatingFlexToFixed}
            >
              {allocatingFlexToFixed ? 'Convertendo...' : 'Converter para Uso Fixo'}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Editar</Button>
              <Button variant="default" size="sm">Vincular Cliente</Button>
              {station.clientId && (
                <Button variant="destructive" size="sm">Desvincular</Button>
              )}
            </div>
          )}
        </DialogFooter>
      </div>
    </>
  );
};
