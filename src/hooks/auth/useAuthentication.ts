
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Permission } from '@/types';
import { toast } from 'sonner';
import { fetchUserProfile, ensureBasicPermissions } from './useProfile';

export const useAuthentication = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        throw new Error(`Erro de login: ${error.message}`);
      }

      if (!data.user || !data.session) {
        console.error('Login failed: No user or session returned');
        throw new Error('Login falhou: usuário não encontrado ou sessão inválida');
      }

      console.log('Login successful:', data.user);
      
      // Get user profile data with permissions
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error(`Erro ao buscar perfil: ${profileError.message}`);
      }
        
      if (profileData) {
        // Ensure the user has at least the basic permissions to view the dashboard
        let userPermissions = await ensureBasicPermissions(data.user.id, profileData.permissions || []);
        
        // Convert string[] permissions to Permission[] type by validating each permission
        const validPermissions = (userPermissions).filter((p: string) => 
          ['dashboard', 'users', 'clients', 'plans', 'services', 'occupancy'].includes(p)
        ) as Permission[];
        
        const userObj: AuthUser = {
          id: data.user.id,
          name: profileData.name || data.user.user_metadata?.name || '',
          email: data.user.email || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          password: '', // Don't store password
          permissions: validPermissions,
          token: data.session?.access_token || '',
          createdAt: new Date(data.user.created_at || ''),
          updatedAt: new Date(data.user.updated_at || ''),
        };
        
        setUser(userObj);
        console.log('User set in context with permissions:', validPermissions);
        toast.success(`Bem-vindo, ${profileData.name}!`);
        return userObj;
      } else {
        throw new Error('Perfil de usuário não encontrado');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Falha ao realizar logout');
    }
  };

  return {
    user,
    setUser,
    loading,
    setLoading,
    login,
    logout
  };
};
