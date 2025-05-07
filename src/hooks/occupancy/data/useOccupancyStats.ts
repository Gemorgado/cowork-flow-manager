
import { useCallback } from 'react';
import { Room, WorkStation, OccupancyRate } from '@/types';

export function useOccupancyStats(rooms: Room[], workStations: WorkStation[]) {
  // Calculate occupancy rates for charts
  const calculateOccupancyStats = useCallback(() => {
    // For all rooms
    const roomsTotal = rooms.length;
    const roomsOccupied = rooms.filter(room => room.status === 'occupied').length;
    const roomsRate = roomsTotal > 0 ? Math.round((roomsOccupied / roomsTotal) * 100) : 0;

    // For fixed stations
    const fixedStations = workStations.filter(station => station.type === 'fixed');
    const fixedTotal = fixedStations.length;
    const fixedOccupied = fixedStations.filter(station => station.status === 'occupied').length;
    const fixedRate = fixedTotal > 0 ? Math.round((fixedOccupied / fixedTotal) * 100) : 0;

    // For flex stations
    const flexStations = workStations.filter(station => station.type === 'flex');
    const flexTotal = flexStations.length;
    const flexOccupied = flexStations.filter(station => station.status === 'occupied' || station.status === 'flex').length;
    const flexRate = flexTotal > 0 ? Math.round((flexOccupied / flexTotal) * 100) : 0;

    // Overall occupancy
    const totalSpaces = roomsTotal + fixedTotal + flexTotal;
    const totalOccupied = roomsOccupied + fixedOccupied + flexOccupied;
    const overallRate = totalSpaces > 0 ? Math.round((totalOccupied / totalSpaces) * 100) : 0;

    // Calculate occupancy rates by floor
    const floorRooms: Record<string, OccupancyRate> = {};
    const floorFixedStations: Record<string, OccupancyRate> = {};
    const floorFlexStations: Record<string, OccupancyRate> = {};
    
    // For each floor (1, 2, 3)
    ['1', '2', '3'].forEach(floor => {
      const floorNumber = parseInt(floor);
      
      // Rooms by floor
      const floorRoomsData = rooms.filter(room => room.floor === floorNumber);
      const floorRoomsTotal = floorRoomsData.length;
      const floorRoomsOccupied = floorRoomsData.filter(room => room.status === 'occupied').length;
      const floorRoomsRate = floorRoomsTotal > 0 ? Math.round((floorRoomsOccupied / floorRoomsTotal) * 100) : 0;
      floorRooms[floor] = { total: floorRoomsTotal, occupied: floorRoomsOccupied, rate: floorRoomsRate };
      
      // Fixed stations by floor
      const floorFixedStationsData = fixedStations.filter(station => station.floor === floorNumber);
      const floorFixedTotal = floorFixedStationsData.length;
      const floorFixedOccupied = floorFixedStationsData.filter(station => station.status === 'occupied').length;
      const floorFixedRate = floorFixedTotal > 0 ? Math.round((floorFixedOccupied / floorFixedTotal) * 100) : 0;
      floorFixedStations[floor] = { total: floorFixedTotal, occupied: floorFixedOccupied, rate: floorFixedRate };
      
      // Flex stations by floor
      const floorFlexStationsData = flexStations.filter(station => station.floor === floorNumber);
      const floorFlexTotal = floorFlexStationsData.length;
      const floorFlexOccupied = floorFlexStationsData.filter(station => station.status === 'occupied' || station.status === 'flex').length;
      const floorFlexRate = floorFlexTotal > 0 ? Math.round((floorFlexOccupied / floorFlexTotal) * 100) : 0;
      floorFlexStations[floor] = { total: floorFlexTotal, occupied: floorFlexOccupied, rate: floorFlexRate };
    });

    return {
      rooms: { total: roomsTotal, occupied: roomsOccupied, rate: roomsRate },
      fixedStations: { total: fixedTotal, occupied: fixedOccupied, rate: fixedRate },
      flexStations: { total: flexTotal, occupied: flexOccupied, rate: flexRate },
      overall: { total: totalSpaces, occupied: totalOccupied, rate: overallRate },
      floorRooms,
      floorFixedStations,
      floorFlexStations
    };
  }, [rooms, workStations]);

  return calculateOccupancyStats;
}
