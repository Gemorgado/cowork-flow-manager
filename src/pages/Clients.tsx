
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Client } from '@/types';
import { clients as mockClients } from '@/mock/clients';
import ClientsTable from '@/components/clients/ClientsTable';
import AddClientDialog from '@/components/clients/AddClientDialog';
import EditClientDialog from '@/components/clients/EditClientDialog';
import DeleteClientDialog from '@/components/clients/DeleteClientDialog';
import useClientForm from '@/hooks/useClientForm';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  
  const {
    formData,
    isAddClientOpen,
    isEditClientOpen,
    isDeleteClientOpen,
    selectedClient,
    setIsAddClientOpen,
    setIsEditClientOpen,
    setIsDeleteClientOpen,
    handleInputChange,
    handleDateChange,
    handleServiceChange,
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
    openEditDialog,
    openDeleteDialog,
  } = useClientForm({ clients, setClients });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Clientes</h1>
        <AddClientDialog
          isOpen={isAddClientOpen}
          onOpenChange={setIsAddClientOpen}
          formData={formData}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          handleServiceChange={handleServiceChange}
          handleAddClient={handleAddClient}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Gerenciamento de clientes e contratos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientsTable
            clients={clients}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      {/* Edit Client Dialog */}
      <EditClientDialog
        isOpen={isEditClientOpen}
        onOpenChange={setIsEditClientOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleDateChange={handleDateChange}
        handleServiceChange={handleServiceChange}
        handleEditClient={handleEditClient}
      />

      {/* Delete Client Dialog */}
      <DeleteClientDialog
        isOpen={isDeleteClientOpen}
        onOpenChange={setIsDeleteClientOpen}
        selectedClient={selectedClient}
        onDelete={handleDeleteClient}
      />
    </div>
  );
};

export default Clients;
