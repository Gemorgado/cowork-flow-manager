
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { WorkStation } from '@/types';
import { statusColors } from './StatusLegend';

interface WorkStationMapProps {
  workStations: WorkStation[];
  currentFloor: string;
}

export const WorkStationMap: React.FC<WorkStationMapProps> = ({ workStations, currentFloor }) => {
  const floorStations = workStations.filter(
    (station) => station.floor === parseInt(currentFloor) as any
  );

  const fixedStations = floorStations.filter((station) => station.type === 'fixed');
  const flexStations = floorStations.filter((station) => station.type === 'flex');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estações - {currentFloor}º Andar</CardTitle>
        <CardDescription>
          Fixas: {fixedStations.length} | Flex: {flexStations.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3">Estações Fixas</h3>
          <div className="floor-map grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
            {fixedStations.map((station) => (
              <div
                key={station.id}
                className={cn(
                  "workstation w-16 h-16 rounded-full flex items-center justify-center transition-all border-2",
                  statusColors[station.status]
                )}
              >
                <div className="text-center">
                  <div className="font-bold">{station.number.split('-')[1]}</div>
                  <div className="text-[10px] font-medium">
                    {station.status === 'occupied' ? 'Ocupado' : 'Livre'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Estações Flex</h3>
          <div className="floor-map grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
            {flexStations.map((station) => (
              <div
                key={station.id}
                className={cn(
                  "workstation w-16 h-16 rounded-full flex items-center justify-center transition-all border-2 border-dashed",
                  statusColors[station.status]
                )}
              >
                <div className="text-center">
                  <div className="font-bold">{station.number.split('-')[1]}</div>
                  <div className="text-[10px] font-medium">Flex</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
