
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { LocationStatus } from "@/types";
import { Database } from "@/integrations/supabase/types";

type FloorNumber = Database['public']['Enums']['floor_number'];
type RoomInsert = Database['public']['Tables']['rooms']['Insert'];
type WorkstationInsert = Database['public']['Tables']['workstations']['Insert'];

/**
 * Seeds the Supabase database with room and workstation data
 * according to specified layouts for floors
 */
export async function seedSupabaseOccupancy() {
  try {
    // Clear existing data first
    await supabase.from('rooms').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('workstations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Specific room numbers for each floor based on user requirements
    const roomsData: RoomInsert[] = [
      // Pavimento 1: Salas 101-107
      ...['101','102','103','104','105','106','107'].map((code, index) => ({
        id: uuidv4(),
        number: code,
        floor: "1" as FloorNumber,
        status: "available" as LocationStatus,
        area: 20 + index,  // Areas between 20-26m²
        capacity: 4 + Math.floor(index / 2),  // Capacities between 4-7
      })),
      
      // Pavimento 2: Salas 201-219
      ...[...Array(19)].map((_, index) => ({
        id: uuidv4(),
        number: `${201 + index}`,
        floor: "2" as FloorNumber,
        status: "available" as LocationStatus,
        area: 15 + index % 10,  // Areas between 15-24m²
        capacity: 3 + index % 5,  // Capacities between 3-7
      })),
      
      // Pavimento 3: Salas 301-310
      ...[...Array(10)].map((_, index) => ({
        id: uuidv4(),
        number: `${301 + index}`,
        floor: "3" as FloorNumber,
        status: "available" as LocationStatus,
        area: 18 + index % 8,  // Areas between 18-25m²
        capacity: 4 + index % 4,  // Capacities between 4-7
      }))
    ];

    // Generate workstation data for floors 1-2
    const workstationsData: WorkstationInsert[] = [
      // Pavimento 1: 26 estações
      ...[...Array(26)].map((_, index) => ({
        id: uuidv4(),
        number: `WS-${(index + 1).toString().padStart(2, '0')}`,
        floor: "1" as FloorNumber,
        type: Math.random() > 0.7 ? "flex" : "fixed",  // 30% flex, 70% fixed
        status: "available" as LocationStatus
      })),
      
      // Pavimento 2: 38 estações
      ...[...Array(38)].map((_, index) => ({
        id: uuidv4(),
        number: `WS-${(index + 27).toString().padStart(2, '0')}`,
        floor: "2" as FloorNumber,
        type: Math.random() > 0.7 ? "flex" : "fixed",  // 30% flex, 70% fixed
        status: "available" as LocationStatus
      }))
    ];
    
    // Insert room data
    const { error: roomsError } = await supabase
      .from('rooms')
      .insert(roomsData);
      
    if (roomsError) {
      console.error("Error inserting rooms:", roomsError);
      throw roomsError;
    }
    
    // Insert workstation data
    const { error: workstationsError } = await supabase
      .from('workstations')
      .insert(workstationsData);
      
    if (workstationsError) {
      console.error("Error inserting workstations:", workstationsError);
      throw workstationsError;
    }
    
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
