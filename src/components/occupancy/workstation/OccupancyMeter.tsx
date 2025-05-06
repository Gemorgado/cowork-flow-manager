
import React from 'react';

interface OccupancyMeterProps {
  occupancyRate: number;
  occupied: number;
  total: number;
  title: string;
}

export const OccupancyMeter: React.FC<OccupancyMeterProps> = ({
  occupancyRate,
  occupied,
  total,
  title,
}) => {
  const circumference = 2 * Math.PI * 30; // 30 is the radius
  const dashOffset = circumference * (1 - (occupied / total));
  
  return (
    <div className="flex flex-col items-center">
      <h4 className="text-lg font-medium mb-2">{title}</h4>
      <div className="relative w-32 h-32">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="transparent"
            stroke="#eab308" // Yellow for flex
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <div className="text-xs text-gray-500">Ocupação</div>
            <div className="text-xs text-gray-500">{occupied}/{total}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
