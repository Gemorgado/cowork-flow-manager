
import React from 'react';
import { Service } from '@/types';
import ClientFormContent from './form/ClientFormContent';

interface ClientFormProps {
  formData: any;
  services: Service[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (field: 'startDate' | 'endDate', date: Date | undefined) => void;
  handleServiceChange: (serviceId: string, locationIds: string[]) => void;
  isEditing?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const ClientForm = ({
  formData,
  services,
  handleInputChange,
  handleDateChange,
  handleServiceChange,
  isEditing = false,
  onSubmit,
  onCancel,
}: ClientFormProps) => {
  return (
    <ClientFormContent
      formData={formData}
      services={services}
      handleInputChange={handleInputChange}
      handleDateChange={handleDateChange}
      handleServiceChange={handleServiceChange}
      isEditing={isEditing}
    />
  );
};

export default ClientForm;
