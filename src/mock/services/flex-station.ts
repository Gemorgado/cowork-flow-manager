
import { Service } from './types';

// Flex Station service mock data
export const flexStationService: Service = {
  id: '2',
  type: 'flex_station',
  name: 'Estação Flex',
  description: 'Estação de trabalho flexível (individual, intransferível)',
  prices: [
    {
      id: '4',
      serviceId: '2',
      period: 'daily',
      price: 50,
    },
    {
      id: '5',
      serviceId: '2',
      period: 'weekly',
      price: 150,
    },
    {
      id: '6',
      serviceId: '2',
      period: 'monthly',
      price: 450,
    },
    {
      id: '7',
      serviceId: '2',
      period: 'biannual',
      price: 2400,
      discount: 15,
    },
    {
      id: '8',
      serviceId: '2',
      period: 'annual',
      price: 4200,
      discount: 20,
    },
  ],
  benefits: [
    {
      id: '5',
      name: 'Uso Ilimitado',
      description: 'Acesso ilimitado durante o horário comercial',
    },
    {
      id: '6',
      name: '20 Impressões P&B',
      description: '20 impressões em preto e branco por mês',
    },
    {
      id: '7',
      name: 'R$ 200 Cashback',
      description: 'R$ 200 de crédito para uso em salas de reunião',
    },
    {
      id: '8',
      name: '20% Desconto em Salas',
      description: '20% de desconto na reserva de salas',
    },
  ],
};
