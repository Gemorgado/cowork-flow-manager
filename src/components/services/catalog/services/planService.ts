
import { toast } from "sonner";
import { QueryClient } from "@tanstack/react-query";
import { PlanFormValues } from "../schemas/planFormSchema";

export async function updatePlan(planId: string, data: PlanFormValues): Promise<void> {
  const response = await fetch(`/api/plans/${planId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Falha ao atualizar o plano');
  }
}

export function invalidatePlanQueries(queryClient: QueryClient, planId: string): void {
  queryClient.invalidateQueries({ queryKey: ['plans'] });
  queryClient.invalidateQueries({ queryKey: ['plan', planId] });
}
