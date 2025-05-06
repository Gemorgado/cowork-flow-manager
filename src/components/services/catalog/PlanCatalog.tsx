
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import PlanCard from './PlanCard';
import { Heading } from '@/components/ui/heading';

// Mock data - in a real application, this would come from an API
const mockPlans = [
  {
    id: "endereco-fiscal",
    name: "Endereço Fiscal",
    description: "Endereço comercial para registro de empresa",
    periodicities: [
      { label: "Mensal", key: "monthly", price: 150 },
      { label: "Semestral", key: "semi", price: 360, times: 2 },
      { label: "Anual", key: "yearly", price: 400, times: 3 }
    ],
    benefits: [
      "Front-desk e secretariado básico",
      "Gestão de correspondência",
      "Registro às Juntas & Receita",
      "Suporte contábil"
    ]
  },
  {
    id: "estacao-fixa",
    name: "Estação Fixa",
    description: "Posição de trabalho dedicada exclusiva",
    periodicities: [
      { label: "Mensal", key: "monthly", price: 600 },
      { label: "Semestral", key: "semi", price: 3400, times: 2 },
      { label: "Anual", key: "yearly", price: 6000, times: 3 }
    ],
    benefits: [
      "Mesa dedicada 24/7",
      "Armário com chave",
      "Internet fibra 500Mb",
      "Café e água à vontade",
      "2 horas de sala de reunião/mês"
    ]
  },
  {
    id: "estacao-flex",
    name: "Estação Flex",
    description: "Posição compartilhada por hora ou diária",
    periodicities: [
      { label: "Diária", key: "daily", price: 60 },
      { label: "Semanal", key: "weekly", price: 200 },
      { label: "Mensal", key: "monthly", price: 350 }
    ],
    benefits: [
      "Posição em área compartilhada",
      "Internet fibra 500Mb",
      "Café e água à vontade",
      "1 hora de sala de reunião/mês"
    ]
  },
  {
    id: "sala-privativa",
    name: "Sala Privativa",
    description: "Ambiente exclusivo para sua empresa",
    periodicities: [
      { label: "Mensal", key: "monthly", price: 1800 },
      { label: "Semestral", key: "semi", price: 9600, times: 2 },
      { label: "Anual", key: "yearly", price: 18000, times: 3 }
    ],
    benefits: [
      "Sala fechada e exclusiva",
      "Até 4 posições de trabalho",
      "Climatizado e mobiliado",
      "Internet fibra 500Mb",
      "4 horas de sala de reunião/mês",
      "Personalização permitida"
    ]
  }
];

const PlanCatalog = () => {
  // In a real application, this would fetch from an API
  const { data: plans = mockPlans } = useQuery({
    queryKey: ['plans'],
    queryFn: () => Promise.resolve(mockPlans),
    // In production with an actual API:
    // queryFn: () => fetch('/api/plans').then(r => r.json()),
  });

  return (
    <section className="container mx-auto py-10">
      <Heading 
        title="Planos & Serviços" 
        description="Conheça nossos planos e benefícios" 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {plans.map(plan => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
};

export default PlanCatalog;
