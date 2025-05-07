
import { Room, LocationStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { 
  updateRoomStatus as updateRoomStatusApi,
  updateRoomDetails as updateRoomDetailsApi,
  linkClientToRoom as linkClientToRoomApi
} from '../api/occupancyApi';

/**
 * Handler for updating a room's status
 */
export async function handleUpdateRoomStatus(
  roomId: string,
  status: LocationStatus,
  clientId: string | undefined,
  onSuccess: () => void
): Promise<boolean> {
  try {
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
    console.error('Error updating room:', error);
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
  data: { area?: number, priceClosed?: number },
  onSuccess: () => void
): Promise<boolean> {
  try {
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
    const result = await linkClientToRoomApi(roomId, clientId);
    
    if (result) {
      toast({
        title: 'Sucesso',
        description: 'Cliente vinculado à sala',
      });
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
