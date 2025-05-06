
import { useAuthentication } from './auth/useAuthentication';
import { useAuthSession } from './auth/useAuthSession';
import { usePermissions } from './auth/usePermissions';

export const useAuthProvider = () => {
  const { 
    user, 
    setUser, 
    loading, 
    setLoading,
    login,
    logout
  } = useAuthentication();

  // Initialize auth session
  useAuthSession(setUser, setLoading);

  // Initialize permissions
  const { hasPermission } = usePermissions(user?.permissions);

  return {
    user,
    loading,
    login,
    logout,
    hasPermission
  };
};
