
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Service } from '@/types';

interface ServiceSelectionSectionProps {
  services: Service[];
  selectedServiceId: string;
  onServiceChange: (serviceId: string, locationIds: string[]) => void;
}

const ServiceSelectionSection = ({
  services,
  selectedServiceId,
  onServiceChange,
}: ServiceSelectionSectionProps) => {
  return (
    <div className="grid gap-2">
      <Label>Serviço Contratado</Label>
      <Select
        value={selectedServiceId}
        onValueChange={(value) => onServiceChange(value, [])}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um serviço" />
        </SelectTrigger>
        <SelectContent>
          {services.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ServiceSelectionSection;
