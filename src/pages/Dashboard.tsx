
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { dashboardData } from '@/mock/dashboard';
import {
  Users,
  PercentSquare,
  Building,
  CalendarClock,
} from 'lucide-react';

const Dashboard = () => {
  // Preparar dados para os gráficos
  const occupancyData = [
    {
      name: 'Salas',
      ocupado: dashboardData.occupancyRates.rooms.occupied,
      total: dashboardData.occupancyRates.rooms.total,
      taxa: dashboardData.occupancyRates.rooms.rate,
    },
    {
      name: 'Estações Fixas',
      ocupado: dashboardData.occupancyRates.fixedStations.occupied,
      total: dashboardData.occupancyRates.fixedStations.total,
      taxa: dashboardData.occupancyRates.fixedStations.rate,
    },
    {
      name: 'Estações Flex',
      ocupado: dashboardData.occupancyRates.flexStations.occupied,
      total: dashboardData.occupancyRates.flexStations.total,
      taxa: dashboardData.occupancyRates.flexStations.rate,
    },
  ];

  const clientsData = dashboardData.clientsByService.map((item) => ({
    name: item.service,
    value: item.count,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Clientes por Serviço
            </CardDescription>
            <CardTitle className="text-2xl">
              {dashboardData.clientsByService.reduce((sum, item) => sum + item.count, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Total de clientes ativos por tipo de serviço
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <PercentSquare className="h-4 w-4 mr-1" />
              Taxa de Ocupação
            </CardDescription>
            <CardTitle className="text-2xl">
              {dashboardData.occupancyRates.overall.rate}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Ocupação geral de salas e estações
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <Building className="h-4 w-4 mr-1" />
              Endereços Fiscais
            </CardDescription>
            <CardTitle className="text-2xl">
              {dashboardData.fiscalAddressCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Total de endereços fiscais ativos
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <CalendarClock className="h-4 w-4 mr-1" />
              Contratos a Vencer
            </CardDescription>
            <CardTitle className="text-2xl">
              {dashboardData.expiringContracts.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Contratos a vencer nos próximos 90 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Clientes por Serviço</CardTitle>
            <CardDescription>
              Distribuição de clientes por tipo de serviço contratado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clientsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {clientsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} clientes`, 'Total']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Taxa de Ocupação</CardTitle>
            <CardDescription>
              Percentual de ocupação por tipo de espaço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Taxa de Ocupação']}
                    labelFormatter={(name) => `Espaço: ${name}`}
                  />
                  <Bar dataKey="taxa" fill="#0f90db" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contratos a Vencer */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Contratos a Vencer</CardTitle>
          <CardDescription>
            Contratos que vencerão nos próximos 90 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cliente
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Serviço
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Data de Vencimento
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dias Restantes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.expiringContracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contract.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.serviceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.endDate.toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          contract.daysRemaining <= 30
                            ? 'bg-red-100 text-red-800'
                            : contract.daysRemaining <= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {contract.daysRemaining} dias
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
