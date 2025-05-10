
import { useState, useCallback } from 'react';
import { LocationStatus } from '@/types';

export const useStationDialog = (
  initialStatus: LocationStatus,
  onUpdateStatus?: (status: LocationStatus) => Promise<boolean>
) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<LocationStatus>(initialStatus);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isLinkingClient, setIsLinkingClient] = useState(false);

  const handleStatusChange = useCallback(async (status: LocationStatus) => {
    if (!onUpdateStatus) return;
    
    setIsUpdatingStatus(true);
    setSelectedStatus(status);
    
    try {
      const success = await onUpdateStatus(status);
      if (!success) {
        // Revert back if the update failed
        setSelectedStatus(initialStatus);
      }
    } catch (error) {
      console.error("Error updating station status:", error);
      // Revert back if there was an error
      setSelectedStatus(initialStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [initialStatus, onUpdateStatus]);

  const handleLinkClient = useCallback(async (clientId: string, linkClientFn?: (clientId: string) => void) => {
    if (!linkClientFn) return;
    
    setIsLinkingClient(true);
    try {
      await linkClientFn(clientId);
    } catch (error) {
      console.error("Error linking client:", error);
    } finally {
      setIsLinkingClient(false);
    }
  }, []);

  return {
    selectedClientId,
    setSelectedClientId,
    selectedStatus,
    setSelectedStatus,
    isUpdatingStatus,
    isLinkingClient,
    handleStatusChange,
    handleLinkClient
  };
};
