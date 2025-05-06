
import React from 'react';
import { Room } from '@/types';
import { cn } from '@/lib/utils';
import { statusColors, statusLabels } from '../StatusLegend';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

// Define the RoomFormValues type for better type safety
interface RoomFormValues {
  status: string;
  area: number;
  capacity: number;
}

interface RoomEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRoom: Room | null;
  roomForm: UseFormReturn<RoomFormValues>;
  handleRoomUpdate: (data: RoomFormValues) => void;
}

export const RoomEditDialog: React.FC<RoomEditDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedRoom,
  roomForm,
  handleRoomUpdate
}) => {
  if (!selectedRoom) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-md bg-white/5 border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Editar Sala {selectedRoom?.number}</DialogTitle>
        </DialogHeader>
        <Form {...roomForm}>
          <form onSubmit={roomForm.handleSubmit(handleRoomUpdate)} className="space-y-4">
            <FormField
              control={roomForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-black/20 border-white/10">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black/80 backdrop-blur-md border-white/10">
                      <SelectItem value="available">Livre</SelectItem>
                      <SelectItem value="occupied">Ocupado</SelectItem>
                      <SelectItem value="reserved">Reservado</SelectItem>
                      <SelectItem value="maintenance">Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={roomForm.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Área (m²)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="bg-black/20 border-white/10"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={roomForm.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Capacidade</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="bg-black/20 border-white/10"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                type="submit"
                className="hover:brightness-110"
              >
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface ClientLinkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRoom: Room | null;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  mockClients: { id: string, name: string }[];
  handleClientLink: () => void;
}

export const ClientLinkDialog: React.FC<ClientLinkDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedRoom,
  selectedClientId,
  setSelectedClientId,
  mockClients,
  handleClientLink
}) => {
  if (!selectedRoom) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-md bg-white/5 border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Vincular Cliente à Sala {selectedRoom?.number}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <FormItem>
            <FormLabel className="text-sm font-medium">Cliente</FormLabel>
            <Select 
              onValueChange={setSelectedClientId} 
              value={selectedClientId}
            >
              <FormControl>
                <SelectTrigger className="bg-black/20 border-white/10">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-black/80 backdrop-blur-md border-white/10">
                {mockClients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
          <DialogFooter>
            <Button 
              onClick={handleClientLink} 
              disabled={!selectedClientId}
              className="hover:brightness-110"
            >
              Vincular
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface RoomDetailsDialogContentProps {
  room: Room;
  getClientInfo: (clientId?: string) => string;
  handleOpenEditDialog: (room: Room) => void;
  onLinkClient: (room: Room) => void;
}

export const RoomDetailsDialogContent: React.FC<RoomDetailsDialogContentProps> = ({
  room,
  getClientInfo,
  handleOpenEditDialog,
  onLinkClient
}) => {
  return (
    <DialogContent className="backdrop-blur-md bg-white/5 border border-white/10">
      <DialogHeader>
        <DialogTitle className="text-lg font-medium">Sala {room.number}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Status</p>
            <Badge className={cn(
              "px-2 py-1",
              statusColors[room.status].replace('bg-', 'bg-opacity-90 text-').replace('-100', '-800')
            )}>
              {statusLabels[room.status]}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Área</p>
            <p>{room.area} m²</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Capacidade</p>
            <p>{room.capacity} pessoas</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Cliente</p>
            <p>{getClientInfo(room.clientId)}</p>
          </div>
        </div>
        
        <div className="pt-4">
          <p className="text-sm font-medium mb-2">Ações</p>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleOpenEditDialog(room)}
              className="hover:bg-white/10"
            >
              Editar
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => onLinkClient(room)}
              className="hover:brightness-110"
            >
              Vincular Cliente
            </Button>
            {room.clientId && (
              <Button variant="destructive" size="sm">Desvincular</Button>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
