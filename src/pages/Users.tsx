import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from '@/types';
import AddUserDialog from '@/components/users/AddUserDialog';
import EditUserDialog from '@/components/users/EditUserDialog';
import DeleteUserDialog from '@/components/users/DeleteUserDialog';
import UsersTable from '@/components/users/UsersTable';
import useUserForm from '@/hooks/useUserForm';
import { fetchUsers } from '@/utils/users';

interface UsersProps {
  isTab?: boolean;
}

const Users: React.FC<UsersProps> = ({ isTab = false }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  // Load users from Supabase when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const userData = await fetchUsers();
        setUsers(userData);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

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
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <UsersTable
            users={users}
            permissionOptions={permissionOptions}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        )}

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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <UsersTable
              users={users}
              permissionOptions={permissionOptions}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          )}
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
