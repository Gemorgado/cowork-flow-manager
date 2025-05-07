
import React from 'react';
import { dashboardData } from '@/mock/dashboard';
import KpiSection from '@/components/dashboard/KpiSection';
import ChartsSection from '@/components/dashboard/ChartsSection';
import ExpiringContractsTable from '@/components/dashboard/ExpiringContractsTable';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    // Simular carregamento de dados
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cowork-600 mx-auto mb-4" />
          <p className="text-cowork-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {user && (
          <div className="text-sm text-cowork-600">
            Bem-vindo, {user.name || user.email}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <KpiSection data={dashboardData} />

      {/* Charts */}
      <ChartsSection dashboardData={dashboardData} />

      {/* Contratos a Vencer */}
      <ExpiringContractsTable contracts={dashboardData.expiringContracts} />
    </div>
  );
};

export default Dashboard;
