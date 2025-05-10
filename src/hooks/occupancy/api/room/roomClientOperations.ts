
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { RoomUpdate } from './roomApiTypes';

/**
 * Links a client to a room and sets its status to occupied
 */
export async function linkClientToRoom(
  roomId: string, 
  clientId: string
): Promise<boolean> {
  try {
    console.log(`API call: linkClientToRoom - roomId=${roomId}, clientId=${clientId}`);
    
    if (!roomId || !clientId) {
      throw new Error('Room ID and Client ID are required');
    }

    const updateData: RoomUpdate = { 
      status: 'occupied',
      client_id: clientId 
    };

    const { data, error } = await supabase
      .from('rooms')
      .update(updateData)
      .eq('id', roomId)
      .select();
    
    console.log('Link client to room response:', { data, error });

    if (error) {
      throw error;
    }
    return true;
  } catch (error: any) {
    console.error('Error linking client to room:', error);
    toast({
      title: 'Error',
      description: `Failed to link client to room: ${error.message || 'Unknown error'}`,
      variant: 'destructive',
    });
    return false;
  }
}

/**
 * Unlinks a client from a room and sets its status to available
 */
export async function unlinkClientFromRoom(
  roomId: string
): Promise<boolean> {
  try {
    console.log(`API call: unlinkClientFromRoom - roomId=${roomId}`);
    
    if (!roomId) {
      throw new Error('Room ID is required');
    }

    // Type-safe update data to ensure both status and client_id are correctly set
    const updateData: RoomUpdate = { 
      status: 'available', 
      client_id: null
    };

    console.log('Sending unlink update to Supabase:', updateData);
    
    const { data, error } = await supabase
      .from('rooms')
      .update(updateData)
      .eq('id', roomId)
      .select();
      
    console.log('Unlink client from room response:', { data, error });

    if (error) {
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error unlinking client from room:', error);
    toast({
      title: 'Error',
      description: `Failed to unlink client from room: ${error.message || 'Unknown error'}`,
      variant: 'destructive',
    });
    return false;
  }
}
