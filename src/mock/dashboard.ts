
import { DashboardData } from '../types';

// Mock dashboard data
export const dashboardData: DashboardData = {
  clientsByService: [
    { service: 'Endereço Fiscal', count: 8 },
    { service: 'Estação Flex', count: 12 },
    { service: 'Estação Fixa', count: 15 },
    { service: 'Sala Privativa', count: 7 },
  ],
  occupancyRates: {
    rooms: {
      total: 36,
      occupied: 27,
      rate: 75,
    },
    fixedStations: {
      total: 32,
      occupied: 23,
      rate: 72,
    },
    flexStations: {
      total: 32,
      occupied: 19,
      rate: 59,
    },
    overall: {
      total: 100,
      occupied: 69,
      rate: 69,
    },
  },
  fiscalAddressCount: 22,
  expiringContracts: [
    {
      id: 'exp1',
      clientId: 'client4',
      clientName: 'Exata Contábil',
      serviceName: 'Endereço Fiscal',
      endDate: new Date('2023-09-01'),
      daysRemaining: 30,
    },
    {
      id: 'exp2',
      clientId: 'client2',
      clientName: 'CFP Consultoria',
      serviceName: 'Sala Privativa',
      endDate: new Date('2023-08-01'),
      daysRemaining: 14,
    },
    {
      id: 'exp3',
      clientId: 'client1',
      clientName: 'TechSol',
      serviceName: 'Estação Fixa',
      endDate: new Date('2024-01-15'),
      daysRemaining: 78,
    },
  ],
};
