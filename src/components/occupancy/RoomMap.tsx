
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Room } from '@/types';
import { statusColors, statusLabels } from './StatusLegend';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

interface RoomMapProps {
  rooms: Room[];
  currentFloor: string;
}

export const RoomMap: React.FC<RoomMapProps> = ({ rooms, currentFloor }) => {
  const floorRooms = rooms.filter((room) => room.floor === parseInt(currentFloor) as any);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isClientLinkDialogOpen, setIsClientLinkDialogOpen] = useState(false);
  
  // Mock clients data - this would come from an API in a real app
  const mockClients = [
    { id: 'client1', name: 'Empresa A' },
    { id: 'client2', name: 'Empresa B' },
    { id: 'client3', name: 'Empresa C' }
  ];
  
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  
  // Form for room editing
  const roomForm = useForm({
    defaultValues: {
      status: 'available',
      area: 0,
      capacity: 0
    }
  });
  
  // Function to arrange rooms in a specific layout based on floor
  const getFloorLayout = () => {
    const floorNumber = parseInt(currentFloor);
    
    switch(floorNumber) {
      case 1:
        // Pavimento 1: Salas 101-107 em linha (7 salas)
        return 'grid-cols-7';
      case 2:
        // Pavimento 2: Salas 201-219 em forma de U (19 salas)
        return 'grid-cols-7 gap-y-8';
      case 3:
        // Pavimento 3: Salas 301-310 (10 salas)
        return 'grid-cols-5 gap-y-6';
      default:
        return 'grid-cols-4';
    }
  };

  // Function to get client info for tooltip
  const getClientInfo = (clientId?: string) => {
    if (!clientId) return "Nenhum cliente";
    // In a real app, we would fetch client details here
    return `Cliente #${clientId.replace('client', '')}`;
  };

  // Handler for opening edit dialog
  const handleOpenEditDialog = (room: Room) => {
    setSelectedRoom(room);
    roomForm.reset({
      status: room.status,
      area: room.area,
      capacity: room.capacity
    });
    setIsEditDialogOpen(true);
  };

  // Handler for room update
  const handleRoomUpdate = (data: any) => {
    console.log("Updating room with data:", data);
    // Here you would call your API to update the room
    // For now, we'll just close the dialog
    setIsEditDialogOpen(false);
  };

  // Handler for client linking
  const handleClientLink = () => {
    if (!selectedRoom || !selectedClientId) return;
    
    console.log(`Linking client ${selectedClientId} to room ${selectedRoom.id}`);
    // Here you would call your API to link the client to the room
    // For now, we'll just close the dialog
    setIsClientLinkDialogOpen(false);
  };

  // Function to render rooms in a U shape for floor 2
  const renderFloor2Layout = () => {
    // Salas 201-207 (primeira fileira)
    const topRow = floorRooms.filter(room => {
      const roomNum = parseInt(room.number);
      return roomNum >= 201 && roomNum <= 207;
    });
    
    // Salas 208-212 (coluna direita)
    const rightColumn = floorRooms.filter(room => {
      const roomNum = parseInt(room.number);
      return roomNum >= 208 && roomNum <= 212;
    });
    
    // Salas 213-219 (fileira inferior)
    const bottomRow = floorRooms.filter(room => {
      const roomNum = parseInt(room.number);
      return roomNum >= 213 && roomNum <= 219;
    });

    return (
      <div className="floor-layout-u relative">
        {/* Top row */}
        <div className="grid grid-cols-7 gap-4 mb-8">
          {topRow.map(room => renderRoomCard(room))}
        </div>
        
        {/* Middle section (right column and empty space) */}
        <div className="grid grid-cols-7 gap-4 mb-8">
          <div className="col-span-5"></div>
          <div className="col-span-2">
            <div className="grid grid-cols-1 gap-4">
              {rightColumn.map(room => renderRoomCard(room))}
            </div>
          </div>
        </div>
        
        {/* Bottom row */}
        <div className="grid grid-cols-7 gap-4">
          {bottomRow.map(room => renderRoomCard(room))}
        </div>
      </div>
    );
  };

  // Render standard grid layout for floors 1 and 3
  const renderStandardLayout = () => {
    return (
      <div className={`floor-map grid ${getFloorLayout()} gap-4`}>
        {floorRooms.map(room => renderRoomCard(room))}
      </div>
    );
  };

  // Room card with tooltip and dialog
  const renderRoomCard = (room: Room) => (
    <Dialog key={room.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <div
              className={cn(
                "room border-2 rounded-md p-3 cursor-pointer transition-all text-center relative",
                statusColors[room.status]
              )}
            >
              <div className="text-lg font-bold">{room.number}</div>
              <div className="text-xs text-gray-600">
                {room.area}m² | {room.capacity} pessoas
              </div>
              <div className="text-xs mt-1 font-medium">
                {statusLabels[room.status]}
              </div>
              {room.clientId && (
                <Badge variant="secondary" className="mt-2 w-full">
                  {getClientInfo(room.clientId)}
                </Badge>
              )}
              <div className="absolute top-1 right-1 opacity-30 hover:opacity-100">
                <Edit size={16} />
              </div>
            </div>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <div className="p-1">
            <div className="font-bold">Sala {room.number}</div>
            <div>Status: {statusLabels[room.status]}</div>
            <div>Área: {room.area}m²</div>
            <div>Capacidade: {room.capacity} pessoas</div>
            <div>Cliente: {getClientInfo(room.clientId)}</div>
            {room.clientId && <div>Contrato até: 31/12/2023</div>}
          </div>
        </TooltipContent>
      </Tooltip>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Sala {room.number}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Status</p>
              <Badge className={cn(
                "px-2 py-1",
                statusColors[room.status].replace('bg-', 'bg-opacity-20 text-').replace('-100', '-800')
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
                variant="outline" 
                size="sm" 
                onClick={() => handleOpenEditDialog(room)}
              >
                Editar
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => {
                  setSelectedRoom(room);
                  setIsClientLinkDialogOpen(true);
                }}
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
    </Dialog>
  );
  
  // Room Edit Dialog
  const RoomEditDialog = () => (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Sala {selectedRoom?.number}</DialogTitle>
        </DialogHeader>
        <Form {...roomForm}>
          <form onSubmit={roomForm.handleSubmit(handleRoomUpdate)} className="space-y-4">
            <FormField
              control={roomForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                  <FormLabel>Área (m²)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormLabel>Capacidade</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
  
  // Client Link Dialog
  const ClientLinkDialog = () => (
    <Dialog open={isClientLinkDialogOpen} onOpenChange={setIsClientLinkDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vincular Cliente à Sala {selectedRoom?.number}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <FormItem>
            <FormLabel>Cliente</FormLabel>
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
            >
              Vincular
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
  
  return (
    <>
      {parseInt(currentFloor) === 2 ? renderFloor2Layout() : renderStandardLayout()}
      {selectedRoom && <RoomEditDialog />}
      {selectedRoom && <ClientLinkDialog />}
    </>
  );
};
