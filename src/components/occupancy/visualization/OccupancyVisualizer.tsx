
import React from 'react';
import { Room, WorkStation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DonutChart } from './DonutChart';
import { useVisualizationData } from '@/hooks/occupancy/visualization/useVisualizationData';
import { useOccupancyVisualization } from './OccupancyVisualizationContext';

interface OccupancyVisualizerProps {
  rooms: Room[];
  workStations: WorkStation[];
  currentFloor: string;
}

export function OccupancyVisualizer({
  rooms,
  workStations,
  currentFloor
}: OccupancyVisualizerProps) {
  const { visualizationType, setVisualizationType, activeVisualizationIndex, setActiveVisualizationIndex } = useOccupancyVisualization();
  const { roomData, stationData } = useVisualizationData(rooms, workStations, currentFloor);
  
  const handleMouseEnter = (index: number) => {
    setActiveVisualizationIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveVisualizationIndex(undefined);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Visualização do {currentFloor}º Andar</CardTitle>
        <RadioGroup 
          value={visualizationType} 
          onValueChange={(v) => setVisualizationType(v as 'rooms' | 'stations')} 
          className="flex space-x-4"
        >
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
          {visualizationType === 'rooms' ? (
            <DonutChart 
              data={roomData.data}
              activeIndex={activeVisualizationIndex}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              title="Salas"
              emptyMessage="Nenhuma sala disponível para este andar"
            />
          ) : (
            <DonutChart 
              data={stationData.data}
              activeIndex={activeVisualizationIndex}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              title="Estações"
              emptyMessage="Nenhuma estação disponível para este andar"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
