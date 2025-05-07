import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  floorRooms?: Record<string, OccupancyRate>;
  floorFixedStations?: Record<string, OccupancyRate>;
  floorFlexStations?: Record<string, OccupancyRate>;
  isLoading?: boolean;
}

const OccupancyRateChart: React.FC<OccupancyRateChartProps> = ({
  rooms,
  fixedStations,
  flexStations,
  floorRooms = {},
  floorFixedStations = {},
  floorFlexStations = {},
  isLoading = false,
}) => {
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

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Taxa de Ocupação</CardTitle>
          <CardDescription>
            Percentual de ocupação por tipo de espaço
          </CardDescription>
        </div>
        <Select 
          value={selectedFloor} 
          onValueChange={setSelectedFloor}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Andar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="1">1º Andar</SelectItem>
            <SelectItem value="2">2º Andar</SelectItem>
            <SelectItem value="3">3º Andar</SelectItem>
          </SelectContent>
        </Select>
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
