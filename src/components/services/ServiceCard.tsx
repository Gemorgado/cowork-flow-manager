
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Service, PlanPeriod } from '@/types';
import { Pencil } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ServiceEditDialog from './catalog/ServiceEditDialog';

interface ServiceCardProps {
  service: Service;
}

const periodLabels: Record<PlanPeriod, string> = {
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
  biannual: 'Semestral',
  annual: 'Anual'
};

export function ServiceCard({ service }: ServiceCardProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    service.prices.length > 0 ? service.prices[0].period : 'monthly'
  );
  
  const { hasPermission } = useAuth();
  const canEdit = hasPermission('services');
  
  // Find the selected price based on period
  const selectedPrice = service.prices.find(p => p.period === selectedPeriod) || service.prices[0];
  
  // Format price for display
  const formattedPrice = selectedPrice
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedPrice.price)
    : 'Consulte';
    
  // Map benefit names
  const benefitList = service.benefits.map(b => b.name);

  return (
    <Card className="relative rounded-2xl bg-white/5 dark:bg-neutral-100/60 backdrop-blur-sm border-none shadow-md shadow-black/10 hover:shadow-lg/20 hover:-translate-y-1 transition overflow-hidden">
      {canEdit && (
        <button
          onClick={() => setOpenEdit(true)}
          className="absolute top-4 right-4 opacity-40 hover:opacity-90 z-10"
          aria-label="Editar serviço"
          tabIndex={0}
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{service.name}</CardTitle>
        <CardDescription className="line-clamp-2">{service.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {service.prices.length > 0 && (
          <div className="space-y-2">
            {service.prices.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {service.prices.map(price => (
                  <button
                    key={price.id}
                    onClick={() => setSelectedPeriod(price.period)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      selectedPeriod === price.period
                        ? 'bg-primary text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {periodLabels[price.period]}
                  </button>
                ))}
              </div>
            )}
            
            <div>
              <div className="text-2xl font-bold">{formattedPrice}</div>
              {selectedPrice && (
                <div className="text-xs text-muted-foreground">
                  {periodLabels[selectedPrice.period]}
                  {selectedPrice.installments && (
                    <span className="ml-1">
                      em até {selectedPrice.installments}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedPrice.price / selectedPrice.installments)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {benefitList.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Benefícios inclusos</h4>
            <ul className="text-xs space-y-1 list-disc list-inside">
              {benefitList.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      {canEdit && openEdit && (
        <ServiceEditDialog 
          open={openEdit} 
          onOpenChange={setOpenEdit} 
          service={service} 
        />
      )}
    </Card>
  );
}
