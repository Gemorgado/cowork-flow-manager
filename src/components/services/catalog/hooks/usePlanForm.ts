
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { planFormSchema, PlanFormValues, PlanDialogData } from "../schemas/planFormSchema";
import { updatePlan, invalidatePlanQueries } from "../services/planService";

interface UsePlanFormProps {
  plan: PlanDialogData;
  onSuccess: () => void;
}

export function usePlanForm({ plan, onSuccess }: UsePlanFormProps) {
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

  async function onSubmit(data: PlanFormValues) {
    try {
      await updatePlan(plan.id, data);
      toast.success("Plano atualizado com sucesso.");
      invalidatePlanQueries(queryClient, plan.id);
      onSuccess();
    } catch (error) {
      console.error("Erro ao atualizar plano:", error);
      toast.error("Não foi possível atualizar o plano. Tente novamente.");
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
