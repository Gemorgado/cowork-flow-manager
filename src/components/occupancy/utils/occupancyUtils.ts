
import { WorkStation, LocationStatus } from '@/types';
import { toast } from 'sonner';

// Helper function to find a random available workstation
export const findRandomAvailableStation = (workStations: WorkStation[]): WorkStation | null => {
  const availableStations = workStations.filter(
    station => station.status === 'available'
  );
  
  if (availableStations.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableStations.length);
  return availableStations[randomIndex];
};

// Function to allocate flex stations
export const allocateFlexStations = (workStations: WorkStation[], count: number): WorkStation[] => {
  const newStations = [...workStations];
  let allocated = 0;
  
  // Find all available workstations
  const availableStations = newStations.filter(
    station => station.status === 'available'
  );
  
  if (availableStations.length < count) {
    toast.error(`Só foi possível alocar ${availableStations.length} estações flex. Capacidade insuficiente!`);
    count = availableStations.length;
  }
  
  // Randomly select and mark as flex
  while (allocated < count && availableStations.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableStations.length);
    const station = availableStations.splice(randomIndex, 1)[0];
    
    // Find this station in the original array and update it
    const stationIndex = newStations.findIndex(s => s.id === station.id);
    if (stationIndex !== -1) {
      newStations[stationIndex] = { ...newStations[stationIndex], status: 'flex' };
      allocated++;
    }
  }
  
  if (allocated > 0) {
    toast.success(`${allocated} estações flex foram alocadas com sucesso!`);
  }
  
  return newStations;
};

// Function to convert a flex station to fixed
export const convertFlexToFixed = (workStations: WorkStation[], stationId: string, clientId: string): WorkStation[] => {
  const newStations = [...workStations];
  
  // Find the station to convert
  const stationIndex = newStations.findIndex(s => s.id === stationId);
  if (stationIndex === -1 || newStations[stationIndex].status !== 'flex') {
    toast.error("Esta estação não está marcada como Flex!");
    return workStations;
  }
  
  // Mark the station as occupied
  newStations[stationIndex] = { 
    ...newStations[stationIndex], 
    status: 'occupied',
    clientId 
  };
  
  // Find a random available station to mark as flex
  const replacement = findRandomAvailableStation(newStations);
  if (replacement) {
    const replacementIndex = newStations.findIndex(s => s.id === replacement.id);
    newStations[replacementIndex] = { ...newStations[replacementIndex], status: 'flex' };
    toast.success(`Estação ${newStations[stationIndex].number} convertida para Fixa. Uma nova estação Flex foi alocada automaticamente.`);
  } else {
    toast.warning(`Estação ${newStations[stationIndex].number} convertida para Fixa. Não há mais estações disponíveis para alocação Flex.`);
  }
  
  return newStations;
};

// Function to release flex stations
export const releaseFlexStations = (workStations: WorkStation[], count: number): WorkStation[] => {
  const newStations = [...workStations];
  let released = 0;
  
  // Find all flex workstations
  const flexStations = newStations.filter(
    station => station.status === 'flex'
  );
  
  if (flexStations.length < count) {
    toast.warning(`Só é possível liberar ${flexStations.length} estações flex.`);
    count = flexStations.length;
  }
  
  // Randomly select and mark as available
  while (released < count && flexStations.length > 0) {
    const randomIndex = Math.floor(Math.random() * flexStations.length);
    const station = flexStations.splice(randomIndex, 1)[0];
    
    // Find this station in the original array and update it
    const stationIndex = newStations.findIndex(s => s.id === station.id);
    if (stationIndex !== -1) {
      newStations[stationIndex] = { ...newStations[stationIndex], status: 'available', clientId: undefined };
      released++;
    }
  }
  
  if (released > 0) {
    toast.success(`${released} estações flex foram liberadas com sucesso!`);
  }
  
  return newStations;
};
