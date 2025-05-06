
import React from 'react';
import { ServiceCard } from '@/components/services/ServiceCard';
import { services } from '@/mock/services';
import { Heading } from '@/components/ui/heading';

const Services = () => {
  return (
    <div className="container mx-auto py-8">
      <Heading title="Planos e Serviços" description="Conheça nossos planos e serviços disponíveis" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default Services;
