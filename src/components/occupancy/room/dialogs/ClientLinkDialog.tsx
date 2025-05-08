
import React from 'react';
import { Room } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building, Loader2 } from 'lucide-react';
import { ClientOption } from '@/hooks/occupancy/useRoomClientLink';

export interface ClientLinkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRoom: Room;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  availableClients: ClientOption[];
  isLoadingClients?: boolean;
  handleClientLink: () => void;
  isLinking?: boolean;
}

export const ClientLinkDialog: React.FC<ClientLinkDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedRoom,
  selectedClientId,
  setSelectedClientId,
  availableClients,
  isLoadingClients = false,
  handleClientLink,
  isLinking = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Vincular Cliente à Sala {selectedRoom?.number}</DialogTitle>
          <DialogDescription>
            Selecione um cliente para vincular a esta sala.
          </DialogDescription>
        </DialogHeader>
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
        <DialogFooter>
          <Button 
            onClick={handleClientLink} 
            disabled={!selectedClientId || isLinking || isLoadingClients}
            className="w-full"
          >
            {isLinking ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Vinculando...</span>
              </div>
            ) : (
              <>
                <Building className="mr-2 h-4 w-4" />
                Vincular Empresa
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
