
import { supabase } from "@/integrations/supabase/client";
import { User, Permission } from '@/types';
import { toast } from 'sonner';

export interface ProfileFromDB {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

// Map profile from DB to User type
export const mapProfileToUser = (profile: ProfileFromDB): User => {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone || '',
    address: profile.address || '',
    password: '', // Password is not returned from DB
    permissions: profile.permissions || [],
    createdAt: new Date(profile.created_at),
    updatedAt: new Date(profile.updated_at)
  };
};

// Fetch all users from Supabase
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
      return [];
    }

    return (profiles as ProfileFromDB[]).map(profile => mapProfileToUser(profile));
  } catch (error) {
    console.error('Unexpected error fetching users:', error);
    toast.error('Erro inesperado ao carregar usuários');
    return [];
  }
};

// Add a new user via Supabase Auth + profiles
export const addUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null> => {
  try {
    // First, create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          name: user.name,
          permissions: user.permissions
        }
      }
    });

    if (authError || !authData.user) {
      console.error('Error creating auth user:', authError);
      toast.error('Erro ao criar usuário: ' + (authError?.message || 'Unknown error'));
      return null;
    }

    // Then, create or update profile record
    // This should happen automatically via the database trigger, but we'll update it anyway
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        permissions: user.permissions
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error updating profile:', profileError);
      toast.error('Erro ao atualizar perfil do usuário');
    }

    // Return the created user
    return profileData ? mapProfileToUser(profileData as ProfileFromDB) : null;
  } catch (error) {
    console.error('Unexpected error adding user:', error);
    toast.error('Erro inesperado ao adicionar usuário');
    return null;
  }
};

// Update existing user
export const updateUser = async (user: User): Promise<User | null> => {
  try {
    // Update profile information
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        permissions: user.permissions
      })
      .eq('id', user.id)
      .select()
      .single();

    if (profileError) {
      console.error('Error updating profile:', profileError);
      toast.error('Erro ao atualizar perfil do usuário');
      return null;
    }

    // If password is provided, update it
    if (user.password) {
      // Admin can update user's password
      const { error: passwordError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: user.password }
      );

      if (passwordError) {
        console.error('Error updating password:', passwordError);
        toast.error('Erro ao atualizar senha do usuário');
      }
    }

    return mapProfileToUser(profileData as ProfileFromDB);
  } catch (error) {
    console.error('Unexpected error updating user:', error);
    toast.error('Erro inesperado ao atualizar usuário');
    return null;
  }
};

// Delete user
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // Delete the user from auth.users, which will cascade to profiles
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir usuário');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting user:', error);
    toast.error('Erro inesperado ao excluir usuário');
    return false;
  }
};
