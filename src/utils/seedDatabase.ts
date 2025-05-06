
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
    await seedAdminUser();

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
    // Check if admin user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', 'admin@cowork.com')
      .single();

    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    // First check if the user exists in auth
    const { data: authUser } = await supabase.auth.admin.listUsers();
    
    // Fix: Properly check if the user exists in the returned users array
    let userExists = false;
    if (authUser && authUser.users) {
      userExists = authUser.users.some((user: any) => user.email === 'admin@cowork.com');
    }
    
    if (userExists) {
      console.log('Admin user already exists in auth');
      return;
    }

    // Create admin user directly with admin API to ensure proper activation
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@cowork.com',
      password: 'senha123',
      email_confirm: true, // Confirma o email automaticamente
      user_metadata: {
        name: 'Administrador',
      }
    });

    if (authError) {
      throw authError;
    }

    if (authData.user) {
      // Update the profile with all permissions
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: 'Administrador',
          permissions: ['dashboard', 'users', 'clients', 'plans', 'services', 'occupancy']
        })
        .eq('id', authData.user.id);

      if (profileError) {
        throw profileError;
      }
      
      console.log('Admin user created successfully');
      toast.success('Usuário administrador criado com sucesso');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
    toast.error('Erro ao criar usuário administrador');
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
