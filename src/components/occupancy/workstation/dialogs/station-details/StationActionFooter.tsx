
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WorkStation, LocationStatus } from '@/types';

interface StationActionFooterProps {
  station: WorkStation;
  onAllocate?: () => void;
  allocatingFlexToFixed: boolean;
  onUpdateStatus?: (status: LocationStatus) => Promise<boolean>;
  isUpdatingStatus: boolean;
  handleStatusChange: (status: LocationStatus) => void;
  onLinkClient?: (clientId: string) => void;
  availableClients: { id: string; name: string; }[];
}

export const StationActionFooter: React.FC<StationActionFooterProps> = ({
  station,
  onAllocate,
  allocatingFlexToFixed,
  onUpdateStatus,
  isUpdatingStatus,
  handleStatusChange,
  onLinkClient,
  availableClients
}) => {
  const isFixedType = station.type === 'fixed';
  
  return (
    <DialogFooter className="pt-4">
      {station.status === 'flex' ? (
        <Button 
          onClick={onAllocate} 
          disabled={allocatingFlexToFixed}
        >
          {allocatingFlexToFixed ? 'Convertendo...' : 'Converter para Uso Fixo'}
        </Button>
      ) : (
        <div className="flex gap-2">
          {/* Only show for fixed stations that aren't linked to clients */}
          {isFixedType && !station.clientId && onLinkClient && !availableClients.length && (
            <Button variant="default" size="sm">Vincular Cliente</Button>
          )}
          {/* Only show for stations linked to clients */}
          {station.clientId && onUpdateStatus && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleStatusChange('available')}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? 'Desvinculando...' : 'Desvincular'}
            </Button>
          )}
        </div>
      )}
    </DialogFooter>
  );
};
