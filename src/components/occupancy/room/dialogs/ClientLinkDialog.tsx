
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

export interface ClientLinkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRoom: Room;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  mockClients: { id: string; name: string }[];
  handleClientLink: () => void;
}

export const ClientLinkDialog: React.FC<ClientLinkDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedRoom,
  selectedClientId,
  setSelectedClientId,
  mockClients,
  handleClientLink,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Vincular Cliente à Sala {selectedRoom.number}</DialogTitle>
          <DialogDescription>
            Selecione um cliente para vincular a esta sala.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="client">Cliente</Label>
          <Select 
            value={selectedClientId} 
            onValueChange={setSelectedClientId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {mockClients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleClientLink} 
            disabled={!selectedClientId}
          >
            Vincular
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
