
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TooltipProvider, 
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Building2, 
  Package, 
  Map, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

interface SidebarItemsProps {
  isSidebarOpen: boolean;
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  
  const sidebarItems: SidebarItem[] = [
    { title: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { title: 'Usuários', icon: Users, path: '/users' },
    { title: 'Clientes', icon: Building2, path: '/clients' },
    { title: 'Planos & Serviços', icon: Package, path: '/services' },
    { title: 'Ocupação', icon: Map, path: '/occupancy' },
    { title: 'Configurações', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex-1 py-4 overflow-y-auto">
      <nav className="px-2 space-y-1">
        {sidebarItems.map((item) => (
          <TooltipProvider key={item.path} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start mb-1 hover:bg-cowork-50',
                    !isSidebarOpen && 'justify-center'
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className={cn("h-5 w-5 text-cowork-600", 
                    isSidebarOpen ? "mr-3" : "mr-0")} />
                  {isSidebarOpen && <span>{item.title}</span>}
                </Button>
              </TooltipTrigger>
              {!isSidebarOpen && <TooltipContent side="right">{item.title}</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>
    </div>
  );
};

export default SidebarItems;
