
import React from 'react';
import ClientDistributionChart from './ClientDistributionChart';
import OccupancyRateChart from './OccupancyRateChart';
import { DashboardData } from '@/types';
import { useOccupancyData } from '@/hooks/occupancy/data/useOccupancyData';
import RefreshButton from './RefreshButton';
import ChartsSkeleton from './ChartsSkeleton';

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
        <RefreshButton isRefreshing={isRefreshing} onRefresh={handleRefresh} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <ChartsSkeleton />
        ) : (
          <>
            <ClientDistributionChart data={dashboardData?.clientsByService || []} />
            <OccupancyRateChart 
              rooms={occupancyStats.rooms}
              fixedStations={occupancyStats.fixedStations}
              flexStations={occupancyStats.flexStations}
              floorRooms={occupancyStats.floorRooms}
              floorFixedStations={occupancyStats.floorFixedStations}
              floorFlexStations={occupancyStats.floorFlexStations}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ChartsSection;
