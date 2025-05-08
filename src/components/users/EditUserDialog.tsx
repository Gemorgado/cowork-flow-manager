
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import UserForm from './UserForm';
import { Permission } from '@/types';

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    permissions: Permission[];
  };
  permissionOptions: { value: Permission; label: string }[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePermissionChange: (permission: Permission) => void;
  handleEditUser: () => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  permissionOptions,
  handleInputChange,
  handlePermissionChange,
  handleEditUser,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          formData={formData}
          permissionOptions={permissionOptions}
          handleInputChange={handleInputChange}
          handlePermissionChange={handlePermissionChange}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleEditUser}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
