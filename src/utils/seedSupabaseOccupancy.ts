
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { LocationStatus } from "@/types";
import { Database } from "@/integrations/supabase/types";

type FloorNumber = Database['public']['Enums']['floor_number'];
type RoomInsert = Database['public']['Tables']['rooms']['Insert'];
type WorkstationInsert = Database['public']['Tables']['workstations']['Insert'];

/**
 * Seeds the Supabase database with initial room and workstation data
 */
export async function seedSupabaseOccupancy() {
  try {
    // Generate room data for floors 1-3
    const roomsData: RoomInsert[] = [
      // Floor 1 rooms
      ...['101','102','103','104','105','106','107'].map(code => ({
        id: uuidv4(),
        number: code,
        floor: "1" as FloorNumber,
        status: "available" as LocationStatus,
        area: Math.floor(Math.random() * 30) + 10, // Random area between 10-40m²
        capacity: Math.floor(Math.random() * 8) + 2, // Random capacity between 2-10
      })),
      // Floor 2 rooms
      ...Array.from({ length: 19 }, (_, i) => ({
        id: uuidv4(),
        number: `${201+i}`,
        floor: "2" as FloorNumber,
        status: "available" as LocationStatus,
        area: Math.floor(Math.random() * 30) + 10,
        capacity: Math.floor(Math.random() * 8) + 2,
      })),
      // Floor 3 rooms
      ...Array.from({ length: 14 }, (_, i) => ({
        id: uuidv4(),
        number: `${301+i}`,
        floor: "3" as FloorNumber,
        status: "available" as LocationStatus,
        area: Math.floor(Math.random() * 30) + 10,
        capacity: Math.floor(Math.random() * 8) + 2,
      }))
    ];

    // Generate workstation data for floors 1-2
    const workstationsData: WorkstationInsert[] = [
      // Floor 1 workstations
      ...Array.from({ length: 26 }, (_, i) => ({
        id: uuidv4(),
        number: `WS-${(i+1).toString().padStart(2,'0')}`,
        floor: "1" as FloorNumber,
        type: Math.random() > 0.7 ? "flex" : "fixed", // 30% chance of flex, 70% fixed
        status: "available" as LocationStatus
      })),
      // Floor 2 workstations
      ...Array.from({ length: 38 }, (_, i) => ({
        id: uuidv4(),
        number: `WS-${(i+27).toString().padStart(2,'0')}`,
        floor: "2" as FloorNumber,
        type: Math.random() > 0.7 ? "flex" : "fixed",
        status: "available" as LocationStatus
      }))
    ];

    console.log("Starting seed process...");
    
    // Clear existing data first (careful with this in production!)
    await supabase.from('rooms').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('workstations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log("Deleted existing data");
    
    // Insert room data
    const { data: roomsInserted, error: roomsError } = await supabase
      .from('rooms')
      .insert(roomsData);
      
    if (roomsError) {
      console.error("Error inserting rooms:", roomsError);
      throw roomsError;
    }
    
    console.log(`Successfully inserted rooms`);
    
    // Insert workstation data
    const { data: workstationsInserted, error: workstationsError } = await supabase
      .from('workstations')
      .insert(workstationsData);
      
    if (workstationsError) {
      console.error("Error inserting workstations:", workstationsError);
      throw workstationsError;
    }
    
    console.log(`Successfully inserted workstations`);
    
    return {
      success: true,
      roomsCount: roomsData.length,
      workstationsCount: workstationsData.length
    };
  } catch (error) {
    console.error("Seed failed:", error);
    return {
      success: false,
      error
    };
  }
}
