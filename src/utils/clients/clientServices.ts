
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { ClientService } from '@/types';

// Add client services to Supabase
export const addClientServices = async (
  clientId: string, 
  services: Pick<ClientService, 'serviceId' | 'startDate' | 'endDate' | 'value'>[]
): Promise<boolean> => {
  try {
    if (!services || services.length === 0) {
      return true;
    }
    
    const clientServices = services.map(service => ({
      client_id: clientId,
      service_id: service.serviceId,
      start_date: service.startDate.toISOString(),
      end_date: service.endDate.toISOString(),
      value: service.value
    }));

    const { error } = await supabase
      .from('client_services')
      .insert(clientServices);

    if (error) {
      console.error('Error adding client services:', error);
      toast.error('Erro ao adicionar serviços do cliente');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error adding client services:', error);
    toast.error('Erro inesperado ao adicionar serviços do cliente');
    return false;
  }
};

// Update client services in Supabase
export const updateClientServices = async (
  clientId: string,
  services: Pick<ClientService, 'serviceId' | 'startDate' | 'endDate' | 'value'>[]
): Promise<boolean> => {
  try {
    if (!services || services.length === 0) {
      return true;
    }
    
    // First delete existing services
    const { error: deleteError } = await supabase
      .from('client_services')
      .delete()
      .eq('client_id', clientId);

    if (deleteError) {
      console.error('Error deleting existing client services:', deleteError);
      toast.error('Erro ao atualizar serviços do cliente');
      return false;
    }

    // Then add new services
    return await addClientServices(clientId, services);
  } catch (error) {
    console.error('Unexpected error updating client services:', error);
    toast.error('Erro inesperado ao atualizar serviços do cliente');
    return false;
  }
};

// Fetch client services with service details
export const fetchClientServices = async (clientId: string) => {
  try {
    const { data: dbClientServices, error: servicesError } = await supabase
      .from('client_services')
      .select(`
        *,
        service:service_id (
          id, name, description, type
        )
      `)
      .eq('client_id', clientId);

    if (servicesError) {
      console.error('Error fetching client services:', servicesError);
      toast.error('Erro ao carregar serviços do cliente');
      return [];
    }

    return dbClientServices || [];
  } catch (error) {
    console.error('Unexpected error fetching client services:', error);
    toast.error('Erro inesperado ao carregar serviços do cliente');
    return [];
  }
};
