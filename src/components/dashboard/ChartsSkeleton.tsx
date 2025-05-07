
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ChartsSkeleton: React.FC = () => {
  return (
    <>
      <Skeleton className="h-[350px]" />
      <Skeleton className="h-[350px]" />
    </>
  );
};

export default ChartsSkeleton;
