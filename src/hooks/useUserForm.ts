
import { useState } from 'react';
import { User } from '@/types';
import { useUserDialogs } from './users/useUserDialogs';
import { useUserOperations } from './users/useUserOperations';

interface UseUserFormProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const useUserForm = ({ users, setUsers }: UseUserFormProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const {
    isAddUserOpen,
    isEditUserOpen,
    isDeleteUserOpen,
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
  } = useUserDialogs();

  const {
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
  } = useUserOperations({
    users,
    setUsers,
    resetForm,
    setIsAddUserOpen,
    setIsEditUserOpen,
    setIsDeleteUserOpen,
    setSelectedUser,
  });

  const addUser = () => handleAddUser(formData);
  const editUser = () => handleEditUser(formData, selectedUser);
  const deleteUser = () => handleDeleteUser(selectedUser);

  return {
    formData,
    permissionOptions,
    isAddUserOpen,
    isEditUserOpen,
    isDeleteUserOpen,
    selectedUser,
    setIsAddUserOpen,
    setIsEditUserOpen,
    setIsDeleteUserOpen,
    handleInputChange,
    handlePermissionChange,
    handleAddUser: addUser,
    handleEditUser: editUser,
    handleDeleteUser: deleteUser,
    openEditDialog,
    openDeleteDialog,
  };
};

export default useUserForm;
