
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Service, PlanPrice } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(service.prices[0]?.period || 'monthly');
  const [showBenefits, setShowBenefits] = useState(false);
  
  // Get the selected price based on the period
  const selectedPrice = service.prices.find(price => price.period === selectedPeriod);
  
  // Handle toggle benefits
  const toggleBenefits = () => {
    setShowBenefits(!showBenefits);
  };
  
  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };
  
  // Get translated period name
  const getPeriodName = (period: string) => {
    const periods: Record<string, string> = {
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal',
      biannual: 'Semestral',
      annual: 'Anual',
    };
    
    return periods[period] || period;
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
          <div className="flex justify-center mb-2">
            {service.prices.map((price) => (
              <Button
                key={price.id}
                variant={selectedPeriod === price.period ? 'default' : 'outline'}
                size="sm"
                className="mx-1 text-xs"
                onClick={() => setSelectedPeriod(price.period)}
              >
                {getPeriodName(price.period)}
              </Button>
            ))}
          </div>
          
          {selectedPrice && (
            <div className="text-center mt-4">
              <div className="text-3xl font-bold">
                {formatPrice(selectedPrice.price)}
                {selectedPrice.period !== 'daily' && selectedPrice.period !== 'weekly' && (
                  <span className="text-sm font-normal text-muted-foreground">/{getPeriodName(selectedPrice.period).toLowerCase()}</span>
                )}
              </div>
              
              {selectedPrice.discount && (
                <Badge variant="secondary" className="mt-2">
                  {selectedPrice.discount}% de desconto
                </Badge>
              )}
              
              {selectedPrice.installments && (
                <div className="text-sm text-muted-foreground mt-2">
                  Parcele em até {selectedPrice.installments}x
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center justify-between" 
            onClick={toggleBenefits}
          >
            <span>Benefícios inclusos</span>
            {showBenefits ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          
          {showBenefits && (
            <ul className="mt-3 space-y-2">
              {service.benefits.map((benefit) => (
                <li key={benefit.id} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium">{benefit.name}</span>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Contratar</Button>
      </CardFooter>
    </Card>
  );
};
