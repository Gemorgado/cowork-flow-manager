
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
import ChartsSkeleton from './ChartsSkeleton';

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

  const hasData = occupancyData.length > 0;

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
        {props.isLoading ? (
          <ChartsSkeleton />
        ) : !hasData ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Nenhum dado disponível para esta visualização
          </div>
        ) : (
          <OccupancyBarChart data={occupancyData} />
        )}
      </CardContent>
    </Card>
  );
};

export default OccupancyRateChart;
