
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface RefreshButtonProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ isRefreshing, onRefresh }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
          <span className="hidden sm:inline">Atualizar dados</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Atualizar dados de ocupação</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default RefreshButton;
