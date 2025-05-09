
import { supabase } from "@/integrations/supabase/client";
import { Client } from '@/types';
import { toast } from 'sonner';
import { ClientFromDB, ClientServiceFromDB } from './types';
import { mapClientFromDB, mapClientToDB } from './mappers';
import { addClientServices, fetchClientServices, updateClientServices } from './clientServices';

// Fetch all clients from Supabase
export const fetchClients = async (): Promise<Client[]> => {
  try {
    console.log('Fetching clients from database...');
    const { data: dbClients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .order('company_name');

    if (clientsError) {
      console.error('Error fetching clients:', clientsError);
      toast.error('Erro ao carregar clientes');
      return [];
    }

    console.log('Clients fetched successfully:', dbClients);

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

    console.log('Client services fetched successfully:', dbClientServices);

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

// Fetch client by ID
export const fetchClientById = async (clientId: string): Promise<Client | null> => {
  try {
    console.log(`Fetching client with ID: ${clientId}`);
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
    const dbClientServices = await fetchClientServices(clientId);
    console.log(`Client services for ID ${clientId}:`, dbClientServices);

    return mapClientFromDB(dbClient as ClientFromDB, dbClientServices as ClientServiceFromDB[]);
  } catch (error) {
    console.error('Unexpected error fetching client by ID:', error);
    toast.error('Erro inesperado ao carregar cliente');
    return null;
  }
};

// Add a new client to Supabase
export const addClient = async (client: Omit<Client, 'id'>): Promise<Client | null> => {
  try {
    console.log('Adding new client to database:', client);
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

    console.log('Client inserted successfully:', insertedClient);

    // If client has services, add them
    if (client.services && client.services.length > 0) {
      console.log('Adding client services:', client.services);
      await addClientServices(insertedClient.id, client.services);
    }

    // Return the newly created client
    return await fetchClientById(insertedClient.id);
  } catch (error) {
    console.error('Unexpected error adding client:', error);
    toast.error('Erro inesperado ao adicionar cliente');
    return null;
  }
};

// Update existing client
export const updateClient = async (client: Client): Promise<Client | null> => {
  try {
    console.log('Updating client in database:', client);
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

    console.log('Client updated successfully');

    // Update client services
    if (client.services && client.services.length > 0) {
      console.log('Updating client services:', client.services);
      const success = await updateClientServices(client.id, client.services);
      if (!success) return null;
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
    console.log(`Deleting client with ID: ${clientId}`);
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

    console.log('Client deleted successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error deleting client:', error);
    toast.error('Erro inesperado ao excluir cliente');
    return false;
  }
};
