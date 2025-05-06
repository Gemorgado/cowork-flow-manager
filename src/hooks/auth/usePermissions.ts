
import { Permission } from '@/types';

export const usePermissions = (userPermissions: Permission[] = []) => {
  const hasPermission = (permission: Permission) => {
    return userPermissions.includes(permission) || false;
  };

  return { hasPermission };
};
