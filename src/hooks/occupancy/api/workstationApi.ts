
import { supabase } from '@/integrations/supabase/client';
import { WorkStation, LocationStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';

type WorkstationRow = Database['public']['Tables']['workstations']['Row'];
type WorkstationInsert = Database['public']['Tables']['workstations']['Insert'];
type WorkstationUpdate = Database['public']['Tables']['workstations']['Update'];

/**
 * Transforms a Supabase workstation row into a WorkStation type
 */
const transformWorkstationRow = (row: WorkstationRow): WorkStation => ({
  id: row.id,
  number: row.number,
  floor: parseInt(row.floor) as WorkStation['floor'],
  type: row.type as 'flex' | 'fixed',
  status: row.status,
  clientId: row.client_id || undefined
});

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

    return data?.map(transformWorkstationRow) || [];
  } catch (error: any) {
    console.error('Error fetching workstations:', error);
    toast({
      title: 'Error',
      description: `Failed to fetch workstations: ${error.message || 'Unknown error'}`,
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
    if (!stationId) {
      throw new Error('Station ID is required');
    }

    const updateData: WorkstationUpdate = { status: 'flex' };
    const { error } = await supabase
      .from('workstations')
      .update(updateData)
      .eq('id', stationId);

    if (error) {
      throw error;
    }
    return true;
  } catch (error: any) {
    console.error('Error allocating flex station:', error);
    toast({
      title: 'Error',
      description: `Failed to allocate flex station: ${error.message || 'Unknown error'}`,
      variant: 'destructive',
    });
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
    if (!stationId || !clientId) {
      throw new Error('Station ID and Client ID are both required');
    }

    const updateData: WorkstationUpdate = {
      type: 'fixed',
      status: 'occupied',
      client_id: clientId
    };

    const { error } = await supabase
      .from('workstations')
      .update(updateData)
      .eq('id', stationId);

    if (error) {
      throw error;
    }
    
    toast({
      title: 'Success',
      description: 'Workstation has been converted to fixed and assigned',
    });
    
    return true;
  } catch (error: any) {
    console.error('Error converting flex to fixed:', error);
    toast({
      title: 'Error',
      description: `Failed to convert workstation: ${error.message || 'Unknown error'}`,
      variant: 'destructive',
    });
    return false;
  }
}

/**
 * Updates a workstation's status
 */
export async function updateStationStatus(
  stationId: string, 
  status: LocationStatus
): Promise<boolean> {
  try {
    if (!stationId) {
      throw new Error('Station ID is required');
    }

    const updateData: WorkstationUpdate = { status };
    const { error } = await supabase
      .from('workstations')
      .update(updateData)
      .eq('id', stationId);

    if (error) {
      throw error;
    }
    return true;
  } catch (error: any) {
    console.error('Error updating station status:', error);
    toast({
      title: 'Error',
      description: `Failed to update station status: ${error.message || 'Unknown error'}`,
      variant: 'destructive',
    });
    return false;
  }
}

/**
 * Updates a workstation's status to flex
 * @deprecated Use updateStationStatus instead
 */
export async function updateStationToFlex(stationId: string): Promise<boolean> {
  return updateStationStatus(stationId, 'flex');
}
