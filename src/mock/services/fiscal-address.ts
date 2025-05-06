
import { Service } from './types';

// Fiscal Address service mock data
export const fiscalAddressService: Service = {
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
};
