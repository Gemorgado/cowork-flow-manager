
import React from 'react';
import ClientDistributionChart from './ClientDistributionChart';
import OccupancyRateChart from './OccupancyRateChart';
import { DashboardData } from '@/types';

interface ChartsSectionProps {
  data: DashboardData;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ClientDistributionChart data={data.clientsByService} />
      <OccupancyRateChart 
        rooms={data.occupancyRates.rooms}
        fixedStations={data.occupancyRates.fixedStations}
        flexStations={data.occupancyRates.flexStations}
      />
    </div>
  );
};

export default ChartsSection;
