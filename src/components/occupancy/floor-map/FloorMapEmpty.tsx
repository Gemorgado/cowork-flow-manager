
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from '@/components/ui/button';

interface FloorMapEmptyProps {
  floor: string;
  onPopulateData?: () => void;
}

export function FloorMapEmpty({ floor, onPopulateData }: FloorMapEmptyProps) {
  return (
    <div className="py-12 flex flex-col items-center justify-center">
      <Alert className="max-w-lg mx-auto">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Nenhum dado encontrado para o {floor}º andar.
        </AlertDescription>
      </Alert>
      
      {onPopulateData && (
        <Button 
          onClick={onPopulateData}
          className="mt-4"
          variant="outline"
        >
          Popular com dados de exemplo
        </Button>
      )}
      
      <p className="text-sm text-muted-foreground mt-4 text-center">
        Utilize o botão "Popular Dados" no topo da página para adicionar dados de exemplo.
      </p>
    </div>
  );
}
