
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useQueryClient } from '@tanstack/react-query';
import { Service } from '@/types';
import { toast } from 'sonner';

interface ServiceEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
}

const ServiceEditDialog = ({ open, onOpenChange, service }: ServiceEditDialogProps) => {
  const queryClient = useQueryClient();
  
  const form = useForm({
    defaultValues: {
      name: service.name,
      description: service.description,
      benefits: service.benefits?.map(b => b.name || '').join('\n') || '',
      prices: service.prices?.map(p => 
        `${p.period}|${p.price}${p.installments ? '|' + p.installments : ''}`
      ).join('\n') || ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      // In a real application, this would be a PATCH request to the API
      console.log('Saving service data:', data);
      
      // Example of how the data would be transformed for the API
      const transformedData = {
        ...service,
        name: data.name,
        description: data.description,
        benefits: data.benefits.split('\n')
          .filter(Boolean)
          .map((name: string) => ({ name })),
        prices: data.prices.split('\n')
          .filter(Boolean)
          .map((line: string) => {
            const parts = line.split('|');
            return {
              period: parts[0],
              price: parseFloat(parts[1]),
              ...(parts[2] ? { installments: parseInt(parts[2]) } : {})
            };
          })
      };
      
      // In a real application, make API call here
      // await fetch(`/api/plans/${service.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(transformedData),
      // });
      
      // Invalidate query to refresh data
      queryClient.invalidateQueries({ queryKey: ['services'] });
      
      toast.success('Serviço atualizado com sucesso!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao atualizar serviço.');
      console.error('Error saving service:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Serviço</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preços (Formato: periodo|preço|parcelas)</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} placeholder="monthly|150&#10;semiannual|360|2&#10;yearly|400|3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefícios (Um por linha)</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceEditDialog;
