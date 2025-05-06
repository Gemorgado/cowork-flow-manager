
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

    // Create admin user if it doesn't exist
    const adminResult = await seedAdminUser();
    
    if (adminResult.success) {
      toast.success('Usuário administrador criado com sucesso');
    } else if (adminResult.exists) {
      toast.info('Usuário administrador já existe');
    } else {
      toast.error('Erro ao criar usuário administrador');
    }

    return { success: true, message: 'Database seeded successfully!' };
  } catch (error) {
    console.error('Error seeding database:', error);
    toast.error('Erro ao popular banco de dados');
    return { success: false, error };
  }
}

// Function to create admin user
async function seedAdminUser() {
  try {
    console.log('Checking for admin user...');
    
    // Check if admin user already exists in profiles
    const { data: existingUser, error: profileCheckError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', 'admin@cowork.com')
      .single();

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      console.error('Error checking for existing profile:', profileCheckError);
    }

    if (existingUser) {
      console.log('Admin user already exists in profiles');
      return { success: false, exists: true };
    }

    // Force create a new admin user (delete if exists and create new)
    console.log('Creating admin user...');

    // Create admin user with admin API to ensure proper activation
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@cowork.com',
      password: 'senha123',
      email_confirm: true,
      user_metadata: {
        name: 'Administrador',
      }
    });

    if (authError) {
      console.error('Error creating admin user:', authError);
      return { success: false, error: authError, exists: false };
    }

    if (authData && authData.user) {
      console.log('Admin user created in auth, updating profile...');
      
      // Update the profile with all permissions
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: 'Administrador',
          permissions: ['dashboard', 'users', 'clients', 'plans', 'services', 'occupancy']
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Error updating admin profile:', profileError);
        return { success: false, error: profileError, exists: false };
      }
      
      console.log('Admin user created and profile updated successfully');
      return { success: true, exists: false };
    } else {
      console.error('Auth data or user is null');
      return { success: false, exists: false };
    }
  } catch (error) {
    console.error('Error in seedAdminUser:', error);
    return { success: false, error, exists: false };
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
