
import React, { useState, useEffect } from 'react';
import { Room, LocationStatus } from '@/types';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Building, Save, Loader2, Unlink } from 'lucide-react';

export interface RoomDetailsDialogContentProps {
  room: Room;
  getClientInfo: (clientId?: string) => string;
  onClose?: () => void;
  onUpdateStatus?: (roomId: string, status: LocationStatus) => void;
  onLinkClient?: (roomId: string, clientId: string) => void;
  onUnlinkClient?: (roomId: string) => void;
  onUpdateRoomDetails?: (roomId: string, data: { area?: number, capacity?: number }) => void;
  availableClients?: {id: string, name: string}[];
  openLinkDialog?: (room: Room) => void;
}

export const statusLabels: Record<string, string> = {
  'available': 'Livre',
  'occupied': 'Ocupada',
  'reserved': 'Reservada',
  'maintenance': 'Manutenção',
};

export const RoomDetailsDialogContent: React.FC<RoomDetailsDialogContentProps> = ({
  room,
  getClientInfo,
  onClose,
  onUpdateStatus,
  onLinkClient,
  onUnlinkClient,
  onUpdateRoomDetails,
  availableClients = [],
  openLinkDialog
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<LocationStatus>(room.status);
  const [area, setArea] = useState<number>(room.area);
  const [capacity, setCapacity] = useState<number>(room.capacity);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);

  // Reset form when room changes
  useEffect(() => {
    setSelectedStatus(room.status);
    setArea(room.area);
    setCapacity(room.capacity);
    setIsEditing(false);
  }, [room]);

  const handleStatusChange = (status: LocationStatus) => {
    setSelectedStatus(status);
    if (onUpdateStatus) {
      onUpdateStatus(room.id, status);
      toast({
        title: 'Status atualizado',
        description: `Sala ${room.number} agora está ${statusLabels[status]}.`,
      });
    }
  };

  const handleLinkClient = () => {
    if (onLinkClient && selectedClientId) {
      onLinkClient(room.id, selectedClientId);
      toast({
        title: 'Cliente vinculado',
        description: `Cliente vinculado à sala ${room.number}.`,
      });
    }
  };

  const handleUnlinkClient = async () => {
    if (!onUnlinkClient) return;
    
    setIsUnlinking(true);
    try {
      await onUnlinkClient(room.id);
      if (onClose) {
        onClose();
      }
    } finally {
      setIsUnlinking(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!onUpdateRoomDetails) return;
    
    setIsSaving(true);
    try {
      await onUpdateRoomDetails(room.id, { 
        area: area,
        capacity: capacity
      });
      setIsEditing(false);
      toast({
        title: 'Detalhes atualizados',
        description: `Informações da sala ${room.number} foram atualizadas.`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as informações da sala.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sala {room.number}</DialogTitle>
        <DialogDescription>
          Detalhes e informações da sala.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={selectedStatus} 
              onValueChange={(value) => handleStatusChange(value as LocationStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder={statusLabels[room.status] || room.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Livre</SelectItem>
                <SelectItem value="occupied">Ocupada</SelectItem>
                <SelectItem value="reserved">Reservada</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="client">Cliente</Label>
            {room.clientId ? (
              <p className="mt-2">{getClientInfo(room.clientId)}</p>
            ) : (
              <p className="text-muted-foreground mt-2">Nenhum cliente vinculado</p>
            )}
          </div>
          <div>
            <Label htmlFor="floor">Andar</Label>
            <p className="mt-2">{room.floor}º</p>
          </div>
          <div>
            <Label htmlFor="capacity">Capacidade</Label>
            {isEditing ? (
              <Input 
                id="capacity" 
                type="number" 
                value={capacity} 
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="mt-1"
              />
            ) : (
              <p className="mt-2">{room.capacity} pessoas</p>
            )}
          </div>
          <div>
            <Label htmlFor="area">Área</Label>
            {isEditing ? (
              <Input 
                id="area" 
                type="number" 
                value={area} 
                onChange={(e) => setArea(Number(e.target.value))}
                className="mt-1"
                step="0.01"
              />
            ) : (
              <p className="mt-2">{room.area} m²</p>
            )}
          </div>
        </div>

        {/* Client selection section */}
        {!room.clientId && (
          <div className="space-y-4 mt-4 pt-4 border-t">
            <div>
              {openLinkDialog ? (
                <Button 
                  onClick={() => openLinkDialog(room)}
                  className="w-full"
                  variant="outline"
                >
                  <Building className="mr-2 h-4 w-4" />
                  Vincular Empresa
                </Button>
              ) : (
                availableClients.length > 0 ? (
                  <>
                    <Label htmlFor="client">Vincular Cliente</Label>
                    <Select 
                      value={selectedClientId} 
                      onValueChange={setSelectedClientId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleLinkClient}
                      className="mt-2 w-full"
                      disabled={!selectedClientId}
                    >
                      Vincular Cliente
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhum cliente disponível para vincular
                  </p>
                )
              )}
            </div>
          </div>
        )}

        {/* Action buttons for occupied rooms */}
        {room.clientId && (
          <div className="pt-4 border-t">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleUnlinkClient}
              disabled={isUnlinking}
            >
              {isUnlinking ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Unlink className="mr-2 h-4 w-4" />
              )}
              Desvincular Cliente
            </Button>
          </div>
        )}
      </div>

      <DialogFooter className="gap-2">
        {isEditing ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => {
                setArea(room.area);
                setCapacity(room.capacity);
                setIsEditing(false);
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveDetails}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => setIsEditing(true)}
            variant="outline"
          >
            Editar Informações
          </Button>
        )}
      </DialogFooter>
    </>
  );
};
