
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Client } from '@/types';
import ClientsTable from '@/components/clients/ClientsTable';
import AddClientDialog from '@/components/clients/AddClientDialog';
import EditClientDialog from '@/components/clients/EditClientDialog';
import DeleteClientDialog from '@/components/clients/DeleteClientDialog';
import useClientForm from '@/hooks/useClientForm';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { fetchClients } from '@/utils/clients';

const EMPTY_CLIENT = {
  companyName: '',
  tradeName: '',
  document: '',
  email: '',
  phone: '',
  address: '',
  startDate: new Date(),
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 12)),
  loyaltyMonths: 12,
  value: 0,
  dueDay: 15,
  selectedServiceId: '',
  locationIds: [],
  services: []
};

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
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
    setFormData,
  } = useClientForm({ clients, setClients });

  // Load clients from Supabase when component mounts
  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      try {
        console.log('Fetching clients from Supabase...');
        const clientsData = await fetchClients();
        console.log('Clients fetched successfully:', clientsData);
        setClients(clientsData);
      } catch (error) {
        console.error('Error loading clients:', error);
        toast.error('Erro ao carregar clientes');
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  // Reset form data when opening the add client dialog
  const handleOpenAddDialog = () => {
    console.log('Opening add client dialog...');
    // Completely reset the form data with empty values
    setFormData({
      ...EMPTY_CLIENT
    });
    
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ClientsTable
              clients={clients}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          )}
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
        handleAddClient={handleAddClient}
      />

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
