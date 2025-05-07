
import { User } from '@/types';
import { ProfileFromDB } from './types';

// Map profile from DB to User type
export const mapProfileToUser = (profile: ProfileFromDB): User => {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone || '',
    address: profile.address || '',
    password: '', // Password is not returned from DB
    permissions: profile.permissions || [],
    createdAt: new Date(profile.created_at),
    updatedAt: new Date(profile.updated_at)
  };
};
