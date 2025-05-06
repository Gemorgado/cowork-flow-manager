
import { supabase } from "@/integrations/supabase/client";
import { seedSupabaseWithOccupancyData } from '@/utils/seedSupabase';
import { seedSupabaseWithServicesData } from '@/utils/seedSupabaseWithServices';
import { toast } from "sonner";

export async function seedDatabase() {
  try {
    // First seed occupancy data (rooms and workstations)
    const occupancyResult = await seedSupabaseWithOccupancyData();

    if (!occupancyResult.success) {
      throw new Error('Error seeding occupancy data');
    }
    
    // Seed some services if they don't exist yet
    const servicesResult = await seedSupabaseWithServicesData();
    
    if (!servicesResult.success) {
      console.error('Error seeding services:', servicesResult.error);
      toast.error('Erro ao popular serviços iniciais');
    } else {
      console.log('Services seeded successfully');
      toast.success('Serviços iniciais populados com sucesso');
    }

    return { success: true, message: 'Database seeded successfully!' };
  } catch (error) {
    console.error('Error seeding database:', error);
    toast.error('Erro ao popular banco de dados');
    return { success: false, error };
  }
}

// To seed the database, call this function from a component:
/*
import { seedDatabase } from '@/utils/seedDatabase';

useEffect(() => {
  seedDatabase().then(result => {
    console.log('Seed result:', result);
  });
}, []);
*/
