
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Room, WorkStation } from '@/types';

interface OccupancyRate {
  total: number;
  occupied: number;
  rate: number;
}

interface OccupancyStatsProps {
  roomOccupancy: OccupancyRate;
  stationOccupancy: OccupancyRate;
}

export const OccupancyStats: React.FC<OccupancyStatsProps> = ({
  roomOccupancy,
  stationOccupancy,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Taxa de Ocupação do Andar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Salas</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">{roomOccupancy.rate}%</p>
              <p className="text-sm text-muted-foreground pb-1">
                ({roomOccupancy.occupied}/{roomOccupancy.total})
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Estações</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">{stationOccupancy.rate}%</p>
              <p className="text-sm text-muted-foreground pb-1">
                ({stationOccupancy.occupied}/{stationOccupancy.total})
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const calculateOccupancyRate = (items: Array<Room | WorkStation>): OccupancyRate => {
  const occupied = items.filter((item) => item.status === 'occupied').length;
  return {
    total: items.length,
    occupied,
    rate: items.length > 0 ? Math.round((occupied / items.length) * 100) : 0,
  };
};
