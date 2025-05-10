
import { supabase } from '@/integrations/supabase/client';
import { Room } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { RoomRow, transformRoomRow } from './roomApiTypes';

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

    return (data as RoomRow[])?.map(transformRoomRow) || [];
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
