
import { supabase } from "@/integrations/supabase/client";
import { generateRooms, generateWorkStations } from '@/mock/locations';

/**
 * Utility function to seed the Supabase database with initial test data
 * This is useful for development and testing purposes
 */
export async function seedSupabaseWithOccupancyData() {
  try {
    console.log('Starting database seed process...');
    
    // Generate mock data
    const mockRooms = generateRooms();
    const mockWorkstations = generateWorkStations();

    // First clear existing data (careful with this in production!)
    console.log('Clearing existing rooms and workstations...');
    await supabase.from('rooms').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('workstations').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert rooms
    console.log('Inserting rooms...');
    const roomsData = mockRooms.map(room => ({
      id: room.id,
      number: room.number,
      floor: room.floor.toString(),
      status: room.status,
      client_id: room.clientId || null,
      area: room.area,
      capacity: room.capacity
    }));
    
    const { error: roomsError } = await supabase.from('rooms').insert(roomsData);
    if (roomsError) throw roomsError;

    // Insert workstations
    console.log('Inserting workstations...');
    const workstationsData = mockWorkstations.map(station => ({
      id: station.id,
      number: station.number,
      floor: station.floor.toString(),
      type: station.type,
      status: station.status,
      client_id: station.clientId || null
    }));
    
    const { error: stationsError } = await supabase.from('workstations').insert(workstationsData);
    if (stationsError) throw stationsError;

    console.log('Database seed process completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
}

// To seed the database, uncomment the following and run it once from a component:
/*
useEffect(() => {
  seedSupabaseWithOccupancyData().then(result => {
    console.log('Seed result:', result);
  });
}, []);
*/
