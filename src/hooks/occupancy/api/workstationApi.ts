
import { supabase } from '@/integrations/supabase/client';
import { WorkStation } from '@/types';
import { toast } from '@/components/ui/use-toast';

/**
 * Fetches all workstations from Supabase
 */
export async function fetchWorkstations(): Promise<WorkStation[]> {
  try {
    const { data, error } = await supabase
      .from('workstations')
      .select('*');

    if (error) {
      throw error;
    }

    return data?.map(station => ({
      id: station.id,
      number: station.number,
      floor: parseInt(station.floor) as any,
      type: station.type as 'flex' | 'fixed',
      status: station.status,
      clientId: station.client_id || undefined
    })) || [];
  } catch (error: any) {
    console.error('Error fetching workstations:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch workstations data',
      variant: 'destructive',
    });
    return [];
  }
}

/**
 * Updates a workstation's status to flex
 */
export async function allocateFlexStation(stationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('workstations')
      .update({ status: 'flex' })
      .eq('id', stationId);

    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error allocating flex station:', error);
    return false;
  }
}

/**
 * Converts a flex station to a fixed station and assigns it to a client
 */
export async function convertFlexToFixed(
  stationId: string, 
  clientId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('workstations')
      .update({
        type: 'fixed',
        status: 'occupied',
        client_id: clientId
      })
      .eq('id', stationId);

    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error converting flex to fixed:', error);
    return false;
  }
}

/**
 * Updates a workstation's status to flex
 */
export async function updateStationToFlex(stationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('workstations')
      .update({ status: 'flex' })
      .eq('id', stationId);

    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error updating station to flex:', error);
    return false;
  }
}
