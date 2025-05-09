
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
  return (
    <div>
      <Label htmlFor="status">Status</Label>
      <Select 
        value={selectedStatus} 
        onValueChange={(value) => onStatusChange(value as LocationStatus)}
      >
        <SelectTrigger>
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
