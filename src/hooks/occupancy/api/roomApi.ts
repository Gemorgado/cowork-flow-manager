
import { supabase } from '@/integrations/supabase/client';
import { Room, LocationStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';

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

    return data?.map(room => ({
      id: room.id,
      number: room.number,
      floor: parseInt(room.floor) as any,
      status: room.status,
      clientId: room.client_id || undefined,
      area: room.area,
      capacity: room.capacity
    })) || [];
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
    const updateData: any = { status };
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
  } catch (error) {
    console.error('Error updating room:', error);
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
    const { error } = await supabase
      .from('rooms')
      .update(data)
      .eq('id', roomId);

    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error updating room details:', error);
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
    const { error } = await supabase
      .from('rooms')
      .update({ 
        status: 'occupied',
        client_id: clientId 
      })
      .eq('id', roomId);

    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error linking client to room:', error);
    return false;
  }
}
