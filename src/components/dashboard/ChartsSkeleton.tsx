
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ChartsSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[300px]" />
    </div>
  );
};

export default ChartsSkeleton;
