
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
