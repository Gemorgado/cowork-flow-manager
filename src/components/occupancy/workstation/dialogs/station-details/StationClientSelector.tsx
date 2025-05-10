
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface StationClientSelectorProps {
  availableClients: { id: string; name: string; }[];
  onLinkClient?: (clientId: string) => void;
  isLinkingClient: boolean;
  selectedClientId: string;
  setSelectedClientId: React.Dispatch<React.SetStateAction<string>>;
}

export const StationClientSelector: React.FC<StationClientSelectorProps> = ({
  availableClients,
  onLinkClient,
  isLinkingClient,
  selectedClientId,
  setSelectedClientId
}) => {
  const form = useForm({
    defaultValues: {
      clientId: ''
    }
  });

  const handleLinkClient = async () => {
    if (onLinkClient && selectedClientId) {
      onLinkClient(selectedClientId);
    }
  };

  if (availableClients.length === 0) {
    return null;
  }

  return (
    <div className="pt-4">
      <Form {...form}>
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <p className="text-sm font-medium mb-1">Vincular Cliente</p>
              <FormControl>
                <Select 
                  onValueChange={(value) => {
                    setSelectedClientId(value);
                    field.onChange(value);
                  }} 
                  value={field.value}
                  disabled={isLinkingClient}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </Form>
      <Button 
        className="mt-2 w-full"
        onClick={handleLinkClient} 
        disabled={!selectedClientId || isLinkingClient}
      >
        {isLinkingClient ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Vinculando...
          </>
        ) : (
          'Vincular Cliente'
        )}
      </Button>
    </div>
  );
};
