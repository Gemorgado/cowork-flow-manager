
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { ClientOption } from '@/hooks/occupancy/useRoomClientLink';

interface ClientSelectorProps {
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  availableClients: ClientOption[];
  isLoadingClients?: boolean;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  selectedClientId,
  setSelectedClientId,
  availableClients,
  isLoadingClients = false,
}) => {
  return (
    <div className="py-4">
      <Label htmlFor="client">Cliente</Label>
      <Select 
        value={selectedClientId} 
        onValueChange={setSelectedClientId}
        disabled={isLoadingClients}
      >
        <SelectTrigger>
          {isLoadingClients ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Carregando clientes...</span>
            </div>
          ) : (
            <SelectValue placeholder="Selecione um cliente" />
          )}
        </SelectTrigger>
        <SelectContent>
          {availableClients.length > 0 ? (
            availableClients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-clients" disabled>
              Nenhum cliente disponível
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
