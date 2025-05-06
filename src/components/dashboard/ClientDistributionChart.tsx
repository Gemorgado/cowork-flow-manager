
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ClientData {
  service: string;
  count: number;
}

interface ClientDistributionChartProps {
  data: ClientData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ClientDistributionChart: React.FC<ClientDistributionChartProps> = ({ data }) => {
  // Format data for the pie chart
  const chartData = data.map((item) => ({
    name: item.service,
    value: item.count,
  }));

  return (
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
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
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
  );
};

export default ClientDistributionChart;
