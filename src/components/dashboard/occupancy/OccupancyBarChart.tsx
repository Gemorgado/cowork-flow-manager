
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { OccupancyData } from './types';
import { ChartContainer } from '@/components/ui/chart';

interface OccupancyBarChartProps {
  data: OccupancyData[];
}

const OccupancyBarChart: React.FC<OccupancyBarChartProps> = ({ data }) => {
  // Create a chart config for colors
  const chartConfig = {
    occupied: { color: '#0f90db', label: 'Taxa' }
  };

  return (
    <div className="h-[300px]">
      <ChartContainer config={chartConfig}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis 
            unit="%" 
            domain={[0, 100]} 
            axisLine={false} 
            tickLine={false} 
            width={40} 
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Taxa de Ocupação']}
            labelFormatter={(name) => `Espaço: ${name}`}
          />
          <Bar 
            dataKey="taxa" 
            fill="var(--color-occupied, #0f90db)" 
            radius={[4, 4, 0, 0]}
            name="Taxa de Ocupação"
          >
            <LabelList 
              dataKey="taxa" 
              position="top" 
              formatter={(value: number) => `${value}%`} 
              style={{ fontWeight: 500 }}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default OccupancyBarChart;
