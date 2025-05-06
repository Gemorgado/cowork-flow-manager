
import React from 'react';
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlanFormValues } from "../schemas/planFormSchema";

interface PeriodicityFieldsProps {
  form: UseFormReturn<PlanFormValues>;
}

export const PeriodicityFields = ({ form }: PeriodicityFieldsProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "periodicities",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Periodicidades</FormLabel>
        <Button
          type="button"
          variant="outline"
          onClick={() => append({
            key: '',
            label: '',
            price: 0
          })}
          className="h-8 px-2"
        >
          Adicionar
        </Button>
      </div>
      
      {fields.map((field, index) => (
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
            onClick={() => remove(index)}
            disabled={fields.length <= 1}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
