
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
import { Loader2 } from 'lucide-react';

interface StationDialogContentProps {
  station: WorkStation;
  getClientInfo: (clientId?: string) => string;
  onAllocate?: () => void;
  allocatingFlexToFixed?: boolean;
  onLinkClient?: (clientId: string) => void;
  onUpdateStatus?: (status: LocationStatus) => Promise<boolean>;
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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isLinkingClient, setIsLinkingClient] = useState(false);
  
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

  const handleLinkClient = async () => {
    if (onLinkClient && selectedClientId) {
      setIsLinkingClient(true);
      try {
        await onLinkClient(selectedClientId);
        setIsLinkingClient(false);
      } catch (error) {
        console.error("Error linking client:", error);
        setIsLinkingClient(false);
      }
    }
  };

  const handleStatusChange = async (status: LocationStatus) => {
    if (!onUpdateStatus) return;
    
    setIsUpdatingStatus(true);
    setSelectedStatus(status);
    
    try {
      const success = await onUpdateStatus(status);
      if (!success) {
        // Revert back if the update failed
        setSelectedStatus(station.status);
      }
    } catch (error) {
      console.error("Error updating station status:", error);
      // Revert back if there was an error
      setSelectedStatus(station.status);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <>
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
                disabled={isUpdatingStatus}
              >
                <SelectTrigger>
                  {isUpdatingStatus ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Atualizando...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder={statusLabels[station.status] || station.status} />
                  )}
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
                        disabled={isLinkingClient}
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
              disabled={!selectedClientId || isLinkingClient}
            >
              {isLinkingClient ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Vinculando...
                </>
              ) : (
                'Vincular Cliente'
              )}
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
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? 'Desvinculando...' : 'Desvincular'}
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </div>
    </>
  );
};
