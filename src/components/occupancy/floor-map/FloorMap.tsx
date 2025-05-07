
import React from 'react';
import { useFloorMapState } from './useFloorMapState';
import { useFloorMapData } from './useFloorMapData';
import { FloorMapHeader } from './FloorMapHeader';
import { FloorMapError } from './FloorMapError';
import { FloorMapEmpty } from './FloorMapEmpty';
import { FloorMapContent } from './FloorMapContent';
import { FloorMapSkeleton } from './FloorMapSkeleton';

export function FloorMap() {
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
  } = useFloorMapData(floor, hasCheckedData);

  // Handle data population and refetch
  const onPopulateData = async () => {
    const success = await handlePopulateData();
    if (success) {
      refetchRooms();
      refetchStations();
    }
  };

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
        <FloorMapEmpty floor={floor} />
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
