
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ClientForm from './ClientForm';
import { services as availableServices } from '@/mock/services';

interface EditClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (field: 'startDate' | 'endDate', date: Date | undefined) => void;
  handleServiceChange: (serviceId: string, locationIds: string[]) => void;
  handleEditClient: () => void;
}

const EditClientDialog = ({
  isOpen,
  onOpenChange,
  formData,
  handleInputChange,
  handleDateChange,
  handleServiceChange,
  handleEditClient,
}: EditClientDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize as informações do cliente selecionado.
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          formData={formData}
          services={availableServices}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          handleServiceChange={handleServiceChange}
          isEditing
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleEditClient}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;
