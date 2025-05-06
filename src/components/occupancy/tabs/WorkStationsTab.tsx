
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { WorkStation } from '@/types';
import { WorkStationMap } from '../WorkStationMap';

interface WorkStationsTabProps {
  workStations: WorkStation[];
  currentFloor: string;
  onAllocateFlexToFixed?: (stationId: string, clientId: string) => void;
}

export const WorkStationsTab: React.FC<WorkStationsTabProps> = ({
  workStations,
  currentFloor,
  onAllocateFlexToFixed,
}) => {
  return (
    <CardContent>
      <WorkStationMap 
        workStations={workStations} 
        currentFloor={currentFloor}
        onAllocateFlexToFixed={onAllocateFlexToFixed}
      />
    </CardContent>
  );
};
