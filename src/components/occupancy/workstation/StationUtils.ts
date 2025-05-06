
import { WorkStation } from '@/types';

// Function to get client info for tooltip
export const getClientInfo = (clientId?: string): string => {
  if (!clientId) return "Nenhum cliente";
  // In a real app, we would fetch client details here
  return `Cliente #${clientId.replace('client', '')}`;
};

/**
 * @deprecated This function is no longer used in the Occupancy view.
 * It remains available for other modules that might need it.
 */
// Helper function to calculate occupancy rates
export const calculateFlexOccupancyRate = (
  stations: WorkStation[],
  filterFn: (s: WorkStation) => boolean
): { rate: number; occupied: number; total: number } => {
  const filtered = stations.filter(filterFn);
  const total = filtered.length;
  const occupied = filtered.filter(s => s.status === 'flex' || s.status === 'occupied').length;
  const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
  
  return { rate, occupied, total };
};
