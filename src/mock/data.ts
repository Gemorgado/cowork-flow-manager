
import { 
  Service, 
  Room, 
  WorkStation, 
  Client, 
  DashboardData, 
  User,
  Permission,
  LocationStatus
} from '../types';

// Mock users
export const users: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@cowork.com',
    phone: '(11) 99999-9999',
    address: 'Rua Exemplo, 123',
    permissions: ['dashboard', 'users', 'clients', 'plans', 'services', 'occupancy'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Operador',
    email: 'operador@cowork.com',
    phone: '(11) 88888-8888',
    address: 'Rua Teste, 456',
    permissions: ['dashboard', 'clients', 'occupancy'],
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15'),
  },
];

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

// Mock rooms
export const generateRooms = (): Room[] => {
  const rooms: Room[] = [];
  
  // Pavimento 1: Salas 101-107
  for (let i = 1; i <= 7; i++) {
    rooms.push({
      id: `r1${i.toString().padStart(2, '0')}`,
      number: `10${i}`,
      floor: 1,
      status: Math.random() > 0.3 ? 'occupied' : 'available',
      clientId: Math.random() > 0.3 ? `client${Math.floor(Math.random() * 5) + 1}` : undefined,
      area: Math.floor(Math.random() * 20) + 15, // 15-35m²
      capacity: Math.floor(Math.random() * 6) + 2, // 2-8 pessoas
    });
  }
  
  // Pavimento 2: Salas 201-219
  for (let i = 1; i <= 19; i++) {
    rooms.push({
      id: `r2${i.toString().padStart(2, '0')}`,
      number: `20${i}`,
      floor: 2,
      status: Math.random() > 0.5 ? 'occupied' : 'available',
      clientId: Math.random() > 0.5 ? `client${Math.floor(Math.random() * 5) + 1}` : undefined,
      area: Math.floor(Math.random() * 25) + 20, // 20-45m²
      capacity: Math.floor(Math.random() * 8) + 3, // 3-11 pessoas
    });
  }
  
  // Pavimento 3: Salas 301-310
  for (let i = 1; i <= 10; i++) {
    rooms.push({
      id: `r3${i.toString().padStart(2, '0')}`,
      number: `30${i}`,
      floor: 3,
      status: Math.random() > 0.7 ? 'occupied' : 'available',
      clientId: Math.random() > 0.7 ? `client${Math.floor(Math.random() * 5) + 1}` : undefined,
      area: Math.floor(Math.random() * 30) + 25, // 25-55m²
      capacity: Math.floor(Math.random() * 10) + 4, // 4-14 pessoas
    });
  }
  
  // Define 2 salas como em manutenção
  const maintenanceIndices = [
    Math.floor(Math.random() * 7),
    Math.floor(Math.random() * 19) + 7,
  ];
  
  maintenanceIndices.forEach((index) => {
    if (rooms[index]) {
      rooms[index].status = 'maintenance';
      rooms[index].clientId = undefined;
    }
  });
  
  // Define 3 salas como reservadas
  const reservedIndices = [
    Math.floor(Math.random() * 7),
    Math.floor(Math.random() * 19) + 7,
    Math.floor(Math.random() * 10) + 26,
  ];
  
  reservedIndices.forEach((index) => {
    if (rooms[index] && rooms[index].status !== 'maintenance') {
      rooms[index].status = 'reserved';
    }
  });
  
  return rooms;
};

// Mock workstations
export const generateWorkStations = (): WorkStation[] => {
  const stations: WorkStation[] = [];
  
  // Pavimento 1: 26 estações (mix de flex e fixas)
  for (let i = 1; i <= 26; i++) {
    stations.push({
      id: `s1${i.toString().padStart(2, '0')}`,
      number: `F1-${i}`,
      floor: 1,
      type: i <= 13 ? 'fixed' : 'flex',
      status: Math.random() > 0.4 ? 'occupied' : 'available',
      clientId: Math.random() > 0.4 ? `client${Math.floor(Math.random() * 5) + 1}` : undefined,
    });
  }
  
  // Pavimento 2: 38 estações (mix de flex e fixas)
  for (let i = 1; i <= 38; i++) {
    stations.push({
      id: `s2${i.toString().padStart(2, '0')}`,
      number: `F2-${i}`,
      floor: 2,
      type: i <= 19 ? 'fixed' : 'flex',
      status: Math.random() > 0.6 ? 'occupied' : 'available',
      clientId: Math.random() > 0.6 ? `client${Math.floor(Math.random() * 5) + 1}` : undefined,
    });
  }
  
  return stations;
};

