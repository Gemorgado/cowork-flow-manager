
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OccupancyRate } from '@/types';
import { 
  FloorSelector, 
  OccupancyBarChart,
  useOccupancyChartData 
} from './occupancy';

interface OccupancyRateChartProps {
  rooms: OccupancyRate;
  fixedStations: OccupancyRate;
  flexStations: OccupancyRate;
  floorRooms?: Record<string, OccupancyRate>;
  floorFixedStations?: Record<string, OccupancyRate>;
  floorFlexStations?: Record<string, OccupancyRate>;
  isLoading?: boolean;
}

const OccupancyRateChart: React.FC<OccupancyRateChartProps> = (props) => {
  const { 
    selectedFloor, 
    setSelectedFloor, 
    occupancyData 
  } = useOccupancyChartData(props);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Taxa de Ocupação</CardTitle>
          <CardDescription>
            Percentual de ocupação por tipo de espaço
          </CardDescription>
        </div>
        <FloorSelector 
          selectedFloor={selectedFloor} 
          onFloorChange={setSelectedFloor}
        />
      </CardHeader>
      <CardContent>
        <OccupancyBarChart data={occupancyData} />
      </CardContent>
    </Card>
  );
};

export default OccupancyRateChart;
