
import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import PeriodicityToggle from './PeriodicityToggle';
import BenefitsAccordion from './BenefitsAccordion';
import PlanEditDialog from './PlanEditDialog';

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

interface PlanCardProps {
  plan: Plan;
}

const PlanCard = ({ plan }: PlanCardProps) => {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState(plan.periodicities[0]);

  return (
    <article className="relative rounded-2xl bg-white/5 dark:bg-neutral-100/60 backdrop-blur-sm shadow-md shadow-black/10 p-6 flex flex-col gap-4 transition hover:shadow-lg/20 hover:-translate-y-1">
      {/* Edit button */}
      <button
        onClick={() => setOpen(true)}
        className="absolute top-4 right-4 opacity-50 hover:opacity-100"
        aria-label="Editar plano"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <h3 className="text-lg font-medium">{plan.name}</h3>
      <p className="text-sm text-muted-foreground">{plan.description}</p>

      <PeriodicityToggle
        items={plan.periodicities}
        value={period.key}
        onValueChange={(key) =>
          setPeriod(plan.periodicities.find((p) => p.key === key) || plan.periodicities[0])
        }
      />

      <div>
        <span className="text-3xl font-bold tracking-tight">
          R$ {period.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
        <span className="text-xs"> / {period.label.toLowerCase()}</span>
        {period.times && (
          <p className="text-xs text-muted-foreground mt-1">
            Em {period.times}x de R$ {(period.price / period.times).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        )}
      </div>

      <BenefitsAccordion benefits={plan.benefits} />
      <PlanEditDialog open={open} onOpenChange={setOpen} plan={plan} />
    </article>
  );
};

export default PlanCard;
