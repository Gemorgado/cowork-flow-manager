
import { OccupancyRate } from "@/types";

export interface OccupancyData {
  name: string;
  occupied: number;
  total: number;
  taxa: number;
}

export interface OccupancyChartProps {
  rooms: OccupancyRate;
  fixedStations: OccupancyRate;
  flexStations: OccupancyRate;
  floorRooms?: Record<string, OccupancyRate>;
  floorFixedStations?: Record<string, OccupancyRate>;
  floorFlexStations?: Record<string, OccupancyRate>;
  isLoading?: boolean;
}
