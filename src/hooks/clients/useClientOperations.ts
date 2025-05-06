
import { toast } from 'sonner';
import { Client, Service } from '@/types';
import { services } from '@/mock/services';
import { FormData } from './useClientFormState';

interface UseClientOperationsProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  resetForm: () => void;
  setIsAddClientOpen: (isOpen: boolean) => void;
  setIsEditClientOpen: (isOpen: boolean) => void;
  setIsDeleteClientOpen: (isOpen: boolean) => void;
  setSelectedClient: (client: Client | null) => void;
}

export const useClientOperations = ({
  clients,
  setClients,
  resetForm,
  setIsAddClientOpen,
  setIsEditClientOpen,
  setIsDeleteClientOpen,
  setSelectedClient,
}: UseClientOperationsProps) => {
  
  const handleAddClient = (formData: FormData) => {
    // Validação simples
    if (!formData.companyName || !formData.email || !formData.selectedServiceId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const selectedService = services.find(s => s.id === formData.selectedServiceId);
    
    if (!selectedService) {
      toast.error('Selecione um serviço válido');
      return;
    }

    const newClient: Client = {
      id: `client${clients.length + 1}`,
      companyName: formData.companyName,
      tradeName: formData.tradeName,
      document: formData.document,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      startDate: formData.startDate,
      endDate: formData.endDate,
      loyaltyMonths: formData.loyaltyMonths,
      value: formData.value,
      dueDay: formData.dueDay,
      services: [
        {
          id: `cs${clients.length + 1}`,
          clientId: `client${clients.length + 1}`,
          serviceId: formData.selectedServiceId,
          service: selectedService,
          locationIds: formData.locationIds,
          startDate: formData.startDate,
          endDate: formData.endDate,
          value: formData.value,
        },
      ],
    };

    setClients([...clients, newClient]);
    setIsAddClientOpen(false);
    resetForm();
    toast.success('Cliente adicionado com sucesso!');
  };

  const handleEditClient = (formData: FormData, selectedClient: Client | null) => {
    if (!selectedClient) return;

    // Validação simples
    if (!formData.companyName || !formData.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const selectedService = formData.selectedServiceId 
      ? services.find(s => s.id === formData.selectedServiceId)
      : selectedClient.services[0]?.service;

    if (!selectedService) {
      toast.error('Selecione um serviço válido');
      return;
    }

    // Update client service if service changed
    const updatedServices = [...selectedClient.services];
    if (formData.selectedServiceId && formData.selectedServiceId !== selectedClient.services[0]?.serviceId) {
      updatedServices[0] = {
        ...updatedServices[0],
        serviceId: formData.selectedServiceId,
        service: selectedService,
        locationIds: formData.locationIds,
        startDate: formData.startDate,
        endDate: formData.endDate,
        value: formData.value,
      };
    }

    const updatedClients = clients.map((client) =>
      client.id === selectedClient.id
        ? {
            ...client,
            companyName: formData.companyName,
            tradeName: formData.tradeName,
            document: formData.document,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            startDate: formData.startDate,
            endDate: formData.endDate,
            loyaltyMonths: formData.loyaltyMonths,
            value: formData.value,
            dueDay: formData.dueDay,
            services: updatedServices,
          }
        : client
    );

    setClients(updatedClients);
    setIsEditClientOpen(false);
    setSelectedClient(null);
    resetForm();
    toast.success('Cliente atualizado com sucesso!');
  };

  const handleDeleteClient = (selectedClient: Client | null) => {
    if (!selectedClient) return;

    const updatedClients = clients.filter((client) => client.id !== selectedClient.id);
    setClients(updatedClients);
    setIsDeleteClientOpen(false);
    setSelectedClient(null);
    toast.success('Cliente removido com sucesso!');
  };

  return {
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
  };
};
