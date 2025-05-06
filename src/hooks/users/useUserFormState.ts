
import { useState } from 'react';
import { Permission } from '@/types';

export type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string; // Added password field
  permissions: Permission[];
};

export const useUserFormState = (initialUser: any = null) => {
  const [formData, setFormData] = useState<FormData>({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    phone: initialUser?.phone || '',
    address: initialUser?.address || '',
    password: initialUser?.password || '',
    permissions: initialUser?.permissions || [],
  });

  const permissionOptions: { value: Permission; label: string }[] = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'users', label: 'Usuários' },
    { value: 'clients', label: 'Clientes' },
    { value: 'plans', label: 'Planos' },
    { value: 'services', label: 'Serviços' },
    { value: 'occupancy', label: 'Ocupação' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permission: Permission) => {
    setFormData((prev) => {
      const permissions = [...prev.permissions];
      if (permissions.includes(permission)) {
        return {
          ...prev,
          permissions: permissions.filter((p) => p !== permission),
        };
      } else {
        return {
          ...prev,
          permissions: [...permissions, permission],
        };
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      permissions: [],
    });
  };

  return {
    formData,
    setFormData,
    permissionOptions,
    handleInputChange,
    handlePermissionChange,
    resetForm,
  };
};
