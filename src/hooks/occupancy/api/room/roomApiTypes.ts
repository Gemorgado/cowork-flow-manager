
import { Room } from '@/types';
import { Database } from '@/integrations/supabase/types';

export type RoomRow = Database['public']['Tables']['rooms']['Row'];
export type RoomInsert = Database['public']['Tables']['rooms']['Insert'];
export type RoomUpdate = Database['public']['Tables']['rooms']['Update'];

/**
 * Transforms a Supabase room row into a Room type
 */
export const transformRoomRow = (row: RoomRow): Room => ({
  id: row.id,
  number: row.number,
  floor: parseInt(row.floor) as Room['floor'],
  status: row.status,
  clientId: row.client_id || undefined,
  area: row.area,
  capacity: row.capacity
});
