
import { User } from '@/types';
import { toast } from 'sonner';
import { FormData } from './useUserFormState';

interface UseUserOperationsProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  resetForm: () => void;
  setIsAddUserOpen: (isOpen: boolean) => void;
  setIsEditUserOpen: (isOpen: boolean) => void;
  setIsDeleteUserOpen: (isOpen: boolean) => void;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const useUserOperations = ({
  users,
  setUsers,
  resetForm,
  setIsAddUserOpen,
  setIsEditUserOpen,
  setIsDeleteUserOpen,
  setSelectedUser,
}: UseUserOperationsProps) => {
  const handleAddUser = (formData: FormData) => {
    // Validação simples
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Nome, email e senha são obrigatórios');
      return;
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setUsers([...users, newUser]);
    setIsAddUserOpen(false);
    resetForm();
    toast.success('Usuário adicionado com sucesso!');
  };

  const handleEditUser = (formData: FormData, selectedUser: User | null) => {
    if (!selectedUser) return;

    // Validação simples
    if (!formData.name || !formData.email) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id
        ? {
            ...user,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            password: formData.password, // Include password in update
            permissions: formData.permissions,
            updatedAt: new Date(),
          }
        : user
    );

    setUsers(updatedUsers);
    setIsEditUserOpen(false);
    setSelectedUser(null);
    resetForm();
    toast.success('Usuário atualizado com sucesso!');
  };

  const handleDeleteUser = (selectedUser: User | null) => {
    if (!selectedUser) return;

    const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setIsDeleteUserOpen(false);
    setSelectedUser(null);
    toast.success('Usuário removido com sucesso!');
  };

  return {
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
  };
};
