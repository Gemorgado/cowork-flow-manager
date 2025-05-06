
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LocationStatus } from '@/types';

export const statusColors: Record<LocationStatus, string> = {
  available: 'bg-gray-200 border-gray-300 hover:bg-gray-300', // Changed to gray for "Livre"
  occupied: 'bg-green-500 border-green-600 hover:bg-green-600', // Changed to green for "Ocupado"
  flex: 'bg-yellow-300 border-yellow-400 hover:bg-yellow-400', // Yellow for "Flex"
  reserved: 'bg-yellow-500 border-yellow-600 hover:bg-yellow-600', // Darker yellow for "Reservado"
  maintenance: 'bg-red-500 border-red-600 hover:bg-red-600', // Red for "Manutenção"
};

export const statusLabels: Record<LocationStatus, string> = {
  available: 'Livre',
  occupied: 'Ocupado',
  flex: 'Flex',
  reserved: 'Reservado',
  maintenance: 'Manutenção',
};

export const StatusLegend: React.FC = () => {
  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Legenda</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusLabels).map(([status, label]) => (
            <Badge
              key={status}
              variant="outline"
              className={cn("px-3 py-1", statusColors[status as LocationStatus])}
            >
              {label}
            </Badge>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>• Salas: Espaços privativos com acessos controlados</p>
          <p>• Estações Fixas: Posições dedicadas a um único cliente</p>
          <p>• Estações Flex: Posições compartilhadas sem reserva fixa</p>
          <p className="mt-2 italic">Nota: Estações Flex (amarelo claro) são marcadores aleatórios e não representam posições físicas específicas.</p>
        </div>
      </CardContent>
    </Card>
  );
};
