
import { User } from '@/types';

export const users: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@example.com',
    phone: '(11) 99999-9999',
    address: 'Rua A, 123 - São Paulo, SP',
    password: 'senha123', // Added password field
    permissions: ['dashboard', 'users', 'clients', 'services', 'occupancy'],
    createdAt: new Date('2023-01-15T10:30:00'),
    updatedAt: new Date('2023-01-15T10:30:00'),
  },
  {
    id: '2',
    name: 'Maria Souza',
    email: 'maria.souza@example.com',
    phone: '(11) 98888-8888',
    address: 'Rua B, 456 - São Paulo, SP',
    password: 'senha123', // Added password field
    permissions: ['dashboard', 'clients'],
    createdAt: new Date('2023-02-20T14:45:00'),
    updatedAt: new Date('2023-02-20T14:45:00'),
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@example.com',
    phone: '(11) 97777-7777',
    address: 'Rua C, 789 - São Paulo, SP',
    password: 'senha123', // Added password field
    permissions: ['dashboard', 'services'],
    createdAt: new Date('2023-03-10T09:15:00'),
    updatedAt: new Date('2023-03-10T09:15:00'),
  },
];
