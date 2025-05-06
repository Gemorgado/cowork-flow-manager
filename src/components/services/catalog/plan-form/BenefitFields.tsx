
import React from 'react';
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  FormField, 
  FormItem, 
  FormControl, 
  FormMessage,
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlanFormValues } from "../schemas/planFormSchema";

interface BenefitFieldsProps {
  form: UseFormReturn<PlanFormValues>;
}

export const BenefitFields = ({ form }: BenefitFieldsProps) => {
  // Use explicit type assertion to fix the TypeScript error
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "benefits" as "benefits",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Benefícios</FormLabel>
        <Button
          type="button"
          variant="outline"
          onClick={() => append("")}
          className="h-8 px-2"
        >
          Adicionar
        </Button>
      </div>
      
      {fields.map((field, index) => (
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
