
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Service } from '@/types';
import { ClientBasicInfo } from './ClientBasicInfo';
import { ClientContractInfo } from './ClientContractInfo';
import { ClientServiceSelect } from './ClientServiceSelect';

interface ClientFormContentProps {
  formData: {
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
  services: Service[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (field: 'startDate' | 'endDate', date: Date | undefined) => void;
  handleServiceChange: (serviceId: string, locationIds: string[]) => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
  errors?: Record<string, string[]>;
}

const ClientFormContent: React.FC<ClientFormContentProps> = ({
  formData,
  services,
  handleInputChange,
  handleDateChange,
  handleServiceChange,
  isEditing = false,
  isSubmitting = false,
  errors = {}
}) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
        <TabsTrigger value="contract">Contrato</TabsTrigger>
        <TabsTrigger value="services">Serviços</TabsTrigger>
      </TabsList>
      <TabsContent value="basic">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Empresa</CardTitle>
            <CardDescription>
              Informações básicas do cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientBasicInfo 
              formData={formData} 
              handleInputChange={handleInputChange} 
              errors={errors}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="contract">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Contrato</CardTitle>
            <CardDescription>
              Detalhes do contrato e pagamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientContractInfo 
              formData={formData} 
              handleInputChange={handleInputChange} 
              handleDateChange={handleDateChange} 
              errors={errors}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="services">
        <Card>
          <CardHeader>
            <CardTitle>Serviços Contratados</CardTitle>
            <CardDescription>
              Selecione os serviços que o cliente irá contratar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientServiceSelect 
              services={services}
              selectedServiceId={formData.selectedServiceId}
              selectedLocationIds={formData.locationIds}
              onServiceChange={handleServiceChange}
              errors={errors}
              disabled={isSubmitting}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ClientFormContent;
