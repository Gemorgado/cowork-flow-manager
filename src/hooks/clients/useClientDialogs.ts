
import { useState } from 'react';
import { Client } from '@/types';
import { useClientFormState, FormData } from './useClientFormState';

export const useClientDialogs = () => {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isDeleteClientOpen, setIsDeleteClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const { formData, handleInputChange, handleDateChange, handleServiceChange, resetForm, setFormData } = 
    useClientFormState(selectedClient);

  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      companyName: client.companyName,
      tradeName: client.tradeName,
      document: client.document,
      email: client.email,
      phone: client.phone,
      address: client.address,
      startDate: client.startDate,
      endDate: client.endDate,
      loyaltyMonths: client.loyaltyMonths,
      value: client.value,
      dueDay: client.dueDay,
      selectedServiceId: client.services[0]?.serviceId || '',
      locationIds: client.services[0]?.locationIds || [],
    });
    setIsEditClientOpen(true);
  };

  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteClientOpen(true);
  };

  return {
    isAddClientOpen,
    isEditClientOpen,
    isDeleteClientOpen,
    selectedClient,
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
  };
};
