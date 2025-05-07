
import { Room, WorkStation } from '@/types';

export function convertFlexToFixed(
  workStations: WorkStation[],
  stationId: string,
  clientId: string
): WorkStation[] {
  return workStations.map((station) => {
    if (station.id === stationId) {
      return {
        ...station,
        type: 'fixed',
        status: 'occupied',
        clientId,
      };
    }
    return station;
  });
}

export function calculateOccupancyRate(items: Room[] | WorkStation[]): {
  occupied: number;
  total: number;
  rate: number;
} {
  if (!items || !items.length) {
    return { occupied: 0, total: 0, rate: 0 };
  }

  const total = items.length;
  let occupied = 0;

  items.forEach((item) => {
    if (item.status === 'occupied') {
      occupied += 1;
    }
  });

  const rate = Math.round((occupied / total) * 100);
  
  return {
    occupied,
    total,
    rate,
  };
}

export function getFlexStationsCount(workStations: WorkStation[]): {
  flex: number;
  totalFlex: number;
  flexRate: number;
} {
  if (!workStations || !workStations.length) {
    return { flex: 0, totalFlex: 0, flexRate: 0 };
  }

  const flex = workStations.filter(station => station.status === 'flex').length;
  const totalFlex = flex + workStations.filter(station => station.status === 'available').length;
  const flexRate = totalFlex > 0 ? Math.round((flex / totalFlex) * 100) : 0;
  
  return {
    flex,
    totalFlex,
    flexRate,
  };
}

export function calculateTotalArea(rooms: Room[]): number {
  return rooms.reduce((total, room) => total + (room.area || 0), 0);
}
