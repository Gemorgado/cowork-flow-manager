
import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PeriodicityToggle from './catalog/PeriodicityToggle';
import BenefitsAccordion from './catalog/BenefitsAccordion';
import PlanEditDialog from './catalog/PlanEditDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Service, PlanPeriod, PlanPrice, Benefit } from '@/types';
import { PlanDialogData } from './catalog/schemas/planFormSchema';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const { hasPermission } = useAuth();
  const canEditPlans = hasPermission('plans');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Convert the prices to the format expected by PeriodicityToggle
  const periodicities = service.prices.map(price => ({
    key: price.period,
    label: formatPeriodLabel(price.period),
    price: price.price,
    times: price.installments
  }));
  
  const [selectedPeriodicity, setSelectedPeriodicity] = useState(periodicities[0]?.key || '');
  
  // Find the selected price details
  const selectedPrice = service.prices.find(p => p.period === selectedPeriodicity) || service.prices[0];
  
  // Extract benefit descriptions
  const benefitDescriptions = service.benefits.map(benefit => benefit.name);

  // Convert service data to the format expected by PlanEditDialog
  const planForDialog: PlanDialogData = {
    id: service.id,
    name: service.name,
    description: service.description,
    periodicities: periodicities,
    benefits: benefitDescriptions
  };

  return (
    <Card className="relative rounded-2xl bg-white/5 dark:bg-neutral-100/60 backdrop-blur-sm shadow-md shadow-black/10 p-6 flex flex-col gap-4 transition hover:shadow-lg/20 hover:-translate-y-1">
      {canEditPlans && (
        <button
          onClick={() => setIsEditDialogOpen(true)}
          className="absolute top-4 right-4 opacity-40 hover:opacity-90"
          aria-label="Editar plano"
          tabIndex={0}
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
      
      <CardHeader className="p-0">
        <CardTitle className="text-lg font-medium">{service.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col gap-4">
        {periodicities.length > 1 && (
          <PeriodicityToggle
            items={periodicities}
            value={selectedPeriodicity}
            onValueChange={(value) => setSelectedPeriodicity(value)}
          />
        )}
        
        <div>
          <span className="text-3xl font-bold tracking-tight">
            R$ {selectedPrice?.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs"> / {formatPeriodLabel(selectedPrice?.period || 'monthly').toLowerCase()}</span>
          {selectedPrice?.installments && (
            <p className="text-xs text-muted-foreground mt-1">
              Em {selectedPrice.installments}x de R$ {(selectedPrice.price / selectedPrice.installments).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>
        
        <BenefitsAccordion benefits={benefitDescriptions} />
        
        {canEditPlans && (
          <PlanEditDialog 
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            plan={planForDialog}
          />
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to format period labels
function formatPeriodLabel(period: PlanPeriod): string {
  const labels: Record<PlanPeriod, string> = {
    daily: 'Diário',
    weekly: 'Semanal',
    monthly: 'Mensal',
    biannual: 'Semestral',
    annual: 'Anual'
  };
  
  return labels[period] || period;
}
