
import { useState, useEffect } from 'react';
import { Client } from '@/types';
import { useClientDialogs } from './clients/useClientDialogs';
import { useClientOperations } from './clients/useClientOperations';

interface UseClientFormProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

const useClientForm = ({ clients, setClients }: UseClientFormProps) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const {
    isAddClientOpen,
    isEditClientOpen,
    isDeleteClientOpen,
    formData,
    setIsAddClientOpen,
    setIsEditClientOpen,
    setIsDeleteClientOpen,
    handleInputChange,
    handleDateChange,
    handleServiceChange,
    resetForm,
    openEditDialog: openEditDialogBase,
    openDeleteDialog: openDeleteDialogBase,
    setFormData,
  } = useClientDialogs();

  const {
    handleAddClient: addClient,
    handleEditClient: editClient,
    handleDeleteClient: deleteClient,
  } = useClientOperations({
    clients,
    setClients,
    resetForm,
    setIsAddClientOpen,
    setIsEditClientOpen,
    setIsDeleteClientOpen,
    setSelectedClient,
  });

  // Enhanced open edit dialog function that also sets the form data
  const openEditDialog = (client: Client) => {
    // Set selected client
    setSelectedClient(client);
    
    // Update the form with client data using setFormData from useClientDialogs
    openEditDialogBase(client);
  };
  
  // Enhanced open delete dialog
  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    openDeleteDialogBase(client);
  };

  const handleAddClient = () => addClient(formData);
  const handleEditClient = () => editClient(formData, selectedClient);
  const handleDeleteClient = () => deleteClient(selectedClient);

  return {
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
  };
};

export default useClientForm;
