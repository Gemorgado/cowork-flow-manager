
import { User } from '@/types';
import { toast } from 'sonner';
import { FormData } from './useUserFormState';
import { 
  addUser as addUserToSupabase,
  updateUser as updateUserInSupabase,
  deleteUser as deleteUserFromSupabase
} from '@/utils/supabaseUsers';

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
  const handleAddUser = async (formData: FormData) => {
    // Simple validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Nome, email e senha são obrigatórios');
      return;
    }

    try {
      const newUser = await addUserToSupabase({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        permissions: formData.permissions,
      });

      if (newUser) {
        setUsers(prev => [...prev, newUser]);
        setIsAddUserOpen(false);
        resetForm();
        toast.success('Usuário adicionado com sucesso!');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Erro ao adicionar usuário');
    }
  };

  const handleEditUser = async (formData: FormData, selectedUser: User | null) => {
    if (!selectedUser) return;

    // Simple validation
    if (!formData.name || !formData.email) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    try {
      const updatedUser = await updateUserInSupabase({
        ...selectedUser,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password, // Include password in update
        permissions: formData.permissions,
      });

      if (updatedUser) {
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id ? updatedUser : user
        ));
        setIsEditUserOpen(false);
        setSelectedUser(null);
        resetForm();
        toast.success('Usuário atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Erro ao atualizar usuário');
    }
  };

  const handleDeleteUser = async (selectedUser: User | null) => {
    if (!selectedUser) return;

    try {
      const success = await deleteUserFromSupabase(selectedUser.id);
      
      if (success) {
        setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
        setIsDeleteUserOpen(false);
        setSelectedUser(null);
        toast.success('Usuário removido com sucesso!');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  return {
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
  };
};
