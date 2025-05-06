
import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Service } from '@/types';
import { usePermissions } from '@/hooks/auth/usePermissions';
import { Permission } from '@/types';
import PeriodicityToggle from './catalog/PeriodicityToggle';
import BenefitsAccordion from './catalog/BenefitsAccordion';
import ServiceEditDialog from './catalog/ServiceEditDialog';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [open, setOpen] = useState(false);
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission('plans:write' as Permission);
  
  // Default to first price if available
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
  const selectedPrice = service.prices?.[selectedPriceIndex] || { period: 'monthly', price: 0 };

  const handlePeriodChange = (periodKey: string) => {
    const newIndex = service.prices?.findIndex((price) => price.period === periodKey) || 0;
    if (newIndex >= 0) {
      setSelectedPriceIndex(newIndex);
    }
  };

  // Only show toggle if there are multiple prices
  const showPriceToggle = service.prices && service.prices.length > 1;

  return (
    <article className="relative rounded-2xl bg-white/5 dark:bg-neutral-100/60 backdrop-blur-sm
                    flex flex-col shadow-md shadow-black/10 hover:shadow-lg/20
                    transition-all duration-150 hover:-translate-y-1 p-6 h-full">
      {/* Edit icon (only for admins) */}
      {canEdit && (
        <button 
          onClick={() => setOpen(true)}
          className="absolute top-4 right-4 opacity-50 hover:opacity-100"
          aria-label="Editar serviço"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}

      {/* Content */}
      <h3 className="text-lg font-medium mb-1">{service.name}</h3>
      <p className="text-xs text-muted-foreground mb-4">{service.description}</p>

      {/* Price toggle */}
      {showPriceToggle && service.prices && (
        <PeriodicityToggle
          items={service.prices.map(price => ({
            label: getPeriodLabel(price.period),
            key: price.period,
            price: price.price
          }))}
          value={selectedPrice.period}
          onValueChange={handlePeriodChange}
        />
      )}

      {/* Price display */}
      <div className="mb-2 mt-4">
        <span className="text-4xl font-bold tracking-tight">
          R$ {selectedPrice.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
        <span className="text-xs text-muted-foreground ml-1">
          / {getPeriodLabel(selectedPrice.period).toLowerCase()}
        </span>
        {selectedPrice.installments && (
          <p className="text-xs text-muted-foreground mt-1">
            Em {selectedPrice.installments}x de R$ {(selectedPrice.price / selectedPrice.installments).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        )}
      </div>

      {/* Benefits */}
      {service.benefits && service.benefits.length > 0 && (
        <BenefitsAccordion 
          benefits={service.benefits.map(b => b.name || '')} 
        />
      )}

      {/* Edit dialog */}
      <ServiceEditDialog 
        open={open} 
        onOpenChange={setOpen} 
        service={service} 
      />
    </article>
  );
};

// Helper function to get period label
function getPeriodLabel(period: string): string {
  switch(period) {
    case 'monthly': return 'Mensal';
    case 'quarterly': return 'Trimestral';
    case 'semiannual': return 'Semestral';
    case 'yearly': return 'Anual';
    default: return period;
  }
}
