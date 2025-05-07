
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface FloorMapErrorProps {
  message?: string;
}

export function FloorMapError({ message = 'Falha ao carregar dados de ocupação.' }: FloorMapErrorProps) {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro</AlertTitle>
      <AlertDescription>
        {message} Tente usar o botão "Popular Dados".
      </AlertDescription>
    </Alert>
  );
}
