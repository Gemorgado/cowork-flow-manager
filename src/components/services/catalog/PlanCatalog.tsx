
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heading } from '@/components/ui/heading';
import { ServiceCard } from '@/components/services/ServiceCard';
import { Service } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PlanCatalogProps {
  services: Service[];
}

const PlanCatalog: React.FC<PlanCatalogProps> = ({ services }) => {
  // Separar serviços por tipo para exibir em abas
  const fiscalServices = services.filter(s => s.type === 'fiscal_address');
  const flexServices = services.filter(s => s.type === 'flex_station');
  const fixedServices = services.filter(s => s.type === 'fixed_station');
  const roomServices = services.filter(s => s.type === 'private_room');

  return (
    <section className="container mx-auto py-12">
      <header className="mb-8">
        <Heading 
          title="Planos & Serviços" 
          description="Conheça nossos planos e benefícios" 
        />
      </header>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8 bg-cowork-50/30 dark:bg-cowork-950/30 border border-cowork-100 dark:border-cowork-800">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="fiscal">Endereço Fiscal</TabsTrigger>
          <TabsTrigger value="flex">Estações Flex</TabsTrigger>
          <TabsTrigger value="fixed">Estações Fixas</TabsTrigger>
          <TabsTrigger value="room">Salas Privativas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="focus-visible:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 horse-layout">
            {services.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service}
                className={`transform ${index % 2 === 0 ? 'md:translate-y-4' : ''}`}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fiscal" className="focus-visible:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 horse-layout">
            {fiscalServices.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service}
                className={`transform ${index % 2 === 0 ? 'md:translate-y-4' : ''}`}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flex" className="focus-visible:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 horse-layout">
            {flexServices.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service}
                className={`transform ${index % 2 === 0 ? 'md:translate-y-4' : ''}`}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fixed" className="focus-visible:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 horse-layout">
            {fixedServices.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service}
                className={`transform ${index % 2 === 0 ? 'md:translate-y-4' : ''}`}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="room" className="focus-visible:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 horse-layout">
            {roomServices.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service}
                className={`transform ${index % 2 === 0 ? 'md:translate-y-4' : ''}`}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default PlanCatalog;
