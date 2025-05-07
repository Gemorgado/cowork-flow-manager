
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface RoomDetailsDialogContentProps {
  room: Room;
  getClientInfo: (clientId?: string) => string;
  onClose?: () => void;
}

export const RoomDetailsDialogContent: React.FC<RoomDetailsDialogContentProps> = ({
  room,
  getClientInfo,
  onClose,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      area: room.area?.toString() || '',
      price: '0.00',
    },
  });

  const onSubmit = (data: any) => {
    console.log('Room update data:', data);
    // Here you would call an API to update the room
    if (onClose) onClose();
  };

  const statusLabels: Record<string, string> = {
    'available': 'Livre',
    'occupied': 'Ocupada',
    'reserved': 'Reservada',
    'maintenance': 'Manutenção',
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sala {room.number}</DialogTitle>
        <DialogDescription>
          Detalhes e informações da sala.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Status</p>
            <p>{statusLabels[room.status] || room.status}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Cliente</p>
            <p>{getClientInfo(room.clientId)}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Andar</p>
            <p>{room.floor}º</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Capacidade</p>
            <p>{room.capacity} pessoas</p>
          </div>
        </div>

        <div className="space-y-4 mt-4 pt-4 border-t">
          <div>
            <Label htmlFor="area">Área (m²)</Label>
            <Input 
              id="area" 
              type="number" 
              step="0.01"
              placeholder="Área em m²" 
              {...register('area', { min: 0 })} 
            />
            {errors.area && (
              <p className="text-sm text-red-500">Área deve ser maior que zero</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="price">Valor (R$)</Label>
            <Input 
              id="price" 
              type="number" 
              step="0.01"
              placeholder="Valor mensal" 
              {...register('price', { min: 0 })} 
            />
            {errors.price && (
              <p className="text-sm text-red-500">Valor deve ser maior que zero</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </>
  );
};

export const RoomEditDialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRoom: Room;
  roomForm: any;
  handleRoomUpdate: (data: any) => void;
}> = ({ isOpen, onOpenChange, selectedRoom, roomForm, handleRoomUpdate }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Sala {selectedRoom.number}</DialogTitle>
          <DialogDescription>
            Atualize as informações da sala.
          </DialogDescription>
        </DialogHeader>
        <form 
          onSubmit={roomForm.handleSubmit(handleRoomUpdate)}
          className="space-y-4 py-4"
        >
          <div>
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={roomForm.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Livre</SelectItem>
                    <SelectItem value="occupied">Ocupado</SelectItem>
                    <SelectItem value="reserved">Reservado</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="area">Área (m²)</Label>
            <Input
              id="area"
              type="number"
              step="0.01"
              {...roomForm.register("area", { 
                valueAsNumber: true,
                min: 0
              })}
            />
          </div>
          <div>
            <Label htmlFor="capacity">Capacidade</Label>
            <Input
              id="capacity"
              type="number"
              {...roomForm.register("capacity", { 
                valueAsNumber: true,
                min: 0
              })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const ClientLinkDialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRoom: Room;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  mockClients: { id: string; name: string }[];
  handleClientLink: () => void;
}> = ({
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
