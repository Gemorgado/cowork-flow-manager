
import { useState } from 'react';
import { Client, Service } from '@/types';

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

export const useClientFormState = (selectedClient: Client | null = null) => {
  const initialFormData: FormData = selectedClient
    ? {
        companyName: selectedClient.companyName,
        tradeName: selectedClient.tradeName,
        document: selectedClient.document,
        email: selectedClient.email,
        phone: selectedClient.phone,
        address: selectedClient.address,
        startDate: selectedClient.startDate,
        endDate: selectedClient.endDate,
        loyaltyMonths: selectedClient.loyaltyMonths,
        value: selectedClient.value,
        dueDay: selectedClient.dueDay,
        selectedServiceId: selectedClient.services[0]?.serviceId || '',
        locationIds: selectedClient.services[0]?.locationIds || [],
      }
    : {
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
      };

  const [formData, setFormData] = useState<FormData>(initialFormData);

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

  return {
    formData,
    handleInputChange,
    handleDateChange,
    handleServiceChange,
    resetForm,
    setFormData,
  };
};

export type { FormData };
