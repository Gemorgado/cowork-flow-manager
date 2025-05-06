
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface OccupancyFloorSelectorProps {
  currentFloor: string;
  setCurrentFloor: (floor: string) => void;
}

export const OccupancyFloorSelector: React.FC<OccupancyFloorSelectorProps> = ({
  currentFloor,
  setCurrentFloor,
}) => {
  return (
    <Select value={currentFloor} onValueChange={setCurrentFloor}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Selecione o andar" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">1º Andar</SelectItem>
        <SelectItem value="2">2º Andar</SelectItem>
        <SelectItem value="3">3º Andar</SelectItem>
      </SelectContent>
    </Select>
  );
};
