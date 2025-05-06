
import React, { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';

interface RoomMapProps {
  rooms: Room[];
  currentFloor: string;
}

export const RoomMap: React.FC<RoomMapProps> = ({ rooms, currentFloor }) => {
  const floorRooms = rooms.filter((room) => room.floor === parseInt(currentFloor) as any);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isClientLinkDialogOpen, setIsClientLinkDialogOpen] = useState(false);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);
  
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
        return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-7';
      case 2:
        // Pavimento 2: Salas 201-219 em forma de U (19 salas)
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-y-8';
      case 3:
        // Pavimento 3: Salas 301-310 (10 salas)
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-6';
      default:
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4 mb-8">
          {topRow.map(room => renderRoomCard(room))}
        </div>
        
        {/* Middle section (right column and empty space) */}
        <div className="grid grid-cols-5 gap-4 mb-8 hidden lg:grid">
          <div className="col-span-4"></div>
          <div className="col-span-1">
            <div className="grid grid-cols-1 gap-4">
              {rightColumn.map(room => renderRoomCard(room))}
            </div>
          </div>
        </div>
        
        {/* Middle section for mobile and tablet */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 lg:hidden">
          {rightColumn.map(room => renderRoomCard(room))}
        </div>
        
        {/* Bottom row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4">
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
                "w-24 h-20 rounded-2xl p-2 flex flex-col justify-between backdrop-blur-sm",
                "shadow-md shadow-black/10 transition-all duration-150",
                "border border-white/5 cursor-pointer",
                hoveredRoomId === room.id && "shadow-lg shadow-black/10 -translate-y-0.5",
                statusColors[room.status].replace('bg-', 'bg-opacity-80 bg-')
              )}
              onMouseEnter={() => setHoveredRoomId(room.id)}
              onMouseLeave={() => setHoveredRoomId(null)}
              onFocus={() => setHoveredRoomId(room.id)}
              onBlur={() => setHoveredRoomId(null)}
            >
              <span className="text-[10px] text-muted-foreground font-medium">{room.number}</span>
              <div className="mt-auto">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "w-full justify-center text-xs font-medium ring-2 ring-white/20",
                    statusColors[room.status].replace('bg-', 'bg-opacity-90 bg-')
                  )}
                >
                  {statusLabels[room.status]}
                </Badge>
                {room.clientId && (
                  <div className="mt-1 text-[9px] text-center text-muted-foreground truncate">
                    {getClientInfo(room.clientId)}
                  </div>
                )}
              </div>
            </div>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="backdrop-blur-md bg-black/40 border-white/10">
          <div className="p-1 text-sm">
            <div className="font-medium">Sala {room.number}</div>
            <div>Status: {statusLabels[room.status]}</div>
            <div>Área: {room.area}m²</div>
            <div>Capacidade: {room.capacity} pessoas</div>
            <div>Cliente: {getClientInfo(room.clientId)}</div>
            {room.clientId && <div>Contrato até: 31/12/2023</div>}
          </div>
        </TooltipContent>
      </Tooltip>
      
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
                onClick={() => {
                  setSelectedRoom(room);
                  setIsClientLinkDialogOpen(true);
                }}
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
    </Dialog>
  );
  
  // Room Edit Dialog
  const RoomEditDialog = () => (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
  
  // Client Link Dialog
  const ClientLinkDialog = () => (
    <Dialog open={isClientLinkDialogOpen} onOpenChange={setIsClientLinkDialogOpen}>
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
  
  return (
    <>
      {parseInt(currentFloor) === 2 ? renderFloor2Layout() : renderStandardLayout()}
      {selectedRoom && <RoomEditDialog />}
      {selectedRoom && <ClientLinkDialog />}
    </>
  );
};
