import { WorkStation } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { 
  allocateFlexStation,
  convertFlexToFixed as convertFlexToFixedApi,
  updateStationToFlex
} from '../api/workstationApi';

/**
 * Handler for allocating multiple flex stations
 */
export async function allocateFlexStations(
  workStations: WorkStation[],
  quantity: number,
  onSuccess: () => void
): Promise<boolean> {
  try {
    // Validate if there are enough available stations
    const availableStations = workStations.filter(station => station.status === 'available');
    
    if (availableStations.length < quantity) {
      throw new Error(`Só existem ${availableStations.length} estações disponíveis`);
    }
    
    // Randomly select stations to convert to FLEX
    const stationsToUpdate = availableStations.slice(0, quantity);
    
    // Update each station in parallel
    const results = await Promise.all(
      stationsToUpdate.map(station => allocateFlexStation(station.id))
    );
    
    // Check if all updates were successful
    if (results.every(result => result === true)) {
      toast({
        title: 'Sucesso',
        description: `${quantity} estações alocadas como FLEX`,
      });
      onSuccess();
      return true;
    } else {
      throw new Error('Algumas atualizações falharam');
    }
  } catch (error: any) {
    console.error('Error allocating flex stations:', error);
    toast({
      title: 'Erro',
      description: error.message || 'Falha ao alocar estações FLEX',
      variant: 'destructive',
    });
    return false;
  }
}

/**
 * Handler for converting a flex station to a fixed one
 */
export async function handleConvertFlexToFixed(
  workStations: WorkStation[],
  stationId: string,
  clientId: string,
  onSuccess: () => void
): Promise<boolean> {
  try {
    // Get a reference to the station being converted
    const stationToConvert = workStations.find(s => s.id === stationId);
    
    if (!stationToConvert || stationToConvert.status !== 'flex') {
      throw new Error('Estação não está marcada como FLEX');
    }
    
    // Convert the flex station to fixed
    const converted = await convertFlexToFixedApi(stationId, clientId);
    if (!converted) {
      throw new Error('Falha ao converter estação');
    }
    
    // Find a free workstation to convert to FLEX (to maintain the total number of FLEX stations)
    const availableStation = workStations.find(s => s.status === 'available');
    
    if (availableStation) {
      await updateStationToFlex(availableStation.id);
    }

    toast({
      title: 'Sucesso',
      description: 'Estação FLEX convertida para FIXA',
    });
    
    onSuccess();
    return true;
  } catch (error: any) {
    console.error('Error converting flex to fixed:', error);
    toast({
      title: 'Erro',
      description: error.message || 'Falha ao converter estação FLEX',
      variant: 'destructive',
    });
    return false;
  }
}
