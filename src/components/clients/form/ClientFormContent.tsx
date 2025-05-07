
import React from 'react';
import FormSection from './FormSection';
import DatePickerSection from './DatePickerSection';
import ServiceSelectionSection from './ServiceSelectionSection';
import { Service } from '@/types';

interface ClientFormContentProps {
  formData: any;
  services: Service[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (field: 'startDate' | 'endDate', date: Date | undefined) => void;
  handleServiceChange: (serviceId: string, locationIds: string[]) => void;
  isEditing?: boolean;
}

const ClientFormContent = ({
  formData,
  services,
  handleInputChange,
  handleDateChange,
  handleServiceChange,
  isEditing = false,
}: ClientFormContentProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <FormSection
          label="Razão Social"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
        />
        <FormSection
          label="Nome Fantasia"
          id="tradeName"
          name="tradeName"
          value={formData.tradeName}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormSection
          label="CNPJ"
          id="document"
          name="document"
          value={formData.document}
          onChange={handleInputChange}
        />
        <FormSection
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormSection
          label="Telefone"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
        <FormSection
          label="Endereço"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DatePickerSection
          label="Data de Início"
          date={formData.startDate}
          onSelect={(date) => handleDateChange('startDate', date)}
        />
        <DatePickerSection
          label="Data de Término"
          date={formData.endDate}
          onSelect={(date) => handleDateChange('endDate', date)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormSection
          label="Fidelidade (meses)"
          id="loyaltyMonths"
          name="loyaltyMonths"
          type="number"
          value={formData.loyaltyMonths}
          onChange={handleInputChange}
          min={1}
        />
        <FormSection
          label="Valor"
          id="value"
          name="value"
          type="number"
          value={formData.value}
          onChange={handleInputChange}
          min={0}
          step={0.01}
        />
        <FormSection
          label="Dia de Vencimento"
          id="dueDay"
          name="dueDay"
          type="number"
          value={formData.dueDay}
          onChange={handleInputChange}
          min={1}
          max={31}
        />
      </div>

      <ServiceSelectionSection
        services={services}
        selectedServiceId={formData.selectedServiceId}
        onServiceChange={handleServiceChange}
      />
    </div>
  );
};

export default ClientFormContent;
