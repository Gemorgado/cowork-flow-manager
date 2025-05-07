
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector, TooltipProps } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { ChartTooltipContent } from '@/components/ui/chart/ChartTooltip';

interface ChartData {
  name: string;
  value: number;
  color: string;
  rawStatus: string;
}

interface DonutChartProps {
  data: ChartData[];
  activeIndex?: number;
  onMouseEnter?: (index: number) => void;
  onMouseLeave?: () => void;
  title: string;
  emptyMessage?: string;
}

export function DonutChart({ 
  data, 
  activeIndex, 
  onMouseEnter, 
  onMouseLeave, 
  title,
  emptyMessage = "Nenhum dado disponível"
}: DonutChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="currentColor" className="text-sm font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="currentColor" className="text-lg font-bold">
          {value}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="currentColor" className="text-xs">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  // Create chart config using category colors
  const chartConfig = data.reduce((config, item) => {
    return {
      ...config,
      [item.rawStatus]: { 
        color: item.color,
        label: item.name
      }
    };
  }, {});

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          innerRadius={80}
          outerRadius={110}
          dataKey="value"
          onMouseEnter={(_, index) => onMouseEnter?.(index)}
          onMouseLeave={() => onMouseLeave?.()}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend />
        <Tooltip 
          content={({ payload }) => {
            if (payload && payload.length) {
              const item = payload[0];
              return (
                <div className="rounded-lg border border-border/50 bg-background p-2 shadow-lg">
                  <p className="font-medium">{item.name}: {item.value}</p>
                  <p className="text-xs text-muted-foreground">{`${(item.payload.percent * 100).toFixed(0)}%`}</p>
                </div>
              );
            }
            return null;
          }}
        />
      </PieChart>
    </ChartContainer>
  );
}
