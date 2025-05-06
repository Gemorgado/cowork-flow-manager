
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Permission } from '@/types';
import { toast } from 'sonner';

export const fetchUserProfile = async (userId: string, userEmail: string, userName?: string, token?: string) => {
  try {
    console.log('Getting profile data for user:', userId);
    // Get user profile data with permissions
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
      
    if (profileData) {
      console.log('Profile found:', profileData);
      
      // Ensure the user has at least the basic permissions to view the dashboard
      let userPermissions = profileData.permissions || [];
      
      // Convert string[] permissions to Permission[] type by validating each permission
      const validPermissions = (userPermissions).filter((p: string) => 
        ['dashboard', 'users', 'clients', 'plans', 'services', 'occupancy'].includes(p)
      ) as Permission[];
      
      const user: AuthUser = {
        id: userId,
        name: profileData.name || userName || '',
        email: userEmail || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        password: '', // Don't store password
        permissions: validPermissions,
        token: token || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return user;
    } else {
      console.log('No profile found, user may not have access');
      return null;
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const ensureBasicPermissions = async (userId: string, userPermissions: string[]) => {
  if (!userPermissions || userPermissions.length === 0) {
    console.log('No permissions found, adding default dashboard permission');
    const newPermissions = ['dashboard'];
    
    // Update the profile with basic permissions
    try {
      await supabase
        .from('profiles')
        .update({ permissions: newPermissions })
        .eq('id', userId);
        
      return newPermissions;
    } catch (error) {
      console.error('Error updating permissions:', error);
      throw error;
    }
  }
  
  return userPermissions;
};
