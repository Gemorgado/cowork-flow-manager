
import { supabase } from '@/integrations/supabase/client';
import { Room, LocationStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';

type RoomRow = Database['public']['Tables']['rooms']['Row'];
type RoomInsert = Database['public']['Tables']['rooms']['Insert'];
type RoomUpdate = Database['public']['Tables']['rooms']['Update'];

/**
 * Transforms a Supabase room row into a Room type
 */
const transformRoomRow = (row: RoomRow): Room => ({
  id: row.id,
  number: row.number,
  floor: parseInt(row.floor) as Room['floor'],
  status: row.status,
  clientId: row.client_id || undefined,
  area: row.area,
  capacity: row.capacity
});

/**
 * Fetches all rooms from Supabase
 */
export async function fetchRooms(): Promise<Room[]> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*');

    if (error) {
      throw error;
    }

    return data?.map(transformRoomRow) || [];
  } catch (error: any) {
    console.error('Error fetching rooms:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch rooms data',
      variant: 'destructive',
    });
    return [];
  }
}

/**
 * Updates a room's status and optionally links it to a client
 */
export async function updateRoomStatus(
  roomId: string, 
  status: LocationStatus, 
  clientId?: string
): Promise<boolean> {
  try {
    // Type-safe update data
    const updateData: RoomUpdate = { status };
    if (clientId !== undefined) {
      updateData.client_id = clientId || null;
    }

    const { error } = await supabase
      .from('rooms')
      .update(updateData)
      .eq('id', roomId);

    if (error) {
      throw error;
    }
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

/**
 * Updates room details like area and price
 */
export async function updateRoomDetails(
  roomId: string, 
  data: { area?: number, priceClosed?: number }
): Promise<boolean> {
  try {
    // Type-safe update data
    const updateData: RoomUpdate = {};
    if (data.area !== undefined) {
      updateData.area = data.area;
    }

    // Validate the data before sending to the database
    if (Object.keys(updateData).length === 0) {
      throw new Error('No valid room details provided for update');
    }

    const { error } = await supabase
      .from('rooms')
      .update(updateData)
      .eq('id', roomId);

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

/**
 * Links a client to a room and sets its status to occupied
 */
export async function linkClientToRoom(
  roomId: string, 
  clientId: string
): Promise<boolean> {
  try {
    if (!roomId || !clientId) {
      throw new Error('Room ID and Client ID are required');
    }

    const updateData: RoomUpdate = { 
      status: 'occupied',
      client_id: clientId 
    };

    const { error } = await supabase
      .from('rooms')
      .update(updateData)
      .eq('id', roomId);

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
