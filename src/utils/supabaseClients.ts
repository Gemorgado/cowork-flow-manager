
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientService, Service } from '@/types';
import { toast } from 'sonner';

export interface ClientFromDB {
  id: string;
  company_name: string;
  trade_name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  start_date: string;
  end_date: string;
  loyalty_months: number;
  value: number;
  due_day: number;
  created_at?: string;
  updated_at?: string;
}

export interface ClientServiceFromDB {
  id: string;
  client_id: string;
  service_id: string;
  start_date: string;
  end_date: string;
  value: number;
  service?: {
    id: string;
    name: string;
    description: string;
    type: string;
  };
}

// Function to convert DB client format to app Client format
const mapClientFromDB = (dbClient: ClientFromDB, clientServices: ClientServiceFromDB[] = []): Client => {
  return {
    id: dbClient.id,
    companyName: dbClient.company_name,
    tradeName: dbClient.trade_name,
    document: dbClient.document,
    email: dbClient.email,
    phone: dbClient.phone,
    address: dbClient.address,
    startDate: new Date(dbClient.start_date),
    endDate: new Date(dbClient.end_date),
    loyaltyMonths: dbClient.loyalty_months,
    value: dbClient.value,
    dueDay: dbClient.due_day,
    services: clientServices.map(cs => ({
      id: cs.id,
      clientId: cs.client_id,
      serviceId: cs.service_id,
      service: cs.service ? {
        id: cs.service.id,
        name: cs.service.name,
        description: cs.service.description,
        type: cs.service.type as any,
        benefits: [],
        prices: []
      } : {} as Service,
      locationIds: [], // We'll need to fetch these separately if needed
      startDate: new Date(cs.start_date),
      endDate: new Date(cs.end_date),
      value: cs.value
    }))
  };
};

// Function to map app Client format to DB format
const mapClientToDB = (client: Client): ClientFromDB => {
  return {
    id: client.id,
    company_name: client.companyName,
    trade_name: client.tradeName,
    document: client.document,
    email: client.email,
    phone: client.phone,
    address: client.address,
    start_date: client.startDate.toISOString(),
    end_date: client.endDate.toISOString(),
    loyalty_months: client.loyaltyMonths,
    value: client.value,
    due_day: client.dueDay
  };
};

// Fetch all clients from Supabase
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data: dbClients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .order('company_name');

    if (clientsError) {
      console.error('Error fetching clients:', clientsError);
      toast.error('Erro ao carregar clientes');
      return [];
    }

    // Fetch client services with service details
    const { data: dbClientServices, error: servicesError } = await supabase
      .from('client_services')
      .select(`
        *,
        service:service_id (
          id, name, description, type
        )
      `);

    if (servicesError) {
      console.error('Error fetching client services:', servicesError);
      toast.error('Erro ao carregar serviços dos clientes');
      return [];
    }

    // Group client services by client_id
    const clientServicesMap = dbClientServices?.reduce<Record<string, ClientServiceFromDB[]>>((acc, cs) => {
      if (!acc[cs.client_id]) {
        acc[cs.client_id] = [];
      }
      acc[cs.client_id].push(cs as ClientServiceFromDB);
      return acc;
    }, {});

    // Map DB clients to app format
    return (dbClients || []).map(dbClient => 
      mapClientFromDB(dbClient as ClientFromDB, clientServicesMap?.[dbClient.id] || [])
    );
  } catch (error) {
    console.error('Unexpected error fetching clients:', error);
    toast.error('Erro inesperado ao carregar clientes');
    return [];
  }
};

// Add a new client to Supabase
export const addClient = async (client: Omit<Client, 'id'>): Promise<Client | null> => {
  try {
    // Prepare client data for DB
    const dbClient = mapClientToDB({ ...client, id: '' });
    delete (dbClient as any).id; // Remove empty ID for auto-generation

    // Insert client
    const { data: insertedClient, error: clientError } = await supabase
      .from('clients')
      .insert(dbClient)
      .select()
      .single();

    if (clientError) {
      console.error('Error adding client:', clientError);
      toast.error('Erro ao adicionar cliente');
      return null;
    }

    // If client has services, add them
    if (client.services && client.services.length > 0) {
      const clientServices = client.services.map(service => ({
        client_id: insertedClient.id,
        service_id: service.serviceId,
        start_date: service.startDate.toISOString(),
        end_date: service.endDate.toISOString(),
        value: service.value
      }));

      const { error: servicesError } = await supabase
        .from('client_services')
        .insert(clientServices);

      if (servicesError) {
        console.error('Error adding client services:', servicesError);
        toast.error('Erro ao adicionar serviços do cliente');
      }
    }

    // Return the newly created client
    const newClient = await fetchClientById(insertedClient.id);
    return newClient;
  } catch (error) {
    console.error('Unexpected error adding client:', error);
    toast.error('Erro inesperado ao adicionar cliente');
    return null;
  }
};

// Fetch client by ID
export const fetchClientById = async (clientId: string): Promise<Client | null> => {
  try {
    const { data: dbClient, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (clientError) {
      console.error('Error fetching client:', clientError);
      toast.error('Erro ao carregar cliente');
      return null;
    }

    // Fetch client services
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
      return null;
    }

    return mapClientFromDB(dbClient as ClientFromDB, dbClientServices as ClientServiceFromDB[]);
  } catch (error) {
    console.error('Unexpected error fetching client by ID:', error);
    toast.error('Erro inesperado ao carregar cliente');
    return null;
  }
};

// Update existing client
export const updateClient = async (client: Client): Promise<Client | null> => {
  try {
    // Prepare client data for DB
    const dbClient = mapClientToDB(client);

    // Update client
    const { error: clientError } = await supabase
      .from('clients')
      .update(dbClient)
      .eq('id', client.id);

    if (clientError) {
      console.error('Error updating client:', clientError);
      toast.error('Erro ao atualizar cliente');
      return null;
    }

    // Update client services
    if (client.services && client.services.length > 0) {
      // First delete existing services
      const { error: deleteError } = await supabase
        .from('client_services')
        .delete()
        .eq('client_id', client.id);

      if (deleteError) {
        console.error('Error deleting existing client services:', deleteError);
        toast.error('Erro ao atualizar serviços do cliente');
        return null;
      }

      // Then add new services
      const clientServices = client.services.map(service => ({
        client_id: client.id,
        service_id: service.serviceId,
        start_date: service.startDate.toISOString(),
        end_date: service.endDate.toISOString(),
        value: service.value
      }));

      const { error: servicesError } = await supabase
        .from('client_services')
        .insert(clientServices);

      if (servicesError) {
        console.error('Error updating client services:', servicesError);
        toast.error('Erro ao atualizar serviços do cliente');
        return null;
      }
    }

    // Return the updated client
    return await fetchClientById(client.id);
  } catch (error) {
    console.error('Unexpected error updating client:', error);
    toast.error('Erro inesperado ao atualizar cliente');
    return null;
  }
};

// Delete client
export const deleteClient = async (clientId: string): Promise<boolean> => {
  try {
    // Delete client - related services will be cascaded due to foreign key constraints
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) {
      console.error('Error deleting client:', error);
      toast.error('Erro ao excluir cliente');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting client:', error);
    toast.error('Erro inesperado ao excluir cliente');
    return false;
  }
};
