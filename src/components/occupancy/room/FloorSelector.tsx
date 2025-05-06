
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface FloorSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function FloorSelector({ value, onChange }: FloorSelectorProps) {
  return (
    <div className="flex justify-center mb-8">
      <ToggleGroup
        type="single"
        value={value.toString()}
        onValueChange={(val) => val && onChange(parseInt(val))}
        className="rounded-full bg-white/5 backdrop-blur-sm shadow-sm p-1"
      >
        <ToggleGroupItem value="1" className="rounded-full data-[state=on]:bg-primary">
          P1
        </ToggleGroupItem>
        <ToggleGroupItem value="2" className="rounded-full data-[state=on]:bg-primary">
          P2
        </ToggleGroupItem>
        <ToggleGroupItem value="3" className="rounded-full data-[state=on]:bg-primary">
          P3
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
