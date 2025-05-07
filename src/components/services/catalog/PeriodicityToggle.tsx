
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  // Se não houver items ou apenas um, não mostramos o seletor
  if (!items.length || items.length === 1) {
    return null;
  }

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger 
        className="w-full bg-white/10 backdrop-blur-sm border-0 text-white focus:ring-white/30 focus:ring-offset-0"
      >
        <SelectValue placeholder="Selecione a periodicidade" />
      </SelectTrigger>
      <SelectContent>
        {items.map((period) => (
          <SelectItem key={period.key} value={period.key}>
            {period.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PeriodicityToggle;
