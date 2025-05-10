
import React from 'react';
import { WorkStation, LocationStatus } from '@/types';
import { Loader2 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface StationInfoDisplayProps {
  station: WorkStation;
  getClientInfo: (clientId?: string) => string;
  onUpdateStatus?: (status: LocationStatus) => Promise<boolean>;
  selectedStatus: LocationStatus;
  isUpdatingStatus: boolean;
  setSelectedStatus: (status: LocationStatus) => void;
  handleStatusChange: (status: LocationStatus) => void;
}

export const StationInfoDisplay: React.FC<StationInfoDisplayProps> = ({
  station,
  getClientInfo,
  onUpdateStatus,
  selectedStatus,
  isUpdatingStatus,
  handleStatusChange
}) => {
  const statusLabels: Record<string, string> = {
    'available': 'Livre',
    'occupied': 'Ocupado',
    'flex': 'Flex',
    'reserved': 'Reservado',
    'maintenance': 'Manutenção',
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium mb-1">Tipo</p>
        <p>{station.type === 'fixed' ? 'Fixa' : 'Flex'}</p>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Status</p>
        {onUpdateStatus ? (
          <Select 
            value={selectedStatus} 
            onValueChange={(value) => handleStatusChange(value as LocationStatus)}
            disabled={isUpdatingStatus}
          >
            <SelectTrigger>
              {isUpdatingStatus ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Atualizando...</span>
                </div>
              ) : (
                <SelectValue placeholder={statusLabels[station.status] || station.status} />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Livre</SelectItem>
              <SelectItem value="occupied">Ocupado</SelectItem>
              <SelectItem value="flex">Flex</SelectItem>
              <SelectItem value="reserved">Reservado</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <p>{statusLabels[station.status] || station.status}</p>
        )}
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Cliente</p>
        <p className="overflow-hidden text-ellipsis">{station.clientId ? getClientInfo(station.clientId) : 'Nenhum'}</p>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Andar</p>
        <p>{station.floor}º</p>
      </div>
    </div>
  );
};
