
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface PeriodItem {
  label: string;
  key: string;
  price: number;
}

interface PeriodicityToggleProps {
  items: PeriodItem[];
  value: string;
  onValueChange: (value: string) => void;
}

const PeriodicityToggle = ({ items, value, onValueChange }: PeriodicityToggleProps) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => {
        if (val) onValueChange(val);
      }}
      className="flex justify-start bg-white/5 dark:bg-neutral-900/60 rounded-full p-1 backdrop-blur-sm"
      aria-label="Selecione a periodicidade"
    >
      {items.map((period) => (
        <ToggleGroupItem
          key={period.key}
          value={period.key}
          aria-label={period.label}
          className="text-xs px-3 py-1 data-[state=on]:bg-primary data-[state=on]:text-white rounded-full transition-all"
        >
          {period.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default PeriodicityToggle;
