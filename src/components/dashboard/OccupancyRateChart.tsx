
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
  LabelList,
} from 'recharts';
import { OccupancyRate } from '@/types';

interface OccupancyData {
  name: string;
  occupied: number;
  total: number;
  taxa: number;
}

interface OccupancyRateChartProps {
  rooms: OccupancyRate;
  fixedStations: OccupancyRate;
  flexStations: OccupancyRate;
  isLoading?: boolean;
}

const OccupancyRateChart: React.FC<OccupancyRateChartProps> = ({
  rooms,
  fixedStations,
  flexStations,
  isLoading = false,
}) => {
  // Prepare data for the chart
  const occupancyData: OccupancyData[] = [
    {
      name: 'Salas',
      ocupado: rooms?.occupied || 0,
      total: rooms?.total || 0,
      taxa: rooms?.rate || 0,
    },
    {
      name: 'Estações Fixas',
      ocupado: fixedStations?.occupied || 0,
      total: fixedStations?.total || 0,
      taxa: fixedStations?.rate || 0,
    },
    {
      name: 'Estações Flex',
      ocupado: flexStations?.occupied || 0,
      total: flexStations?.total || 0,
      taxa: flexStations?.rate || 0,
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
              <YAxis unit="%" domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Taxa de Ocupação']}
                labelFormatter={(name) => `Espaço: ${name}`}
              />
              <Bar dataKey="taxa" fill="#0f90db" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="taxa" position="top" formatter={(value: number) => `${value}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OccupancyRateChart;
