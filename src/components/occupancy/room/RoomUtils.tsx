
import { v4 as uuidv4 } from 'uuid';

// Mock clients data with proper UUID format
export const mockClients = [
  {
    id: uuidv4(),
    name: 'Empresa A',
  },
  {
    id: uuidv4(),
    name: 'Empresa B',
  },
  {
    id: uuidv4(),
    name: 'Empresa C',
  },
];
