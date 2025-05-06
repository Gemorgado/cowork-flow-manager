
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import UserForm from './UserForm';
import { Permission } from '@/types';

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string; // Added password field
    permissions: Permission[];
  };
  permissionOptions: { value: Permission; label: string }[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePermissionChange: (permission: Permission) => void;
  handleAddUser: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  permissionOptions,
  handleInputChange,
  handlePermissionChange,
  handleAddUser,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-cowork-600 hover:bg-cowork-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Usuário</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar um novo usuário.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          formData={formData}
          permissionOptions={permissionOptions}
          handleInputChange={handleInputChange}
          handlePermissionChange={handlePermissionChange}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleAddUser}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
