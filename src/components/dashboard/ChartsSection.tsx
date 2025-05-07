
import React from 'react';
import ClientDistributionChart from './ClientDistributionChart';
import OccupancyRateChart from './OccupancyRateChart';
import { DashboardData } from '@/types';
import { useOccupancyData } from '@/hooks/occupancy/data/useOccupancyData';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartsSectionProps {
  dashboardData?: DashboardData;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ dashboardData }) => {
  // Use the occupancy hook to get real-time data
  const { 
    occupancyStats, 
    isLoading, 
    isRefreshing,
    handleRefresh
  } = useOccupancyData();

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
          Atualizar dados
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-[350px]" />
            <Skeleton className="h-[350px]" />
          </>
        ) : (
          <>
            <ClientDistributionChart data={dashboardData?.clientsByService || []} />
            <OccupancyRateChart 
              rooms={occupancyStats.rooms}
              fixedStations={occupancyStats.fixedStations}
              flexStations={occupancyStats.flexStations}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ChartsSection;
