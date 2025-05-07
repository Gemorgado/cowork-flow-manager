
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FloorSelector } from './FloorSelector';
import { RoomGrid } from './RoomGrid';
import { WorkStationGrid } from '../WorkStationGrid';
import { Room, FloorNumber, WorkStation } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function FloorMap() {
  const [floor, setFloor] = useState<"1" | "2" | "3">("1");
  const [activeView, setActiveView] = useState<'unified' | 'rooms' | 'stations'>('unified');

  const { data: rooms, isLoading: isLoadingRooms, error: roomsError } = useQuery({
    queryKey: ['rooms', floor],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('floor', floor);
      
      if (error) {
        console.error("Error fetching rooms:", error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} rooms for floor ${floor}`);
      
      // Transform the response to match the Room type
      return (data || []).map(room => ({
        id: room.id,
        number: room.number,
        floor: parseInt(room.floor) as FloorNumber,
        status: room.status,
        clientId: room.client_id || undefined,
        area: room.area,
        capacity: room.capacity
      })) as Room[];
    },
  });

  const { data: workStations, isLoading: isLoadingStations, error: stationsError } = useQuery({
    queryKey: ['workstations', floor],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workstations')
        .select('*')
        .eq('floor', floor);
      
      if (error) {
        console.error("Error fetching workstations:", error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} workstations for floor ${floor}`);
      
      return (data || []).map(station => ({
        id: station.id,
        number: station.number,
        floor: parseInt(station.floor) as FloorNumber,
        type: station.type as 'flex' | 'fixed',
        status: station.status,
        clientId: station.client_id || undefined
      })) as WorkStation[];
    },
  });

  const isLoading = isLoadingRooms || isLoadingStations;
  const hasError = roomsError || stationsError;

  // Debugging logs to identify why data isn't showing
  console.log("Floor data:", { floor, rooms, workStations, isLoading });

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <FloorSelector value={floor} onChange={(val) => setFloor(val)} />
        
        <Tabs value={activeView} onValueChange={(val) => setActiveView(val as any)}>
          <TabsList className="bg-white/5 backdrop-blur-sm">
            <TabsTrigger value="unified">Unificado</TabsTrigger>
            <TabsTrigger value="rooms">Salas</TabsTrigger>
            <TabsTrigger value="stations">Estações</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {hasError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Falha ao carregar dados de ocupação. Tente novamente ou verifique o banco de dados.
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-2 sm:gap-4 p-2 sm:p-8">
          {Array.from({ length: floor === "1" ? 7 : floor === "2" ? 19 : 14 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {(activeView === 'unified' || activeView === 'rooms') && rooms && rooms.length > 0 ? (
            <div className={activeView === 'unified' ? 'mb-10' : ''}>
              <h3 className="text-lg font-medium mb-4">Salas</h3>
              <RoomGrid rooms={rooms} />
            </div>
          ) : (activeView === 'unified' || activeView === 'rooms') && (
            <div className="text-center py-8 text-muted-foreground">
              {rooms && rooms.length === 0 ? (
                <p>Nenhuma sala encontrada para este andar. Utilize o botão "Popular Dados" para criar salas de exemplo.</p>
              ) : (
                <p>Carregando salas...</p>
              )}
            </div>
          )}
          
          {(activeView === 'unified' || activeView === 'stations') && workStations && workStations.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-4">Estações de Trabalho</h3>
              <WorkStationGrid 
                workStations={workStations} 
                currentFloor={floor} 
              />
            </div>
          ) : (activeView === 'unified' || activeView === 'stations') && (
            <div className="text-center py-8 text-muted-foreground">
              {workStations && workStations.length === 0 ? (
                <p>Nenhuma estação encontrada para este andar. Utilize o botão "Popular Dados" para criar estações de exemplo.</p>
              ) : (
                <p>Carregando estações...</p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
