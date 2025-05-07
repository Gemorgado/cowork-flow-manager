
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { seedSupabaseOccupancy } from '@/utils/seedSupabaseOccupancy';
import { toast } from '@/components/ui/use-toast';

export function useFloorMapState() {
  const [floor, setFloor] = useState<"1" | "2" | "3">("1");
  const [activeView, setActiveView] = useState<'unified' | 'rooms' | 'stations'>('unified');
  const [hasCheckedData, setHasCheckedData] = useState(false);
  const [isSeedingData, setIsSeedingData] = useState(false);
  
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

  // Function to populate data manually
  const handlePopulateData = async () => {
    try {
      setIsSeedingData(true);
      toast({
        title: "Populando dados",
        description: "Criando salas e estações de exemplo..."
      });
      
      await seedSupabaseOccupancy();
      
      toast({
        title: "Sucesso",
        description: "Dados de exemplo criados com sucesso!"
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao popular dados:', error);
      toast({
        title: "Erro",
        description: "Falha ao popular dados de exemplo.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSeedingData(false);
    }
  };
  
  return {
    floor,
    setFloor,
    activeView,
    setActiveView,
    hasCheckedData,
    isSeedingData,
    handlePopulateData
  };
}
