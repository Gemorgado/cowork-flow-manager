
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { AuthUser, Permission } from '@/types';
import { fetchUserProfile, ensureBasicPermissions } from './useProfile';

export const useAuthSession = (
  setUser: (user: AuthUser | null) => void,
  setLoading: (loading: boolean) => void
) => {
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
              
              // Ensure the user has at least the basic permissions to view the dashboard
              let userPermissions = await ensureBasicPermissions(
                userData.user.id, 
                profileData.permissions || []
              );
              
              // Convert string[] permissions to Permission[] type by validating each permission
              const validPermissions = (userPermissions).filter((p: string) => 
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
              console.log('User set in context with permissions:', validPermissions);
            } else {
              console.log('No profile found, user may not have access');
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
            // Ensure the user has at least the basic permissions to view the dashboard
            let userPermissions = await ensureBasicPermissions(
              userData.user.id, 
              profileData.permissions || []
            );
            
            // Convert string[] permissions to Permission[] type by validating each permission
            const validPermissions = (userPermissions).filter((p: string) => 
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
            console.log('User set in context with permissions:', validPermissions);
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
  }, [setUser, setLoading]);
};
