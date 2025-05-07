
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check } from 'lucide-react';

interface BenefitsAccordionProps {
  benefits: string[];
}

const BenefitsAccordion = ({ benefits }: BenefitsAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="w-full" aria-label="Benefícios do plano">
      <AccordionItem value="benefits" className="border-b-0 border-t border-white/20">
        <AccordionTrigger className="text-sm font-medium py-2 text-white hover:text-white/90 no-underline">
          Benefícios inclusos
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-2 text-sm">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-white mt-0.5" />
                <span className="text-white/90">{benefit}</span>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default BenefitsAccordion;
