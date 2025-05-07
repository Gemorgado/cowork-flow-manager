
import React, { useState, useEffect } from 'react';
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
import { seedSupabaseOccupancy } from '@/utils/seedSupabaseOccupancy';

export function FloorMap() {
  const [floor, setFloor] = useState<"1" | "2" | "3">("1");
  const [activeView, setActiveView] = useState<'unified' | 'rooms' | 'stations'>('unified');
  const [hasCheckedData, setHasCheckedData] = useState(false);
  
  // Check if data exists on initial load
  useEffect(() => {
    const checkForData = async () => {
      try {
        // Check if rooms exist
        const { data: roomsCheck, error: roomsError } = await supabase
          .from('rooms')
          .select('id')
          .limit(1);
          
        if (roomsError) throw roomsError;
        
        // If no rooms, seed the data
        if (!roomsCheck || roomsCheck.length === 0) {
          await seedSupabaseOccupancy();
        }
      } catch (error) {
        console.error('Error checking for data:', error);
      } finally {
        setHasCheckedData(true);
      }
    };
    
    checkForData();
  }, []);

  const { data: rooms, isLoading: isLoadingRooms, error: roomsError, refetch: refetchRooms } = useQuery({
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
    enabled: hasCheckedData,
  });

  const { data: workStations, isLoading: isLoadingStations, error: stationsError, refetch: refetchStations } = useQuery({
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
      
      return (data || []).map(station => ({
        id: station.id,
        number: station.number,
        floor: parseInt(station.floor) as FloorNumber,
        type: station.type as 'flex' | 'fixed',
        status: station.status,
        clientId: station.client_id || undefined
      })) as WorkStation[];
    },
    enabled: hasCheckedData,
  });

  // If we have no data after checking, try to seed
  useEffect(() => {
    const seedDataIfNeeded = async () => {
      if (hasCheckedData && (
        (!rooms || rooms.length === 0) && 
        (!workStations || workStations.length === 0)
      )) {
        try {
          await seedSupabaseOccupancy();
          // Refetch data after seeding
          refetchRooms();
          refetchStations();
        } catch (error) {
          console.error('Error seeding data:', error);
        }
      }
    };
    
    seedDataIfNeeded();
  }, [hasCheckedData, rooms, workStations, refetchRooms, refetchStations]);

  const isLoading = isLoadingRooms || isLoadingStations || !hasCheckedData;
  const hasError = roomsError || stationsError;

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
            Falha ao carregar dados de ocupação.
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-2 sm:gap-4 p-2 sm:p-8">
          {Array.from({ length: floor === "1" ? 7 : floor === "2" ? 19 : 10 }).map((_, i) => (
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
              <p>Carregando salas...</p>
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
              <p>Carregando estações...</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
