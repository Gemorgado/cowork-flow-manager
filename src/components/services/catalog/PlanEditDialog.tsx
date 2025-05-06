
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

// Define the schema for plan editing
const planFormSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome deve ter pelo menos 3 caracteres.',
  }),
  description: z.string().min(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres.',
  }),
  periodicities: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      price: z.number().min(1),
      times: z.number().optional(),
    })
  ).min(1, {
    message: 'Adicione pelo menos uma periodicidade.',
  }),
  benefits: z.array(
    z.string().min(3, {
      message: 'O benefício deve ter pelo menos 3 caracteres.',
    })
  ).min(1, {
    message: 'Adicione pelo menos um benefício.',
  }),
});

type PlanFormValues = z.infer<typeof planFormSchema>;

interface PlanEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: {
    id: string;
    name: string;
    description: string;
    periodicities: Array<{
      key: string;
      label: string;
      price: number;
      times?: number;
    }>;
    benefits: string[];
  };
}

const PlanEditDialog = ({ open, onOpenChange, plan }: PlanEditDialogProps) => {
  const queryClient = useQueryClient();
  
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: plan.name,
      description: plan.description,
      periodicities: plan.periodicities,
      benefits: plan.benefits,
    },
  });
  
  const { fields: periodicityFields, append: appendPeriodicity, remove: removePeriodicity } = 
    useFieldArray({
      control: form.control,
      name: "periodicities", // FIXED: was incorrectly set to "benefits"
    });
    
  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = 
    useFieldArray({
      control: form.control,
      name: "benefits",
    });

  async function onSubmit(data: PlanFormValues) {
    try {
      const response = await fetch(`/api/plans/${plan.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar o plano');
      }
      
      toast({
        title: "Plano atualizado",
        description: "Plano atualizado com sucesso.",
      });
      
      // Invalidate the plans queries to refetch
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plan', plan.id] });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar plano:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o plano. Tente novamente.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Plano</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do plano" {...field} />
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
                    <Textarea 
                      placeholder="Descrição do plano" 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Periodicities */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Periodicidades</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendPeriodicity({ key: '', label: '', price: 0 })}
                  className="h-8 px-2"
                >
                  Adicionar
                </Button>
              </div>
              
              {periodicityFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2 rounded-lg border p-3">
                  <FormField
                    control={form.control}
                    name={`periodicities.${index}.label`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Mensal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`periodicities.${index}.key`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Chave</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: monthly" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`periodicities.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Valor</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Valor"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`periodicities.${index}.times`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Parcelas</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Opcional"
                            {...field}
                            value={field.value || ''}
                            onChange={e => {
                              const value = e.target.value 
                                ? parseInt(e.target.value) 
                                : undefined;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removePeriodicity(index)}
                    disabled={periodicityFields.length <= 1}
                    className="p-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Benefícios</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendBenefit('')}
                  className="h-8 px-2"
                >
                  Adicionar
                </Button>
              </div>
              
              {benefitFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`benefits.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Descreva um benefício" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeBenefit(index)}
                    disabled={benefitFields.length <= 1}
                    className="p-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanEditDialog;
