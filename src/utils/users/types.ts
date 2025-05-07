
import { User, Permission } from '@/types';

export interface ProfileFromDB {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}
