
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User, Permission } from '@/types';
import { users as mockUsers } from '@/mock/users';
import { toast } from 'sonner';
import AddUserDialog from '@/components/users/AddUserDialog';
import EditUserDialog from '@/components/users/EditUserDialog';
import DeleteUserDialog from '@/components/users/DeleteUserDialog';
import UsersTable from '@/components/users/UsersTable';

const Users = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    permissions: [] as Permission[],
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
        <AddUserDialog
          isOpen={isAddUserOpen}
          onOpenChange={setIsAddUserOpen}
          formData={formData}
          permissionOptions={permissionOptions}
          handleInputChange={handleInputChange}
          handlePermissionChange={handlePermissionChange}
          handleAddUser={handleAddUser}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Gerenciamento de acesso ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            permissionOptions={permissionOptions}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <EditUserDialog
        isOpen={isEditUserOpen}
        onOpenChange={setIsEditUserOpen}
        formData={formData}
        permissionOptions={permissionOptions}
        handleInputChange={handleInputChange}
        handlePermissionChange={handlePermissionChange}
        handleEditUser={handleEditUser}
      />

      {/* Delete User Dialog */}
      <DeleteUserDialog
        isOpen={isDeleteUserOpen}
        onOpenChange={setIsDeleteUserOpen}
        selectedUser={selectedUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default Users;
