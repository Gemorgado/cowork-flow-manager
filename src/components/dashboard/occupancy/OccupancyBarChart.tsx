
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

interface OccupancyBarChartProps {
  data: OccupancyData[];
}

const OccupancyBarChart: React.FC<OccupancyBarChartProps> = ({ data }) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis unit="%" domain={[0, 100]} />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Taxa de Ocupação']}
            labelFormatter={(name) => `Espaço: ${name}`}
          />
          <Bar dataKey="taxa" fill="#0f90db" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="taxa" position="top" formatter={(value: number) => `${value}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OccupancyBarChart;
