
import React from 'react';
import { dashboardData } from '@/mock/dashboard';
import KpiSection from '@/components/dashboard/KpiSection';
import ChartsSection from '@/components/dashboard/ChartsSection';
import ExpiringContractsTable from '@/components/dashboard/ExpiringContractsTable';

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <KpiSection data={dashboardData} />

      {/* Charts */}
      <ChartsSection data={dashboardData} />

      {/* Contratos a Vencer */}
      <ExpiringContractsTable contracts={dashboardData.expiringContracts} />
    </div>
  );
};

export default Dashboard;
