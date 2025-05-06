
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LocationStatus } from '@/types';

export const statusColors: Record<LocationStatus, string> = {
  available: 'bg-green-100 border-green-300 hover:bg-green-200',
  occupied: 'bg-red-100 border-red-300 hover:bg-red-200',
  reserved: 'bg-amber-100 border-amber-300 hover:bg-amber-200',
  maintenance: 'bg-gray-100 border-gray-300 hover:bg-gray-200',
};

export const statusLabels: Record<LocationStatus, string> = {
  available: 'Disponível',
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
      </CardContent>
    </Card>
  );
};
