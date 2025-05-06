
import { useState } from 'react';
import { User } from '@/types';
import { useUserFormState } from './useUserFormState';

export const useUserDialogs = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const { formData, setFormData, permissionOptions, handleInputChange, handlePermissionChange, resetForm } = 
    useUserFormState(selectedUser);

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      password: user.password || '', // Include password in edit form
      permissions: user.permissions,
    });
    setIsEditUserOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  };

  return {
    isAddUserOpen,
    isEditUserOpen,
    isDeleteUserOpen,
    selectedUser,
    formData,
    permissionOptions,
    setIsAddUserOpen,
    setIsEditUserOpen,
    setIsDeleteUserOpen,
    handleInputChange,
    handlePermissionChange,
    resetForm,
    openEditDialog,
    openDeleteDialog,
  };
};
