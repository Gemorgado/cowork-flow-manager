
import { Service } from './types';

// Fixed Station service mock data
export const fixedStationService: Service = {
  id: '3',
  type: 'fixed_station',
  name: 'Estação Fixa',
  description: 'Estação de trabalho fixa e exclusiva',
  prices: [
    {
      id: '9',
      serviceId: '3',
      period: 'monthly',
      price: 650,
    },
    {
      id: '10',
      serviceId: '3',
      period: 'biannual',
      price: 3450,
      discount: 15,
    },
    {
      id: '11',
      serviceId: '3',
      period: 'annual',
      price: 6000,
      discount: 20,
    },
  ],
  benefits: [
    {
      id: '9',
      name: 'Mesa Exclusiva',
      description: 'Mesa reservada e exclusiva',
    },
    {
      id: '10',
      name: 'Endereço Fiscal',
      description: 'Inclui serviço de endereço fiscal',
    },
    {
      id: '11',
      name: '20 Impressões',
      description: '20 impressões por mês',
    },
    {
      id: '12',
      name: 'R$ 200 Cashback',
      description: 'R$ 200 de crédito para uso em salas de reunião',
    },
    {
      id: '13',
      name: '20% Desconto em Salas',
      description: '20% de desconto na reserva de salas',
    },
  ],
};
