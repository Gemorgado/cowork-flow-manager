
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { RoomUpdate } from './roomApiTypes';

/**
 * Updates room details like area and capacity
 */
export async function updateRoomDetails(
  roomId: string, 
  data: { area?: number, capacity?: number }
): Promise<boolean> {
  try {
    console.log(`API call: updateRoomDetails - roomId=${roomId}, data=`, data);
    
    // Type-safe update data
    const updateData: RoomUpdate = {};
    if (data.area !== undefined) {
      updateData.area = data.area;
    }
    if (data.capacity !== undefined) {
      updateData.capacity = data.capacity;
    }

    // Validate the data before sending to the database
    if (Object.keys(updateData).length === 0) {
      throw new Error('No valid room details provided for update');
    }

    const { data: responseData, error } = await supabase
      .from('rooms')
      .update(updateData)
      .eq('id', roomId)
      .select();
    
    console.log('Update room details response:', { responseData, error });

    if (error) {
      throw error;
    }
    return true;
  } catch (error: any) {
    console.error('Error updating room details:', error);
    toast({
      title: 'Error',
      description: `Failed to update room details: ${error.message || 'Unknown error'}`,
      variant: 'destructive',
    });
    return false;
  }
}
