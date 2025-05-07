
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RefreshButtonProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ isRefreshing, onRefresh }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onRefresh}
      disabled={isRefreshing}
      className="flex items-center gap-1"
    >
      <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
      Atualizar dados
    </Button>
  );
};

export default RefreshButton;
