
import React from 'react';
import { WorkStation, LocationStatus } from '@/types';
import { 
  StationDialogHeader,
  StationInfoDisplay,
  StationClientSelector,
  StationActionFooter,
  useStationDialog
} from './dialogs/station-details';

interface StationDialogContentProps {
  station: WorkStation;
  getClientInfo: (clientId?: string) => string;
  onAllocate?: () => void;
  allocatingFlexToFixed?: boolean;
  onLinkClient?: (clientId: string) => void;
  onUpdateStatus?: (status: LocationStatus) => Promise<boolean>;
  availableClients?: {id: string, name: string}[];
}

export const StationDialogContent: React.FC<StationDialogContentProps> = ({
  station,
  getClientInfo,
  onAllocate,
  allocatingFlexToFixed = false,
  onLinkClient,
  onUpdateStatus,
  availableClients = [],
}) => {
  const {
    selectedClientId,
    setSelectedClientId,
    selectedStatus,
    isUpdatingStatus,
    isLinkingClient,
    handleStatusChange,
    handleLinkClient
  } = useStationDialog(station.status, onUpdateStatus);

  // Wrap the onLinkClient to include selectedClientId
  const handleClientLink = (clientId: string) => {
    if (onLinkClient) {
      handleLinkClient(clientId, onLinkClient);
    }
  };
  
  return (
    <>
      <StationDialogHeader station={station} />
      
      <div className="space-y-4 py-4">
        <StationInfoDisplay
          station={station}
          getClientInfo={getClientInfo}
          onUpdateStatus={onUpdateStatus}
          selectedStatus={selectedStatus}
          isUpdatingStatus={isUpdatingStatus}
          setSelectedStatus={() => {}} // This is handled by handleStatusChange
          handleStatusChange={handleStatusChange}
        />
        
        {/* Client selection dropdown for linking */}
        {onLinkClient && availableClients.length > 0 && !station.clientId && (
          <StationClientSelector
            availableClients={availableClients}
            onLinkClient={handleClientLink}
            isLinkingClient={isLinkingClient}
            selectedClientId={selectedClientId}
            setSelectedClientId={setSelectedClientId}
          />
        )}
        
        {/* Actions for different station types/states */}
        <StationActionFooter
          station={station}
          onAllocate={onAllocate}
          allocatingFlexToFixed={allocatingFlexToFixed}
          onUpdateStatus={onUpdateStatus}
          isUpdatingStatus={isUpdatingStatus}
          handleStatusChange={handleStatusChange}
          onLinkClient={onLinkClient}
          availableClients={availableClients}
        />
      </div>
    </>
  );
};
