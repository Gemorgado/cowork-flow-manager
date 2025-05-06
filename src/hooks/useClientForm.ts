
import { useState } from 'react';
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
    openEditDialog,
    openDeleteDialog,
  } = useClientDialogs();

  const {
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
  } = useClientOperations({
    clients,
    setClients,
    resetForm,
    setIsAddClientOpen,
    setIsEditClientOpen,
    setIsDeleteClientOpen,
    setSelectedClient,
  });

  const addClient = () => handleAddClient(formData);
  const editClient = () => handleEditClient(formData, selectedClient);
  const deleteClient = () => handleDeleteClient(selectedClient);

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
    handleAddClient: addClient,
    handleEditClient: editClient,
    handleDeleteClient: deleteClient,
    openEditDialog,
    openDeleteDialog,
  };
};

export default useClientForm;
