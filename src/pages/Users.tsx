
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from '@/types';
import { users as mockUsers } from '@/mock/users';
import AddUserDialog from '@/components/users/AddUserDialog';
import EditUserDialog from '@/components/users/EditUserDialog';
import DeleteUserDialog from '@/components/users/DeleteUserDialog';
import UsersTable from '@/components/users/UsersTable';
import useUserForm from '@/hooks/useUserForm';

interface UsersProps {
  isTab?: boolean;
}

const Users: React.FC<UsersProps> = ({ isTab = false }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  const {
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
  } = useUserForm({ users, setUsers });

  if (isTab) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Gerenciamento de Usuários</h2>
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
        
        <UsersTable
          users={users}
          permissionOptions={permissionOptions}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />

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
  }

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
