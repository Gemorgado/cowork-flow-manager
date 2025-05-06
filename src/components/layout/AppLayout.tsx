import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  BarChart3,
  Users,
  Building2,
  Package,
  Map,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  path: string;
  permission?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarItems: SidebarItem[] = [
    { title: 'Dashboard', icon: BarChart3, path: '/dashboard', permission: 'dashboard' },
    // Removendo o item de usuários, pois agora está dentro das configurações
    { title: 'Clientes', icon: Building2, path: '/clients', permission: 'clients' },
    { title: 'Planos & Serviços', icon: Package, path: '/services', permission: 'services' },
    { title: 'Ocupação', icon: Map, path: '/occupancy', permission: 'occupancy' },
    { title: 'Configurações', icon: Settings, path: '/settings' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'bg-white shadow-md z-20 transition-all duration-300 flex flex-col',
          isSidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className={cn("flex items-center", !isSidebarOpen && "justify-center w-full")}>
            <Home className="h-6 w-6 text-cowork-600" />
            {isSidebarOpen && (
              <span className="ml-2 font-semibold text-lg text-cowork-800">CoWork Flow</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn("h-8 w-8", !isSidebarOpen && "hidden")}
          >
            {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {sidebarItems.map((item) => {
              if (item.permission && !hasPermission(item.permission as any)) {
                return null;
              }

              return (
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
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start hover:bg-cowork-50",
                  !isSidebarOpen && "justify-center"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-cowork-200 text-cowork-700 text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isSidebarOpen && <span className="ml-2 truncate">{user?.name}</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn("md:hidden", isSidebarOpen && "hidden")}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div></div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
        <div className="p-6 pb-16">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
