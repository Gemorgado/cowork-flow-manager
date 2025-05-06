
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LocationStatus } from '@/types';

export const statusColors: Record<LocationStatus, string> = {
  available: 'bg-gray-100 border-gray-300 hover:bg-gray-200', // Changed to gray for "Livre"
  occupied: 'bg-green-100 border-green-300 hover:bg-green-200', // Changed to green for "Ocupado"
  reserved: 'bg-amber-100 border-amber-300 hover:bg-amber-200', // Amber for "Reservado"
  maintenance: 'bg-red-100 border-red-300 hover:bg-red-200', // Red for "Manutenção"
};

export const statusLabels: Record<LocationStatus, string> = {
  available: 'Livre',
  occupied: 'Ocupado',
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
        </div>
      </CardContent>
    </Card>
  );
};
