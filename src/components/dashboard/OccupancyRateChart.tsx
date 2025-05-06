
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { OccupancyRate } from '@/types';

interface OccupancyData {
  name: string;
  ocupado: number;
  total: number;
  taxa: number;
}

interface OccupancyRateChartProps {
  rooms: OccupancyRate;
  fixedStations: OccupancyRate;
  flexStations: OccupancyRate;
}

const OccupancyRateChart: React.FC<OccupancyRateChartProps> = ({
  rooms,
  fixedStations,
  flexStations,
}) => {
  // Prepare data for the chart
  const occupancyData: OccupancyData[] = [
    {
      name: 'Salas',
      ocupado: rooms.occupied,
      total: rooms.total,
      taxa: rooms.rate,
    },
    {
      name: 'Estações Fixas',
      ocupado: fixedStations.occupied,
      total: fixedStations.total,
      taxa: fixedStations.rate,
    },
    {
      name: 'Estações Flex',
      ocupado: flexStations.occupied,
      total: flexStations.total,
      taxa: flexStations.rate,
    },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Taxa de Ocupação</CardTitle>
        <CardDescription>
          Percentual de ocupação por tipo de espaço
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Taxa de Ocupação']}
                labelFormatter={(name) => `Espaço: ${name}`}
              />
              <Bar dataKey="taxa" fill="#0f90db" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OccupancyRateChart;
