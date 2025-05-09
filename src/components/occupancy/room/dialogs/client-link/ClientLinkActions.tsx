
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Building, Loader2 } from 'lucide-react';

interface ClientLinkActionsProps {
  selectedClientId: string;
  isLinking?: boolean;
  isLoadingClients?: boolean;
  handleClientLink: () => void;
}

export const ClientLinkActions: React.FC<ClientLinkActionsProps> = ({
  selectedClientId,
  isLinking = false,
  isLoadingClients = false,
  handleClientLink,
}) => {
  return (
    <DialogFooter>
      <Button 
        onClick={handleClientLink} 
        disabled={!selectedClientId || isLinking || isLoadingClients}
        className="w-full"
      >
        {isLinking ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Vinculando...</span>
          </div>
        ) : (
          <>
            <Building className="mr-2 h-4 w-4" />
            Vincular Empresa
          </>
        )}
      </Button>
    </DialogFooter>
  );
};
