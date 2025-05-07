
import { z } from "zod";

// Define the schema for plan editing
export const planFormSchema = z.object({
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
    z.object({
      id: z.string().optional(),
      text: z.string().min(3, {
        message: 'O benefício deve ter pelo menos 3 caracteres.',
      }),
    })
  ).min(1, {
    message: 'Adicione pelo menos um benefício.',
  }),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;

export interface PlanDialogData {
  id: string;
  name: string;
  description: string;
  periodicities: Array<{
    key: string;
    label: string;
    price: number;
    times?: number;
  }>;
  benefits: Array<{
    id?: string;
    text: string;
  }>;
}
