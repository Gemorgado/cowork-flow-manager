
import React from 'react';
import { LocationStatus } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { statusLabels } from '../statusUtils';

interface RoomStatusSelectProps {
  selectedStatus: LocationStatus;
  onStatusChange: (status: LocationStatus) => void;
}

export const RoomStatusSelect: React.FC<RoomStatusSelectProps> = ({
  selectedStatus,
  onStatusChange
}) => {
  console.log('RoomStatusSelect rendering with status:', selectedStatus);
  
  const handleStatusChange = (value: string) => {
    console.log('Status changing to:', value);
    onStatusChange(value as LocationStatus);
  };
  
  return (
    <div>
      <Label htmlFor="status">Status</Label>
      <Select 
        value={selectedStatus} 
        onValueChange={handleStatusChange}
      >
        <SelectTrigger id="status">
          <SelectValue placeholder={statusLabels[selectedStatus] || selectedStatus} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="available">Livre</SelectItem>
          <SelectItem value="occupied">Ocupada</SelectItem>
          <SelectItem value="reserved">Reservada</SelectItem>
          <SelectItem value="maintenance">Manutenção</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
