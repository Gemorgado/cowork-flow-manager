
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
    handleAddUser: addUser,
    handleEditUser: editUser,
    handleDeleteUser: deleteUser,
  } = useUserOperations({
    users,
    setUsers,
    resetForm,
    setIsAddUserOpen,
    setIsEditUserOpen,
    setIsDeleteUserOpen,
    setSelectedUser,
  });

  // Funções wrapper que garantem que os parâmetros corretos são passados
  const handleAddUser = () => {
    return addUser(formData);
  };

  const handleEditUser = () => {
    return editUser(formData, selectedUser);
  };

  const handleDeleteUser = () => {
    return deleteUser(selectedUser);
  };

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
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    openEditDialog,
    openDeleteDialog,
  };
};

export default useUserForm;
