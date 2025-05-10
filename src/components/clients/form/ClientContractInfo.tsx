
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientContractInfoProps {
  formData: {
    startDate: Date;
    endDate: Date;
    loyaltyMonths: number;
    value: number;
    dueDay: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (field: 'startDate' | 'endDate', date: Date | undefined) => void;
  errors?: Record<string, string[]>;
  isSubmitting?: boolean;
}

export const ClientContractInfo: React.FC<ClientContractInfoProps> = ({
  formData,
  handleInputChange,
  handleDateChange,
  errors = {},
  isSubmitting = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Data de Início</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground",
                  errors.startDate ? "border-destructive" : ""
                )}
                disabled={isSubmitting}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? format(formData.startDate, "dd/MM/yyyy") : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => handleDateChange('startDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.startDate && (
            <p className="text-xs text-destructive">{errors.startDate[0]}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">Data de Fim</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground",
                  errors.endDate ? "border-destructive" : ""
                )}
                disabled={isSubmitting}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? format(formData.endDate, "dd/MM/yyyy") : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => handleDateChange('endDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.endDate && (
            <p className="text-xs text-destructive">{errors.endDate[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="loyaltyMonths">Fidelidade (meses)</Label>
          <Input
            id="loyaltyMonths"
            name="loyaltyMonths"
            type="number"
            value={formData.loyaltyMonths}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className={errors.loyaltyMonths ? "border-destructive" : ""}
          />
          {errors.loyaltyMonths && (
            <p className="text-xs text-destructive">{errors.loyaltyMonths[0]}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="value">Valor Mensal (R$)</Label>
          <Input
            id="value"
            name="value"
            type="number"
            value={formData.value}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className={errors.value ? "border-destructive" : ""}
          />
          {errors.value && (
            <p className="text-xs text-destructive">{errors.value[0]}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dueDay">Dia de Vencimento</Label>
          <Input
            id="dueDay"
            name="dueDay"
            type="number"
            min="1"
            max="31"
            value={formData.dueDay}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className={errors.dueDay ? "border-destructive" : ""}
          />
          {errors.dueDay && (
            <p className="text-xs text-destructive">{errors.dueDay[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
};
