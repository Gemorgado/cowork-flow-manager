
import { Client, ClientService, Service } from '@/types';
import { ClientFromDB, ClientServiceFromDB } from './types';

// Function to convert DB client format to app Client format
export const mapClientFromDB = (dbClient: ClientFromDB, clientServices: ClientServiceFromDB[] = []): Client => {
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
export const mapClientToDB = (client: Client): ClientFromDB => {
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
