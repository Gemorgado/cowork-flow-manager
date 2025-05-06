
import { useState } from 'react';
import { User, Permission } from '@/types';
import { toast } from 'sonner';

type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  permissions: Permission[];
};

interface UseUserFormProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const useUserForm = ({ users, setUsers }: UseUserFormProps) => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    permissions: [],
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
      permissions: [],
    });
  };

  const handleAddUser = () => {
    // Validação simples
    if (!formData.name || !formData.email) {
      toast.error('Nome e email são obrigatórios');
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

  const handleEditUser = () => {
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

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setIsDeleteUserOpen(false);
    setSelectedUser(null);
    toast.success('Usuário removido com sucesso!');
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      permissions: user.permissions,
    });
    setIsEditUserOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
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
