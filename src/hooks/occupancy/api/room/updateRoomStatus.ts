
import { supabase } from '@/integrations/supabase/client';
import { LocationStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { RoomUpdate } from './roomApiTypes';

/**
 * Updates a room's status and optionally links it to a client
 */
export async function updateRoomStatus(
  roomId: string, 
  status: LocationStatus, 
  clientId?: string | null
): Promise<boolean> {
  try {
    console.log(`API call: updateRoomStatus - roomId=${roomId}, status=${status}, clientId=${clientId}`);
    
    // Type-safe update data
    const updateData: RoomUpdate = { status };
    
    // If setting to available status, automatically unlink client
    if (status === 'available') {
      updateData.client_id = null;
      console.log('Setting room to available, automatically unlinking client');
    }
    // Only update client_id if it's explicitly provided (including null)
    else if (clientId !== undefined) {
      updateData.client_id = clientId;
    }

    const { data, error } = await supabase
      .from('rooms')
      .update(updateData)
      .eq('id', roomId)
      .select();
    
    console.log('Update room status response:', { data, error });

    if (error) {
      throw error;
    }
    
    console.log('Room status updated successfully in API');
    return true;
  } catch (error: any) {
    console.error('Error updating room:', error);
    toast({
      title: 'Error',
      description: `Failed to update room status: ${error.message || 'Unknown error'}`,
      variant: 'destructive',
    });
    return false;
  }
}
