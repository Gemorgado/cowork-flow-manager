
import { useState, useCallback } from 'react';
import { Room } from '@/types';
import { linkClientToRoom } from './api';
import { toast } from '@/components/ui/use-toast';

export function useRoomClientLink(onSuccess?: () => void) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isClientLinkDialogOpen, setIsClientLinkDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [isLinking, setIsLinking] = useState(false);

  const openClientLinkDialog = useCallback((room: Room) => {
    setSelectedRoom(room);
    setSelectedClientId('');
    setIsClientLinkDialogOpen(true);
  }, []);

  const closeClientLinkDialog = useCallback(() => {
    setIsClientLinkDialogOpen(false);
    setSelectedRoom(null);
  }, []);

  const handleLinkClient = useCallback(async () => {
    if (!selectedRoom || !selectedClientId) return;
    
    setIsLinking(true);
    
    try {
      const success = await linkClientToRoom(selectedRoom.id, selectedClientId);
      
      if (success) {
        toast({
          title: 'Sucesso',
          description: `Cliente vinculado à sala ${selectedRoom.number}.`,
        });
        closeClientLinkDialog();
        if (onSuccess) onSuccess();
      } else {
        throw new Error('Falha ao vincular cliente');
      }
    } catch (error) {
      console.error('Error linking client to room:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível vincular o cliente à sala.',
        variant: 'destructive',
      });
    } finally {
      setIsLinking(false);
    }
  }, [selectedRoom, selectedClientId, closeClientLinkDialog, onSuccess]);

  return {
    selectedRoom,
    isClientLinkDialogOpen,
    selectedClientId,
    isLinking,
    setSelectedClientId,
    openClientLinkDialog,
    closeClientLinkDialog,
    handleLinkClient,
  };
}
