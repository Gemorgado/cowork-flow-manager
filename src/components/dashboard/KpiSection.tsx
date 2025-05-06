
import React from 'react';
import { Users, PercentSquare, Building, CalendarClock } from 'lucide-react';
import KpiCard from './KpiCard';
import { DashboardData } from '@/types';

interface KpiSectionProps {
  data: DashboardData;
}

const KpiSection: React.FC<KpiSectionProps> = ({ data }) => {
  const totalClients = data.clientsByService.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        icon={Users}
        title="Clientes por Serviço"
        value={totalClients}
        description="Total de clientes ativos por tipo de serviço"
      />
      <KpiCard
        icon={PercentSquare}
        title="Taxa de Ocupação"
        value={`${data.occupancyRates.overall.rate}%`}
        description="Ocupação geral de salas e estações"
      />
      <KpiCard
        icon={Building}
        title="Endereços Fiscais"
        value={data.fiscalAddressCount}
        description="Total de endereços fiscais ativos"
      />
      <KpiCard
        icon={CalendarClock}
        title="Contratos a Vencer"
        value={data.expiringContracts.length}
        description="Contratos a vencer nos próximos 90 dias"
      />
    </div>
  );
};

export default KpiSection;
