
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface FloorMapSkeletonProps {
  floor: string;
}

export function FloorMapSkeleton({ floor }: FloorMapSkeletonProps) {
  // Different number of skeleton items based on floor
  const itemCount = floor === "1" ? 7 : floor === "2" ? 19 : 10;
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-2 sm:gap-4 p-2 sm:p-8">
      {Array.from({ length: itemCount }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  );
}
