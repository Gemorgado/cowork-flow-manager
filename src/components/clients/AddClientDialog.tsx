
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

interface AddClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (field: 'startDate' | 'endDate', date: Date | undefined) => void;
  handleServiceChange: (serviceId: string, locationIds: string[]) => void;
  handleAddClient: () => void;
}

const AddClientDialog = ({
  isOpen,
  onOpenChange,
  formData,
  handleInputChange,
  handleDateChange,
  handleServiceChange,
  handleAddClient,
}: AddClientDialogProps) => {
  const onSubmit = () => {
    console.log('AddClientDialog: Submitting new client...');
    handleAddClient();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Cliente</DialogTitle>
          <DialogDescription>
            Preencha as informações para cadastrar um novo cliente.
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          formData={formData}
          services={availableServices}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          handleServiceChange={handleServiceChange}
          isEditing={false}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
