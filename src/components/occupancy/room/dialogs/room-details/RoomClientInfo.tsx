
import React from 'react';
import { Label } from '@/components/ui/label';

interface RoomClientInfoProps {
  clientId?: string;
  getClientInfo: (clientId?: string) => string;
}

export const RoomClientInfo: React.FC<RoomClientInfoProps> = ({
  clientId,
  getClientInfo
}) => {
  return (
    <div>
      <Label htmlFor="client">Cliente</Label>
      {clientId ? (
        <p className="mt-2">{getClientInfo(clientId)}</p>
      ) : (
        <p className="text-muted-foreground mt-2">Nenhum cliente vinculado</p>
      )}
    </div>
  );
};
