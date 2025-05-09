
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface RoomEditFooterProps {
  isEditing: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onStartEditing: () => void;
}

export const RoomEditFooter: React.FC<RoomEditFooterProps> = ({
  isEditing,
  isSaving,
  onSave,
  onCancel,
  onStartEditing
}) => {
  if (isEditing) {
    return (
      <DialogFooter className="gap-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar
        </Button>
      </DialogFooter>
    );
  }

  return (
    <DialogFooter>
      <Button 
        onClick={onStartEditing}
        variant="outline"
      >
        Editar Informações
      </Button>
    </DialogFooter>
  );
};
