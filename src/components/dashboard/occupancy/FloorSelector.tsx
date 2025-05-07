
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FloorSelectorProps {
  selectedFloor: string;
  onFloorChange: (floor: string) => void;
}

const FloorSelector: React.FC<FloorSelectorProps> = ({
  selectedFloor,
  onFloorChange,
}) => {
  return (
    <Select value={selectedFloor} onValueChange={onFloorChange}>
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
  );
};

export default FloorSelector;
