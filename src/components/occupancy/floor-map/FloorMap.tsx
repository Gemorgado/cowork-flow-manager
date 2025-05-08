
import React, { useState } from 'react';
import { useFloorMapState } from './useFloorMapState';
import { useFloorMapData } from './useFloorMapData';
import { FloorMapHeader } from './FloorMapHeader';
import { FloorMapError } from './FloorMapError';
import { FloorMapEmpty } from './FloorMapEmpty';
import { FloorMapContent } from './FloorMapContent';
import { FloorMapSkeleton } from './FloorMapSkeleton';
import { toast } from '@/components/ui/use-toast';

export function FloorMap() {
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for forcing re-renders
  
  const {
    floor,
    setFloor,
    activeView,
    setActiveView,
    hasCheckedData,
    isSeedingData,
    handlePopulateData
  } = useFloorMapState();

  const {
    rooms,
    workStations,
    isLoading,
    hasError,
    hasNoData,
    refetchRooms,
    refetchStations
  } = useFloorMapData(floor, hasCheckedData, refreshKey);

  // Handle data population and refetch
  const onPopulateData = async () => {
    const success = await handlePopulateData();
    if (success) {
      toast({
        title: "Dados populados",
        description: "Os dados foram populados com sucesso. Atualizando a visualização..."
      });
      
      // Force refetch of data
      refetchRooms();
      refetchStations();
      setRefreshKey(prev => prev + 1);  // Force component refresh
    }
  };

  console.log("FloorMap rendering:", { 
    floor, 
    hasData: !hasNoData,
    roomCount: rooms?.length,
    workstationCount: workStations?.length
  });

  return (
    <section className="space-y-6">
      <FloorMapHeader
        floor={floor}
        setFloor={setFloor}
        activeView={activeView}
        setActiveView={setActiveView}
        onPopulateData={onPopulateData}
        isSeedingData={isSeedingData}
      />
      
      {hasError && <FloorMapError />}
      
      {isLoading ? (
        <FloorMapSkeleton floor={floor} />
      ) : hasNoData ? (
        <FloorMapEmpty floor={floor} onPopulateData={onPopulateData} />
      ) : (
        <FloorMapContent
          activeView={activeView}
          rooms={rooms || null}
          workStations={workStations || null}
          floor={floor}
        />
      )}
    </section>
  );
}
