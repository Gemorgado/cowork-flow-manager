
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heading } from '@/components/ui/heading';
import { Service } from '@/types';
import { ServiceCard } from '@/components/services/ServiceCard';

interface PlanCatalogProps {
  services: Service[];
}

const PlanCatalog: React.FC<PlanCatalogProps> = ({ services }) => {
  return (
    <section className="container mx-auto py-12">
      <header className="mb-10">
        <Heading 
          title="Planos & Serviços" 
          description="Conheça nossos planos e benefícios" 
        />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
};

export default PlanCatalog;