// Mock clients
export const clients: Client[] = [
  {
    id: 'client1',
    companyName: 'Tech Soluções Ltda',
    tradeName: 'TechSol',
    document: '12.345.678/0001-90',
    email: 'contato@techsol.com.br',
    phone: '(11) 3456-7890',
    address: 'Rua das Tecnologias, 123',
    startDate: new Date('2023-01-15'),
    endDate: new Date('2024-01-15'),
    loyaltyMonths: 12,
    value: 650,
    dueDay: 15,
    services: [
      {
        id: 'cs1',
        clientId: 'client1',
        serviceId: '3',
        service: services[2],
        locationIds: ['s108', 's109'],
        startDate: new Date('2023-01-15'),
        endDate: new Date('2024-01-15'),
        value: 650,
      },
    ],
  },
  {
    id: 'client2',
    companyName: 'Consultoria Financeira Pinheiro S.A.',
    tradeName: 'CFP Consultoria',
    document: '23.456.789/0001-01',
    email: 'contato@cfpconsultoria.com.br',
    phone: '(11) 2345-6789',
    address: 'Av. Paulista, 1000, Sala 501',
    startDate: new Date('2023-02-01'),
    endDate: new Date('2023-08-01'),
    loyaltyMonths: 6,
    value: 3000,
    dueDay: 5,
    services: [
      {
        id: 'cs2',
        clientId: 'client2',
        serviceId: '4',
        service: services[3],
        locationIds: ['r201'],
        startDate: new Date('2023-02-01'),
        endDate: new Date('2023-08-01'),
        value: 3000,
      },
    ],
  },
  {
    id: 'client3',
    companyName: 'Agência Digital Criativa Eireli',
    tradeName: 'Cria Digital',
    document: '34.567.890/0001-12',
    email: 'oi@criadigital.com.br',
    phone: '(11) 9876-5432',
    address: 'Rua dos Designers, 456',
    startDate: new Date('2023-03-10'),
    endDate: new Date('2024-03-10'),
    loyaltyMonths: 12,
    value: 4200,
    dueDay: 10,
    services: [
      {
        id: 'cs3',
        clientId: 'client3',
        serviceId: '2',
        service: services[1],
        locationIds: ['s210', 's211', 's212'],
        startDate: new Date('2023-03-10'),
        endDate: new Date('2024-03-10'),
        value: 4200,
      },
    ],
  },
  {
    id: 'client4',
    companyName: 'Contabilidade Exata ME',
    tradeName: 'Exata Contábil',
    document: '45.678.901/0001-23',
    email: 'contato@exatacontabil.com.br',
    phone: '(11) 5555-4444',
    address: 'Rua dos Contadores, 789',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-09-01'),
    loyaltyMonths: 3,
    value: 150,
    dueDay: 1,
    services: [
      {
        id: 'cs4',
        clientId: 'client4',
        serviceId: '1',
        service: services[0],
        locationIds: [],
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-09-01'),
        value: 150,
      },
    ],
  },
  {
    id: 'client5',
    companyName: 'Escritório de Advocacia Silva & Associados',
    tradeName: 'Silva Advogados',
    document: '56.789.012/0001-34',
    email: 'contato@silvaadv.com.br',
    phone: '(11) 4444-3333',
    address: 'Av. dos Advogados, 1500, Sala 1010',
    startDate: new Date('2023-04-15'),
    endDate: new Date('2024-04-15'),
    loyaltyMonths: 12,
    value: 6000,
    dueDay: 15,
    services: [
      {
        id: 'cs5',
        clientId: 'client5',
        serviceId: '3',
        service: services[2],
        locationIds: ['s201', 's202', 's203', 's204'],
        startDate: new Date('2023-04-15'),
        endDate: new Date('2024-04-15'),
        value: 6000,
      },
    ],
  },
];

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

// Helper function to get random status for map visualization
export const getRandomStatus = (): LocationStatus => {
  const statuses: LocationStatus[] = ['available', 'occupied', 'reserved', 'maintenance'];
  const weights = [0.3, 0.5, 0.1, 0.1]; // 30% available, 50% occupied, 10% reserved, 10% maintenance
  
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return statuses[i];
    }
  }
  
  return 'available';
};
