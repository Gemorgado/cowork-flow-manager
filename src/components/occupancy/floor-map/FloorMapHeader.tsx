import React from 'react';
import { FloorSelector } from '../room/FloorSelector';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
interface FloorMapHeaderProps {
  floor: "1" | "2" | "3";
  setFloor: (val: "1" | "2" | "3") => void;
  activeView: 'unified' | 'rooms' | 'stations';
  setActiveView: (val: 'unified' | 'rooms' | 'stations') => void;
  onPopulateData: () => void;
  isSeedingData: boolean;
}
export function FloorMapHeader({
  floor,
  setFloor,
  activeView,
  setActiveView,
  onPopulateData,
  isSeedingData
}: FloorMapHeaderProps) {
  return <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <FloorSelector value={floor} onChange={val => setFloor(val)} />
      
      <div className="flex items-center gap-3">
        
        
        <Tabs value={activeView} onValueChange={val => setActiveView(val as any)}>
          <TabsList className="bg-white/5 backdrop-blur-sm">
            <TabsTrigger value="unified">Unificado</TabsTrigger>
            <TabsTrigger value="rooms">Salas</TabsTrigger>
            <TabsTrigger value="stations">Estações</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>;
}