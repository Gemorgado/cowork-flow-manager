
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClientBasicInfoProps {
  formData: {
    companyName: string;
    tradeName: string;
    document: string;
    email: string;
    phone: string;
    address: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string[]>;
  isSubmitting?: boolean;
}

export const ClientBasicInfo: React.FC<ClientBasicInfoProps> = ({
  formData,
  handleInputChange,
  errors = {},
  isSubmitting = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">
            Razão Social <span className="text-destructive">*</span>
          </Label>
          <Input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Razão Social"
            disabled={isSubmitting}
            className={errors.companyName ? "border-destructive" : ""}
          />
          {errors.companyName && (
            <p className="text-xs text-destructive">{errors.companyName[0]}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tradeName">Nome Fantasia</Label>
          <Input
            id="tradeName"
            name="tradeName"
            value={formData.tradeName}
            onChange={handleInputChange}
            placeholder="Nome Fantasia"
            disabled={isSubmitting}
            className={errors.tradeName ? "border-destructive" : ""}
          />
          {errors.tradeName && (
            <p className="text-xs text-destructive">{errors.tradeName[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="document">CNPJ</Label>
          <Input
            id="document"
            name="document"
            value={formData.document}
            onChange={handleInputChange}
            placeholder="00.000.000/0000-00"
            disabled={isSubmitting}
            className={errors.document ? "border-destructive" : ""}
          />
          {errors.document && (
            <p className="text-xs text-destructive">{errors.document[0]}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="email@empresa.com"
            disabled={isSubmitting}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(00) 00000-0000"
            disabled={isSubmitting}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone[0]}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Endereço completo"
            disabled={isSubmitting}
            className={errors.address ? "border-destructive" : ""}
          />
          {errors.address && (
            <p className="text-xs text-destructive">{errors.address[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
};
