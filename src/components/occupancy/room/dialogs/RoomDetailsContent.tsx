
import React, { useState } from 'react';
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
import { Building } from 'lucide-react';

export interface RoomDetailsDialogContentProps {
  room: Room;
  getClientInfo: (clientId?: string) => string;
  onClose?: () => void;
  onUpdateStatus?: (roomId: string, status: LocationStatus) => void;
  onLinkClient?: (roomId: string, clientId: string) => void;
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
  availableClients = [],
  openLinkDialog
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<LocationStatus>(room.status);

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
            <p className="text-sm font-medium mb-1">Status</p>
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
            <p className="text-sm font-medium mb-1">Cliente</p>
            <p>{getClientInfo(room.clientId) || 'Nenhum'}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Andar</p>
            <p>{room.floor}º</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Capacidade</p>
            <p>{room.capacity} pessoas</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Área</p>
            <p>{room.area} m²</p>
          </div>
        </div>

        {/* Client linking section */}
        {!room.clientId && availableClients.length > 0 && (
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
              onClick={() => {
                if (onUpdateStatus) {
                  onUpdateStatus(room.id, 'available');
                  toast({
                    title: 'Cliente desvinculado',
                    description: `Cliente desvinculado da sala ${room.number}.`,
                  });
                }
              }}
            >
              Desvincular Cliente
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
