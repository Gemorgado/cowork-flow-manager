
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface RoomBasicInfoProps {
  floor: number;
  capacity: number;
  area: number;
  isEditing: boolean;
  onCapacityChange: (value: number) => void;
  onAreaChange: (value: number) => void;
}

export const RoomBasicInfo: React.FC<RoomBasicInfoProps> = ({
  floor,
  capacity,
  area,
  isEditing,
  onCapacityChange,
  onAreaChange
}) => {
  return (
    <>
      <div>
        <Label htmlFor="floor">Andar</Label>
        <p className="mt-2">{floor}º</p>
      </div>
      <div>
        <Label htmlFor="capacity">Capacidade</Label>
        {isEditing ? (
          <Input 
            id="capacity" 
            type="number" 
            value={capacity} 
            onChange={(e) => onCapacityChange(Number(e.target.value))}
            className="mt-1"
          />
        ) : (
          <p className="mt-2">{capacity} pessoas</p>
        )}
      </div>
      <div>
        <Label htmlFor="area">Área</Label>
        {isEditing ? (
          <Input 
            id="area" 
            type="number" 
            value={area} 
            onChange={(e) => onAreaChange(Number(e.target.value))}
            className="mt-1"
            step="0.01"
          />
        ) : (
          <p className="mt-2">{area} m²</p>
        )}
      </div>
    </>
  );
};
