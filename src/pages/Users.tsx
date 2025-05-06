
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { users as mockUsers } from '@/mock/users';
import { User, Permission } from '@/types';
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddUser}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Gerenciamento de acesso ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead className="w-16">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="secondary"
                          className="text-xs"
                        >
                          {
                            permissionOptions.find((p) => p.value === permission)
                              ?.label
                          }
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Endereço</Label>
              <Input
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label>Permissões</Label>
              <div className="flex flex-wrap gap-4">
                {permissionOptions.map((permission) => (
                  <div key={permission.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-permission-${permission.value}`}
                      checked={formData.permissions.includes(permission.value)}
                      onCheckedChange={() =>
                        handlePermissionChange(permission.value)
                      }
                    />
                    <label
                      htmlFor={`edit-permission-${permission.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o usuário{' '}
              <span className="font-medium">{selectedUser?.name}</span>?
              <br />
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
