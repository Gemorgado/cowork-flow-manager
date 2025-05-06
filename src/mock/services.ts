
import { Service } from '../types';

// Mock services
export const services: Service[] = [
  {
    id: '1',
    type: 'fiscal_address',
    name: 'Endereço Fiscal',
    description: 'Endereço comercial para registro de empresa',
    prices: [
      {
        id: '1',
        serviceId: '1',
        period: 'monthly',
        price: 150,
        installments: 12,
      },
      {
        id: '2',
        serviceId: '1',
        period: 'biannual',
        price: 360,
        installments: 2,
      },
      {
        id: '3',
        serviceId: '1',
        period: 'annual',
        price: 400,
        installments: 3,
      },
    ],
    benefits: [
      {
        id: '1',
        name: 'Front Desk',
        description: 'Recepção de visitantes e correspondências',
      },
      {
        id: '2',
        name: 'Correspondência',
        description: 'Recebimento e guarda de correspondências',
      },
      {
        id: '3',
        name: 'Registro CNPJ',
        description: 'Endereço para registro de CNPJ',
      },
      {
        id: '4',
        name: 'Suporte Contábil',
        description: 'Orientação básica para questões contábeis',
      },
    ],
  },
  {
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
  },
  {
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
  },
  {
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
  },
];
