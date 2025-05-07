
import React, { useState } from 'react';
import { Room, WorkStation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  Sector
} from 'recharts';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface FloorLayoutVisualizationProps {
  rooms: Room[];
  workStations: WorkStation[];
  currentFloor: string;
}

const ROOM_COLORS = {
  available: '#10b981',
  occupied: '#ef4444',
  reserved: '#f59e0b',
  maintenance: '#6b7280'
};

const STATION_COLORS = {
  available: '#10b981',
  occupied: '#ef4444',
  reserved: '#f59e0b',
  flex: '#8b5cf6',
  maintenance: '#6b7280'
};

export const FloorLayoutVisualization: React.FC<FloorLayoutVisualizationProps> = ({
  rooms,
  workStations,
  currentFloor
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [visualizationType, setVisualizationType] = useState<'rooms' | 'stations'>('rooms');

  // Filter by current floor
  const floorRooms = rooms.filter(room => room.floor === parseInt(currentFloor) as any);
  const floorStations = workStations.filter(station => station.floor === parseInt(currentFloor) as any);
  
  // Process room data for chart
  const roomData = React.useMemo(() => {
    const statusCounts: Record<string, number> = {
      available: 0,
      occupied: 0,
      reserved: 0,
      maintenance: 0
    };
    
    floorRooms.forEach(room => {
      statusCounts[room.status] = (statusCounts[room.status] || 0) + 1;
    });
    
    return Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: status === 'available' ? 'Disponível' :
              status === 'occupied' ? 'Ocupado' :
              status === 'reserved' ? 'Reservado' : 'Manutenção',
        value: count,
        color: ROOM_COLORS[status as keyof typeof ROOM_COLORS] || '#6b7280'
      }));
  }, [floorRooms]);
  
  // Process workstation data for chart
  const stationData = React.useMemo(() => {
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
    
    return Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: status === 'available' ? 'Disponível' :
              status === 'occupied' ? 'Ocupado' :
              status === 'reserved' ? 'Reservado' :
              status === 'flex' ? 'Flex' : 'Manutenção',
        value: count,
        color: STATION_COLORS[status as keyof typeof STATION_COLORS] || '#6b7280'
      }));
  }, [floorStations]);
  
  const currentData = visualizationType === 'rooms' ? roomData : stationData;
  
  // No data available
  if (currentData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visualização do {currentFloor}º Andar</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          Nenhum dado disponível para este andar. 
          Use o botão "Popular Dados" para criar dados de exemplo.
        </CardContent>
      </Card>
    );
  }
  
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333" className="text-sm font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="#333" className="text-lg font-bold">
          {value}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#666" className="text-xs">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Visualização do {currentFloor}º Andar</CardTitle>
        <RadioGroup value={visualizationType} onValueChange={(v) => setVisualizationType(v as 'rooms' | 'stations')} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rooms" id="rooms" />
            <Label htmlFor="rooms">Salas</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="stations" id="stations" />
            <Label htmlFor="stations">Estações</Label>
          </div>
        </RadioGroup>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={currentData}
                innerRadius={80}
                outerRadius={110}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip
                formatter={(value, name) => [`${value} unidades`, name]}
                labelFormatter={() => visualizationType === 'rooms' ? 'Salas' : 'Estações'}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
