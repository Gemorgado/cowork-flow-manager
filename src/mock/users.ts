
import { User } from '../types';

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
