
import React, { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WorkStation } from '@/types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';

interface StationDialogContentProps {
  station: WorkStation;
  getClientInfo: (clientId?: string) => string;
  onAllocate?: () => void;
  allocatingFlexToFixed?: boolean;
  onLinkClient?: (clientId: string) => void;
  availableClients?: {id: string, name: string}[];
}

export const StationDialogContent: React.FC<StationDialogContentProps> = ({
  station,
  getClientInfo,
  onAllocate,
  allocatingFlexToFixed = false,
  onLinkClient,
  availableClients = [],
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const isFixedType = station.type === 'fixed';
  const statusLabels: Record<string, string> = {
    'available': 'Livre',
    'occupied': 'Ocupado',
    'flex': 'Flex',
    'reserved': 'Reservado',
    'maintenance': 'Manutenção',
  };

  const handleLinkClient = () => {
    if (onLinkClient && selectedClientId) {
      onLinkClient(selectedClientId);
    }
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
        
        {/* Client selection dropdown for linking */}
        {onLinkClient && availableClients.length > 0 && !station.clientId && (
          <div className="pt-4">
            <FormItem>
              <FormLabel>Vincular Cliente</FormLabel>
              <Select 
                onValueChange={setSelectedClientId} 
                value={selectedClientId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                className="mt-2 w-full"
                onClick={handleLinkClient} 
                disabled={!selectedClientId}
              >
                Vincular Cliente
              </Button>
            </FormItem>
          </div>
        )}
        
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
              {!station.clientId && onLinkClient && !availableClients.length && (
                <Button variant="default" size="sm">Vincular Cliente</Button>
              )}
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
