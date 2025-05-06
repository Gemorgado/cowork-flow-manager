
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Permission } from '@/types';

interface UserFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    permissions: Permission[];
  };
  permissionOptions: { value: Permission; label: string }[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePermissionChange: (permission: Permission) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
}

const UserForm: React.FC<UserFormProps> = ({
  formData,
  permissionOptions,
  handleInputChange,
  handlePermissionChange,
  onCancel,
  onSubmit,
  submitLabel = 'Salvar'
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Nome completo"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="email@exemplo.com"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="(00) 00000-0000"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Endereço completo"
        />
      </div>
      <div className="grid gap-2">
        <Label>Permissões</Label>
        <div className="flex flex-wrap gap-4">
          {permissionOptions.map((permission) => (
            <div key={permission.value} className="flex items-center space-x-2">
              <Checkbox
                id={`permission-${permission.value}`}
                checked={formData.permissions.includes(permission.value)}
                onCheckedChange={() =>
                  handlePermissionChange(permission.value)
                }
              />
              <label
                htmlFor={`permission-${permission.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {permission.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>{submitLabel}</Button>
      </DialogFooter>
    </div>
  );
};

export default UserForm;
