
import React from 'react';
import { Room, WorkStation } from '@/types';

interface OccupancySummaryProps {
  rooms: Room[];
  workStations: WorkStation[];
}

export const OccupancySummary: React.FC<OccupancySummaryProps> = ({
  rooms,
  workStations
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-2">Resumo da Ocupação</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Total de Salas</p>
          <p className="text-xl font-bold">{rooms.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total de Estações</p>
          <p className="text-xl font-bold">{workStations.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Taxa de Ocupação Total</p>
          <p className="text-xl font-bold">
            {Math.round(
              ((rooms.filter(r => r.status === 'occupied').length + 
              workStations.filter(s => s.status === 'occupied').length) / 
              (rooms.length + workStations.length)) * 100
            )}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Estações Flex Alocadas</p>
          <p className="text-xl font-bold">
            {workStations.filter(s => s.status === 'flex').length}
          </p>
        </div>
      </div>
    </div>
  );
};
