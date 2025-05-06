
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

interface Periodicity {
  label: string;
  key: string;
  price: number;
  times?: number;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  periodicities: Periodicity[];
  benefits: string[];
}

interface PlanEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan;
}

const PlanEditDialog = ({ open, onOpenChange, plan }: PlanEditDialogProps) => {
  const form = useForm({
    defaultValues: {
      name: plan.name,
      description: plan.description,
      benefits: plan.benefits.join('\n'),
      periodicities: plan.periodicities.map(p => 
        `${p.label}|${p.key}|${p.price}${p.times ? '|' + p.times : ''}`
      ).join('\n')
    }
  });

  const onSubmit = async (data: any) => {
    // In a real application, this would be a PATCH request to the API
    console.log('Saving plan data:', data);
    
    // Example of how the data would be transformed for the API
    const transformedData = {
      ...plan,
      name: data.name,
      description: data.description,
      benefits: data.benefits.split('\n').filter(Boolean),
      periodicities: data.periodicities.split('\n')
        .filter(Boolean)
        .map(line => {
          const parts = line.split('|');
          return {
            label: parts[0],
            key: parts[1],
            price: parseFloat(parts[2]),
            ...(parts[3] ? { times: parseInt(parts[3]) } : {})
          };
        })
    };
    
    console.log('Transformed data:', transformedData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Plano</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Plano</FormLabel>
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
              name="periodicities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periodicidades (Formato: Label|key|price|times)</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} placeholder="Mensal|monthly|150&#10;Semestral|semi|360|2&#10;Anual|yearly|400|3" />
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

export default PlanEditDialog;
