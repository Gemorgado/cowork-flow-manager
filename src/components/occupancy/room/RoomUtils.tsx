
import { Room } from '@/types';

// Function to get client info for tooltip
export const getClientInfo = (clientId?: string): string => {
  if (!clientId) return "Nenhum cliente";
  // In a real app, we would fetch client details here
  return `Cliente #${clientId.replace('client', '')}`;
};

// Mock clients data - this would come from an API in a real app
export const mockClients = [
  { id: 'client1', name: 'Empresa A' },
  { id: 'client2', name: 'Empresa B' },
  { id: 'client3', name: 'Empresa C' }
];

// Function to arrange rooms in a specific layout based on floor
export const getFloorLayout = (currentFloor: string): string => {
  const floorNumber = parseInt(currentFloor);
  
  switch(floorNumber) {
    case 1:
      // Pavimento 1: Salas 101-107 em linha (7 salas)
      return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-7';
    case 2:
      // Pavimento 2: Salas 201-219 em forma de U (19 salas)
      return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-y-8';
    case 3:
      // Pavimento 3: Salas 301-310 (10 salas)
      return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-6';
    default:
      return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  }
};
