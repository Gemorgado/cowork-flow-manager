
import { useState } from 'react';
import { OccupancyChartProps, OccupancyData } from './types';

export function useOccupancyChartData({ 
  rooms,
  fixedStations,
  flexStations,
  floorRooms = {},
  floorFixedStations = {},
  floorFlexStations = {},
}: OccupancyChartProps) {
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  
  // Prepare data for the chart based on selected floor
  const getOccupancyData = (): OccupancyData[] => {
    if (selectedFloor === 'all') {
      return [
        {
          name: 'Salas',
          occupied: rooms?.occupied || 0,
          total: rooms?.total || 0,
          taxa: rooms?.rate || 0,
        },
        {
          name: 'Estações Fixas',
          occupied: fixedStations?.occupied || 0,
          total: fixedStations?.total || 0,
          taxa: fixedStations?.rate || 0,
        },
        {
          name: 'Estações Flex',
          occupied: flexStations?.occupied || 0,
          total: flexStations?.total || 0,
          taxa: flexStations?.rate || 0,
        },
      ];
    } else {
      return [
        {
          name: 'Salas',
          occupied: floorRooms[selectedFloor]?.occupied || 0,
          total: floorRooms[selectedFloor]?.total || 0,
          taxa: floorRooms[selectedFloor]?.rate || 0,
        },
        {
          name: 'Estações Fixas',
          occupied: floorFixedStations[selectedFloor]?.occupied || 0,
          total: floorFixedStations[selectedFloor]?.total || 0,
          taxa: floorFixedStations[selectedFloor]?.rate || 0,
        },
        {
          name: 'Estações Flex',
          occupied: floorFlexStations[selectedFloor]?.occupied || 0,
          total: floorFlexStations[selectedFloor]?.total || 0,
          taxa: floorFlexStations[selectedFloor]?.rate || 0,
        },
      ];
    }
  };

  const occupancyData = getOccupancyData();

  return {
    selectedFloor,
    setSelectedFloor,
    occupancyData
  };
}
