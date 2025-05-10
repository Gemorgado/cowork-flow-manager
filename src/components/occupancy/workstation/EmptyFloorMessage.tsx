
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmptyFloorMessageProps {
  message: string;
}

export const EmptyFloorMessage: React.FC<EmptyFloorMessageProps> = ({ message }) => {
  return (
    <div className="p-6 text-center">
      <Alert variant="default" className="justify-center">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>
    </div>
  );
};
