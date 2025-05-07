
import { Client, ClientService, Service } from '@/types';

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
