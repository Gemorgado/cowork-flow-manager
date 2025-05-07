
import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PeriodicityToggle from './catalog/PeriodicityToggle';
import BenefitsAccordion from './catalog/BenefitsAccordion';
import PlanEditDialog from './catalog/PlanEditDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Service, PlanPeriod, PlanPrice, Benefit } from '@/types';
import { PlanDialogData } from './catalog/schemas/planFormSchema';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export const ServiceCard = ({ service, className }: ServiceCardProps) => {
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
  
  // Extract the text from each benefit for the accordion
  const benefitTexts = service.benefits.map(benefit => benefit.name);

  // Convert service data to the format expected by PlanEditDialog
  const planForDialog: PlanDialogData = {
    id: service.id,
    name: service.name,
    description: service.description,
    periodicities: periodicities,
    benefits: service.benefits.map(benefit => ({
      id: benefit.id,
      text: benefit.name
    }))
  };

  // Get service type color
  const getServiceTypeColor = () => {
    switch (service.type) {
      case 'fiscal_address': return 'from-cowork-200 to-cowork-300';
      case 'flex_station': return 'from-cowork-300 to-cowork-400';
      case 'fixed_station': return 'from-cowork-400 to-cowork-500';
      case 'private_room': return 'from-cowork-500 to-cowork-600';
      default: return 'from-cowork-300 to-cowork-400';
    }
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden border-0 bg-gradient-to-br",
        getServiceTypeColor(),
        "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
        "text-white", // Text is white on colored background
        className
      )}
    >
      {canEditPlans && (
        <button
          onClick={() => setIsEditDialogOpen(true)}
          className="absolute top-4 right-4 bg-white/20 rounded-full p-2 opacity-70 hover:opacity-100 z-10 transition-opacity"
          aria-label="Editar plano"
        >
          <Pencil className="h-4 w-4 text-white" />
        </button>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
      
      <CardContent className="p-6 relative z-0">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">{service.name}</h3>
          <p className="text-white/80 line-clamp-2">{service.description}</p>
        </div>
        
        {periodicities.length > 1 && (
          <div className="mb-4">
            <PeriodicityToggle
              items={periodicities}
              value={selectedPeriodicity}
              onValueChange={(value) => setSelectedPeriodicity(value)}
            />
          </div>
        )}
        
        <div className="mb-6">
          <span className="text-3xl font-bold">
            R$ {selectedPrice?.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-white/90"> / {formatPeriodLabel(selectedPrice?.period || 'monthly').toLowerCase()}</span>
          {selectedPrice?.installments && (
            <p className="text-xs text-white/80 mt-1">
              Em {selectedPrice.installments}x de R$ {(selectedPrice.price / selectedPrice.installments).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>
        
        <div className="mt-auto">
          <BenefitsAccordion benefits={benefitTexts} />
        </div>
        
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
