
import { useState } from 'react';
import { Client, Service } from '@/types';
import { toast } from 'sonner';
import { services } from '@/mock/services';

type FormData = {
  companyName: string;
  tradeName: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  startDate: Date;
  endDate: Date;
  loyaltyMonths: number;
  value: number;
  dueDay: number;
  selectedServiceId: string;
  locationIds: string[];
};

interface UseClientFormProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

const useClientForm = ({ clients, setClients }: UseClientFormProps) => {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isDeleteClientOpen, setIsDeleteClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
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
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date) {
      setFormData((prev) => {
        // If startDate is changed, update loyaltyMonths and endDate
        if (field === 'startDate') {
          const endDate = prev.endDate;
          const diffMonths = Math.ceil(
            (endDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30)
          );
          return {
            ...prev,
            [field]: date,
            loyaltyMonths: diffMonths > 0 ? diffMonths : 1,
          };
        }
        // If endDate is changed, update loyaltyMonths
        else {
          const { startDate } = prev;
          const diffMonths = Math.ceil(
            (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
          );
          return {
            ...prev,
            [field]: date,
            loyaltyMonths: diffMonths > 0 ? diffMonths : 1,
          };
        }
      });
    }
  };

  const handleServiceChange = (serviceId: string, locationIds: string[] = []) => {
    setFormData((prev) => ({
      ...prev,
      selectedServiceId: serviceId,
      locationIds: locationIds,
    }));
  };

  const resetForm = () => {
    setFormData({
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
    });
  };

  const handleAddClient = () => {
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

  const handleEditClient = () => {
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

  const handleDeleteClient = () => {
    if (!selectedClient) return;

    const updatedClients = clients.filter((client) => client.id !== selectedClient.id);
    setClients(updatedClients);
    setIsDeleteClientOpen(false);
    setSelectedClient(null);
    toast.success('Cliente removido com sucesso!');
  };

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
  };
};

export default useClientForm;
