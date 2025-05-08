
import React from 'react';
import { Room } from '@/types';
import { UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';
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

export interface RoomEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRoom: Room;
  roomForm: UseFormReturn<any>;
  handleRoomUpdate: (data: any) => void;
}

export const RoomEditDialog: React.FC<RoomEditDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  selectedRoom, 
  roomForm, 
  handleRoomUpdate 
}) => {
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
