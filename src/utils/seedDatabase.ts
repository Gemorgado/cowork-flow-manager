
import { supabase } from "@/integrations/supabase/client";
import { seedSupabaseWithOccupancyData } from '@/utils/seedSupabase';
import { seedSupabaseWithServicesData } from '@/utils/seedSupabaseWithServices';
import { toast } from "sonner";

export async function seedDatabase() {
  try {
    // Create admin user if it doesn't exist
    const adminResult = await seedAdminUser();
    
    if (adminResult.success) {
      toast.success('Usuário administrador criado com sucesso');
    } else if (adminResult.exists) {
      toast.info('Usuário administrador já existe');
    } else {
      toast.error('Erro ao criar usuário administrador');
      console.error('Error details:', adminResult.error);
      return { success: false, error: adminResult.error };
    }

    // Try to seed other data only if admin was successfully created
    try {
      // Seed some services if they don't exist yet
      const servicesResult = await seedSupabaseWithServicesData();
      
      if (!servicesResult.success) {
        console.error('Error seeding services:', servicesResult.error);
        toast.error('Erro ao popular serviços iniciais');
      } else {
        console.log('Services seeded successfully');
        toast.success('Serviços iniciais populados com sucesso');
      }

      // First seed occupancy data (rooms and workstations)
      const occupancyResult = await seedSupabaseWithOccupancyData();

      if (!occupancyResult.success) {
        console.error('Error seeding occupancy data:', occupancyResult.error);
        toast.error('Erro ao popular dados de ocupação');
      } else {
        toast.success('Dados de ocupação populados com sucesso');
      }
    } catch (error) {
      console.error('Error seeding additional data:', error);
      toast.error('Erro ao popular dados adicionais');
      // Continue since admin was created
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
    
    // Check if admin user already exists in auth.users
    const { data: existingUser, error: lookupError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@cowork.com')
      .maybeSingle();
    
    if (lookupError) {
      console.error('Error checking for existing admin:', lookupError);
    }
    
    if (existingUser) {
      console.log('Admin user already exists in profiles');
      return { success: true, exists: true };
    }
    
    // If we reach here, admin doesn't exist, so create a new one
    console.log('Creating admin user...');

    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@cowork.com',
      password: 'senha123',
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          name: 'Administrador'
        }
      }
    });

    if (authError) {
      console.error('Error creating admin user:', authError);
      return { success: false, error: authError, exists: false };
    }

    if (!authData || !authData.user) {
      console.error('Auth data or user is null');
      return { success: false, error: new Error('Auth data or user is null'), exists: false };
    }

    console.log('Admin user created in auth, updating profile...');
    
    // Manual update to the profile with all permissions
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

    // Auto-confirm the email since this is just demo data
    const { error: adminError } = await supabase.auth.admin.updateUserById(
      authData.user.id,
      { email_confirm: true }
    );
    
    if (adminError) {
      console.error('Error confirming admin email:', adminError);
      // This is not critical, so continue
    }
    
    console.log('Admin user created and profile updated successfully');
    return { success: true, exists: false };
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
