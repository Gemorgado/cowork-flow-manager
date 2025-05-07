
import { useMemo } from 'react';
import { Room, WorkStation } from '@/types';

// Room status colors
export const ROOM_COLORS = {
  available: '#10b981', // green
  occupied: '#ef4444', // red
  reserved: '#f59e0b', // amber
  maintenance: '#6b7280' // gray
};

// Workstation status colors
export const STATION_COLORS = {
  available: '#10b981', // green
  occupied: '#ef4444', // red
  reserved: '#f59e0b', // amber
  flex: '#8b5cf6', // purple
  maintenance: '#6b7280' // gray
};

// Function to process room data for visualization
export function useVisualizationData(rooms: Room[], workStations: WorkStation[], currentFloor: string) {
  // Process room data for chart
  const roomData = useMemo(() => {
    const floorRooms = rooms.filter(room => room.floor === parseInt(currentFloor) as any);
    
    const statusCounts: Record<string, number> = {
      available: 0,
      occupied: 0,
      reserved: 0,
      maintenance: 0
    };
    
    floorRooms.forEach(room => {
      statusCounts[room.status] = (statusCounts[room.status] || 0) + 1;
    });
    
    return {
      data: Object.entries(statusCounts)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
          name: status === 'available' ? 'Disponível' :
                status === 'occupied' ? 'Ocupado' :
                status === 'reserved' ? 'Reservado' : 'Manutenção',
          value: count,
          color: ROOM_COLORS[status as keyof typeof ROOM_COLORS] || '#6b7280',
          rawStatus: status
        })),
      total: floorRooms.length
    };
  }, [rooms, currentFloor]);
  
  // Process workstation data for chart
  const stationData = useMemo(() => {
    const floorStations = workStations.filter(station => station.floor === parseInt(currentFloor) as any);
    
    const statusCounts: Record<string, number> = {
      available: 0,
      occupied: 0,
      reserved: 0,
      flex: 0,
      maintenance: 0
    };
    
    floorStations.forEach(station => {
      statusCounts[station.status] = (statusCounts[station.status] || 0) + 1;
    });
    
    return {
      data: Object.entries(statusCounts)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
          name: status === 'available' ? 'Disponível' :
                status === 'occupied' ? 'Ocupado' :
                status === 'reserved' ? 'Reservado' :
                status === 'flex' ? 'Flex' : 'Manutenção',
          value: count,
          color: STATION_COLORS[status as keyof typeof STATION_COLORS] || '#6b7280',
          rawStatus: status
        })),
      total: floorStations.length
    };
  }, [workStations, currentFloor]);
  
  return {
    roomData,
    stationData
  };
}
