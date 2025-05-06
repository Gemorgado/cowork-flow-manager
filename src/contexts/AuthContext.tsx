
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthUser, Permission } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session when app loads
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          console.log('Session found, getting user data');
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData?.user) {
            console.log('User found, getting profile data');
            // Get user profile data with permissions
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userData.user.id)
              .single();
              
            if (profileData) {
              console.log('Profile found:', profileData);
              // Convert string[] permissions to Permission[] type by validating each permission
              const validPermissions = (profileData.permissions || []).filter((p: string) => 
                ['dashboard', 'users', 'clients', 'plans', 'services', 'occupancy'].includes(p)
              ) as Permission[];
              
              setUser({
                id: userData.user.id,
                name: profileData.name || userData.user.user_metadata?.name || '',
                email: userData.user.email || '',
                phone: profileData.phone || '',
                address: profileData.address || '',
                password: '', // Don't store password
                permissions: validPermissions,
                token: sessionData.session.access_token,
                createdAt: new Date(userData.user.created_at || ''),
                updatedAt: new Date(userData.user.updated_at || ''),
              });
              console.log('User set in context');
            }
          }
        } else {
          console.log('No session found');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          // Get user profile data with permissions
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userData.user.id)
            .single();
            
          if (profileData) {
            // Convert string[] permissions to Permission[] type by validating each permission
            const validPermissions = (profileData.permissions || []).filter((p: string) => 
              ['dashboard', 'users', 'clients', 'plans', 'services', 'occupancy'].includes(p)
            ) as Permission[];
            
            setUser({
              id: userData.user.id,
              name: profileData.name || userData.user.user_metadata?.name || '',
              email: userData.user.email || '',
              phone: profileData.phone || '',
              address: profileData.address || '',
              password: '', // Don't store password
              permissions: validPermissions,
              token: session.access_token,
              createdAt: new Date(userData.user.created_at || ''),
              updatedAt: new Date(userData.user.updated_at || ''),
            });
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

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
        // Convert string[] permissions to Permission[] type by validating each permission
        const validPermissions = (profileData.permissions || []).filter((p: string) => 
          ['dashboard', 'users', 'clients', 'plans', 'services', 'occupancy'].includes(p)
        ) as Permission[];
        
        setUser({
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
        });
        toast.success(`Bem-vindo, ${profileData.name}!`);
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

  const hasPermission = (permission: Permission) => {
    return user?.permissions.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
