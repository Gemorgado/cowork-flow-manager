
import { Service } from './types';

// Private Room service mock data
export const privateRoomService: Service = {
  id: '4',
  type: 'private_room',
  name: 'Sala Privativa',
  description: 'Sala privativa exclusiva',
  prices: [
    {
      id: '12',
      serviceId: '4',
      period: 'monthly',
      price: 3000,
    },
  ],
  benefits: [
    {
      id: '14',
      name: 'Endereço Fiscal',
      description: 'Inclui serviço de endereço fiscal',
    },
    {
      id: '15',
      name: 'IPTU Incluso',
      description: 'IPTU incluído no valor',
    },
    {
      id: '16',
      name: 'Utilidades',
      description: 'Água, luz e internet inclusos',
    },
    {
      id: '17',
      name: 'Segurança 24h',
      description: 'Segurança 24 horas',
    },
    {
      id: '18',
      name: 'Front Desk',
      description: 'Serviço de recepção',
    },
    {
      id: '19',
      name: '20 Impressões',
      description: '20 impressões por mês',
    },
    {
      id: '20',
      name: 'R$ 300 Bônus',
      description: 'R$ 300 de crédito para uso em salas (exceto auditório)',
    },
    {
      id: '21',
      name: '20% após crédito',
      description: '20% de desconto após utilização do crédito',
    },
  ],
};
