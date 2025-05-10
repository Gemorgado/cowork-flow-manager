
import { Room, LocationStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { 
  updateRoomStatus as updateRoomStatusApi,
  updateRoomDetails as updateRoomDetailsApi,
  linkClientToRoom as linkClientToRoomApi,
  unlinkClientFromRoom as unlinkClientFromRoomApi
} from '../api/roomApi';

/**
 * Handler for updating a room's status
 */
export async function handleUpdateRoomStatus(
  roomId: string,
  status: LocationStatus,
  clientId: string | undefined | null,
  onSuccess: () => void
): Promise<boolean> {
  try {
    console.log(`Updating room ${roomId} status to ${status}, clientId: ${clientId}`);
    const result = await updateRoomStatusApi(roomId, status, clientId);
    
    if (result) {
      toast({
        title: 'Sucesso',
        description: 'Status da sala atualizado',
      });
      onSuccess();
      return true;
    } else {
      throw new Error('Falha ao atualizar status');
    }
  } catch (error: any) {
    console.error('Error updating room status:', error);
    toast({
      title: 'Erro',
      description: 'Falha ao atualizar status da sala',
      variant: 'destructive',
    });
    return false;
  }
}

/**
 * Handler for updating room details
 */
export async function handleUpdateRoomDetails(
  roomId: string,
  data: { area?: number, capacity?: number },
  onSuccess: () => void
): Promise<boolean> {
  try {
    console.log(`Updating room ${roomId} details:`, data);
    const result = await updateRoomDetailsApi(roomId, data);
    
    if (result) {
      toast({
        title: 'Sucesso',
        description: 'Detalhes da sala atualizados',
      });
      onSuccess();
      return true;
    } else {
      throw new Error('Falha ao atualizar detalhes');
    }
  } catch (error: any) {
    console.error('Error updating room details:', error);
    toast({
      title: 'Erro',
      description: 'Falha ao atualizar detalhes da sala',
      variant: 'destructive',
    });
    return false;
  }
}

/**
 * Handler for linking a client to a room
 */
export async function handleLinkClientToRoom(
  roomId: string,
  clientId: string,
  onSuccess: () => void
): Promise<boolean> {
  try {
    console.log(`Linking client ${clientId} to room ${roomId}`);
    const result = await linkClientToRoomApi(roomId, clientId);
    
    if (result) {
      toast({
        title: 'Sucesso',
        description: 'Cliente vinculado à sala',
      });
      // Ensure we trigger the success callback
      onSuccess();
      return true;
    } else {
      throw new Error('Falha ao vincular cliente');
    }
  } catch (error: any) {
    console.error('Error linking client to room:', error);
    toast({
      title: 'Erro',
      description: 'Falha ao vincular cliente à sala',
      variant: 'destructive',
    });
    return false;
  }
}

/**
 * Handler for unlinking a client from a room
 */
export async function handleUnlinkClientFromRoom(
  roomId: string,
  onSuccess: () => void
): Promise<boolean> {
  try {
    console.log(`Unlinking client from room ${roomId}`);
    
    // Call the API to unlink the client and set room to available
    const result = await unlinkClientFromRoomApi(roomId);
    
    if (result) {
      toast({
        title: 'Sucesso',
        description: 'Cliente desvinculado da sala',
      });
      
      // Important: ensure the success callback is triggered
      console.log("Unlink successful, calling onSuccess callback");
      onSuccess();
      return true;
    } else {
      throw new Error('Falha ao desvincular cliente');
    }
  } catch (error: any) {
    console.error('Error unlinking client from room:', error);
    toast({
      title: 'Erro',
      description: 'Falha ao desvincular cliente da sala',
      variant: 'destructive',
    });
    return false;
  }
}
