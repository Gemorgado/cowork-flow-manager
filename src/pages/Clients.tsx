import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const EMPTY_CLIENT = {
  companyName: '',
  tradeName: '',
  document: '',
  email: '',
  phone: '',
  address: '',
  startDate: new Date(),
  endDate: new Date(),
  loyaltyMonths: 0,
  value: 0,
  dueDay: 1,
  services: []
};

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
    resetForm,
  } = useClientForm({ clients, setClients });

  // Reset form data when opening the add client dialog
  const handleOpenAddDialog = () => {
    // Reset form to empty state
    const resetFormData = {
      ...EMPTY_CLIENT,
      id: '', // Clear the ID to indicate it's a new client
    };
    
    // Update formData state with empty values
    Object.keys(formData).forEach(key => {
      if (key in resetFormData) {
        handleInputChange({
          target: { name: key, value: resetFormData[key as keyof typeof resetFormData] }
        } as React.ChangeEvent<HTMLInputElement>);
      }
    });
    
    // Reset date fields
    handleDateChange('startDate', new Date());
    handleDateChange('endDate', new Date());
    
    // Reset services
    handleServiceChange('', []);
    
    // Open the dialog
    setIsAddClientOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Clientes</h1>
        <Button 
          onClick={handleOpenAddDialog}
        >
          Novo Cliente
        </Button>
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

      {/* Add Client Dialog */}
      <AddClientDialog
        isOpen={isAddClientOpen}
        onOpenChange={setIsAddClientOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleDateChange={handleDateChange}
        handleServiceChange={handleServiceChange}
        handleAddClient={() => {
          handleAddClient();
          toast.success("Cliente adicionado com sucesso!");
        }}
      />

      {/* Edit Client Dialog */}
      <EditClientDialog
        isOpen={isEditClientOpen}
        onOpenChange={setIsEditClientOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleDateChange={handleDateChange}
        handleServiceChange={handleServiceChange}
        handleEditClient={() => {
          handleEditClient();
          toast.success("Cliente atualizado com sucesso!");
        }}
      />

      {/* Delete Client Dialog */}
      <DeleteClientDialog
        isOpen={isDeleteClientOpen}
        onOpenChange={setIsDeleteClientOpen}
        selectedClient={selectedClient}
        onDelete={() => {
          handleDeleteClient();
          toast.success("Cliente removido com sucesso!");
        }}
      />
    </div>
  );
};

export default Clients;
