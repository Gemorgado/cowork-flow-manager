
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface FloorMapEmptyProps {
  floor: string;
}

export function FloorMapEmpty({ floor }: FloorMapEmptyProps) {
  return (
    <div className="text-center py-12">
      <Alert className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Nenhum dado encontrado para o {floor}º andar. 
          Use o botão "Popular Dados" para criar salas e estações de exemplo.
        </AlertDescription>
      </Alert>
    </div>
  );
}
