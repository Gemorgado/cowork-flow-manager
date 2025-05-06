
import { supabase } from "@/integrations/supabase/client";
import { ServiceType } from '@/types';

// Define types for Supabase insert operations
interface ServiceInsert {
  name: string;
  description: string;
  type: ServiceType;
}

/**
 * Utility function to seed the Supabase database with initial services data
 * This is useful for development and testing purposes
 */
export async function seedSupabaseWithServicesData() {
  try {
    console.log('Starting services seed process...');
    
    // Define services to seed
    const services: ServiceInsert[] = [
      {
        name: 'Endereço Fiscal',
        description: 'Endereço comercial para registro de empresa',
        type: 'fiscal_address'
      },
      {
        name: 'Estação Flex',
        description: 'Estação de trabalho compartilhada',
        type: 'flex_station'
      },
      {
        name: 'Estação Fixa',
        description: 'Estação de trabalho dedicada',
        type: 'fixed_station'
      },
      {
        name: 'Sala Privativa',
        description: 'Sala exclusiva para sua empresa',
        type: 'private_room'
      }
    ];

    // For each service, insert if it doesn't exist
    for (const service of services) {
      const { data: existingService } = await supabase
        .from('services')
        .select('id')
        .eq('type', service.type)
        .single();

      if (!existingService) {
        const { error } = await supabase
          .from('services')
          .insert(service);
        
        if (error) throw error;
      }
    }

    console.log('Services seed process completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding services:', error);
    return { success: false, error };
  }
}
