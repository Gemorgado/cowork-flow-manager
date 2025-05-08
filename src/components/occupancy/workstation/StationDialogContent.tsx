
import React, { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WorkStation, LocationStatus } from '@/types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface StationDialogContentProps {
  station: WorkStation;
  getClientInfo: (clientId?: string) => string;
  onAllocate?: () => void;
  allocatingFlexToFixed?: boolean;
  onLinkClient?: (clientId: string) => void;
  onUpdateStatus?: (status: LocationStatus) => void;
  availableClients?: {id: string, name: string}[];
}

export const StationDialogContent: React.FC<StationDialogContentProps> = ({
  station,
  getClientInfo,
  onAllocate,
  allocatingFlexToFixed = false,
  onLinkClient,
  onUpdateStatus,
  availableClients = [],
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<LocationStatus>(station.status);
  const isFixedType = station.type === 'fixed';
  const statusLabels: Record<string, string> = {
    'available': 'Livre',
    'occupied': 'Ocupado',
    'flex': 'Flex',
    'reserved': 'Reservado',
    'maintenance': 'Manutenção',
  };

  const form = useForm({
    defaultValues: {
      clientId: ''
    }
  });

  const handleLinkClient = () => {
    if (onLinkClient && selectedClientId) {
      onLinkClient(selectedClientId);
    }
  };

  const handleStatusChange = (status: LocationStatus) => {
    setSelectedStatus(status);
    if (onUpdateStatus) {
      onUpdateStatus(status);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Estação {station.status === 'flex' ? 'Flex ' : ''}{station.number}
        </DialogTitle>
        <DialogDescription>
          {station.status === 'flex' 
            ? "Esta estação está marcada como Flex e pode ser convertida para uso fixo."
            : station.status === 'occupied' 
              ? "Esta estação está ocupada por um cliente."
              : "Detalhes da estação de trabalho."}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Tipo</p>
            <p>{station.type === 'fixed' ? 'Fixa' : 'Flex'}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Status</p>
            {onUpdateStatus ? (
              <Select 
                value={selectedStatus} 
                onValueChange={(value) => handleStatusChange(value as LocationStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={statusLabels[station.status] || station.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Livre</SelectItem>
                  <SelectItem value="occupied">Ocupado</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                  <SelectItem value="reserved">Reservado</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p>{statusLabels[station.status] || station.status}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Cliente</p>
            <p>{getClientInfo(station.clientId) || 'Nenhum'}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Andar</p>
            <p>{station.floor}º</p>
          </div>
        </div>
        
        {/* Client selection dropdown for linking */}
        {onLinkClient && availableClients.length > 0 && !station.clientId && (
          <div className="pt-4">
            <Form {...form}>
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <p className="text-sm font-medium mb-1">Vincular Cliente</p>
                    <FormControl>
                      <Select 
                        onValueChange={(value) => {
                          setSelectedClientId(value);
                          field.onChange(value);
                        }} 
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableClients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </Form>
            <Button 
              className="mt-2 w-full"
              onClick={handleLinkClient} 
              disabled={!selectedClientId}
            >
              Vincular Cliente
            </Button>
          </div>
        )}
        
        {/* Actions for different station types/states */}
        <DialogFooter className="pt-4">
          {station.status === 'flex' ? (
            <Button 
              onClick={onAllocate} 
              disabled={allocatingFlexToFixed}
            >
              {allocatingFlexToFixed ? 'Convertendo...' : 'Converter para Uso Fixo'}
            </Button>
          ) : (
            <div className="flex gap-2">
              {/* Only show for fixed stations that aren't linked to clients */}
              {isFixedType && !station.clientId && onLinkClient && !availableClients.length && (
                <Button variant="default" size="sm">Vincular Cliente</Button>
              )}
              {/* Only show for stations linked to clients */}
              {station.clientId && onUpdateStatus && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleStatusChange('available')}
                >
                  Desvincular
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </div>
    </>
  );
};
