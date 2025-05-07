
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FloorSelector } from './FloorSelector';
import { RoomGrid } from './RoomGrid';
import { WorkStationGrid } from '../WorkStationGrid';
import { Room, FloorNumber, WorkStation } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { seedSupabaseOccupancy } from '@/utils/seedSupabaseOccupancy';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export function FloorMap() {
  const [floor, setFloor] = useState<"1" | "2" | "3">("1");
  const [activeView, setActiveView] = useState<'unified' | 'rooms' | 'stations'>('unified');
  const [hasCheckedData, setHasCheckedData] = useState(false);
  const [isSeedingData, setIsSeedingData] = useState(false);
  
  // Função para popular dados manualmente
  const handlePopulateData = async () => {
    try {
      setIsSeedingData(true);
      toast({
        title: "Populando dados",
        description: "Criando salas e estações de exemplo..."
      });
      
      await seedSupabaseOccupancy();
      
      // Refetching após seeding
      await refetchRooms();
      await refetchStations();
      
      toast({
        title: "Sucesso",
        description: "Dados de exemplo criados com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao popular dados:', error);
      toast({
        title: "Erro",
        description: "Falha ao popular dados de exemplo.",
        variant: "destructive"
      });
    } finally {
      setIsSeedingData(false);
    }
  };
  
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

  const isLoading = isLoadingRooms || isLoadingStations || !hasCheckedData;
  const hasError = roomsError || stationsError;
  const hasNoData = (!rooms || rooms.length === 0) && (!workStations || workStations.length === 0);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <FloorSelector value={floor} onChange={(val) => setFloor(val)} />
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePopulateData} 
            disabled={isSeedingData}
            className="text-xs"
          >
            {isSeedingData ? 'Populando...' : 'Popular Dados'}
          </Button>
          
          <Tabs value={activeView} onValueChange={(val) => setActiveView(val as any)}>
            <TabsList className="bg-white/5 backdrop-blur-sm">
              <TabsTrigger value="unified">Unificado</TabsTrigger>
              <TabsTrigger value="rooms">Salas</TabsTrigger>
              <TabsTrigger value="stations">Estações</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {hasError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Falha ao carregar dados de ocupação. Tente usar o botão "Popular Dados".
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-2 sm:gap-4 p-2 sm:p-8">
          {Array.from({ length: floor === "1" ? 7 : floor === "2" ? 19 : 10 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : hasNoData ? (
        <div className="text-center py-12">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Nenhum dado encontrado para o {floor}º andar. 
              Use o botão "Popular Dados" para criar salas e estações de exemplo.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="space-y-8">
          {(activeView === 'unified' || activeView === 'rooms') && rooms && rooms.length > 0 ? (
            <div className={activeView === 'unified' ? 'mb-10' : ''}>
              <h3 className="text-lg font-medium mb-4">Salas</h3>
              <RoomGrid rooms={rooms} />
            </div>
          ) : null}
          
          {(activeView === 'unified' || activeView === 'stations') && workStations && workStations.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-4">Estações de Trabalho</h3>
              <WorkStationGrid 
                workStations={workStations} 
                currentFloor={floor} 
              />
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
