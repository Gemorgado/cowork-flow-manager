
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FloorSelector } from './FloorSelector';
import { RoomGrid } from './RoomGrid';
import { Room } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

export function FloorMap() {
  const [floor, setFloor] = useState<number>(1);

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms', floor],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('floor', floor);
      
      if (error) {
        throw error;
      }
      
      return data as Room[];
    },
  });

  return (
    <section className="py-10">
      <FloorSelector value={floor} onChange={setFloor} />
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-2 sm:gap-4 p-2 sm:p-8">
          {Array.from({ length: floor === 1 ? 7 : floor === 2 ? 19 : 14 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <RoomGrid rooms={rooms || []} />
      )}
    </section>
  );
}
