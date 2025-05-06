
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface BenefitsAccordionProps {
  benefits: string[];
}

const BenefitsAccordion = ({ benefits }: BenefitsAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="benefits" className="border-b-0">
        <AccordionTrigger className="text-sm font-medium py-2">
          Benefícios inclusos
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-2 text-sm">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-cowork-500 mr-2">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default BenefitsAccordion;
