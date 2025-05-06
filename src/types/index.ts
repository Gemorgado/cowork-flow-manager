
// User types
export type Permission = 
  | 'dashboard' 
  | 'users' 
  | 'clients' 
  | 'plans' 
  | 'services' 
  | 'occupancy';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string; // Added password field
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser extends User {
  token: string;
}

// Service types
export type ServiceType = 
  | 'fiscal_address' 
  | 'flex_station'
  | 'fixed_station'
  | 'private_room';

export type PlanPeriod = 
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'biannual'
  | 'annual';

export interface Benefit {
  id: string;
  name: string;
  description: string;
}

export interface PlanPrice {
  id: string;
  serviceId: string;
  period: PlanPeriod;
  price: number;
  installments?: number;
  discount?: number;
}

export interface Service {
  id: string;
  type: ServiceType;
  name: string;
  description: string;
  prices: PlanPrice[];
  benefits: Benefit[];
}

// Location types
export type FloorNumber = 1 | 2 | 3;

export type LocationStatus = 
  | 'available'
  | 'occupied'
  | 'flex'
  | 'reserved'
  | 'maintenance';

export interface Room {
  id: string;
  number: string;
  floor: FloorNumber;
  status: LocationStatus;
  clientId?: string;
  area: number;
  capacity: number;
}

export interface WorkStation {
  id: string;
  number: string;
  floor: FloorNumber;
  type: 'flex' | 'fixed';
  status: LocationStatus;
  clientId?: string;
}

// Client types
export interface Client {
  id: string;
  companyName: string;
  tradeName: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  startDate: Date;
  endDate: Date;
  loyaltyMonths: number;
  value: number;
  dueDay: number;
  services: ClientService[];
}

export interface ClientService {
  id: string;
  clientId: string;
  serviceId: string;
  service: Service;
  locationIds: string[];
  startDate: Date;
  endDate: Date;
  value: number;
}

// Dashboard types
export interface OccupancyRate {
  total: number;
  occupied: number;
  rate: number;
}

export interface ExpiringContract {
  id: string;
  clientId: string;
  clientName: string;
  serviceName: string;
  endDate: Date;
  daysRemaining: number;
}

export interface DashboardData {
  clientsByService: {
    service: string;
    count: number;
  }[];
  occupancyRates: {
    rooms: OccupancyRate;
    fixedStations: OccupancyRate;
    flexStations: OccupancyRate;
    overall: OccupancyRate;
  };
  fiscalAddressCount: number;
  expiringContracts: ExpiringContract[];
}
