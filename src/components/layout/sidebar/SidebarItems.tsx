
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Building2, 
  Package, 
  Map, 
  Settings 
} from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';

interface SidebarItemsProps {
  isSidebarOpen: boolean;
}

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
      <SidebarMenu>
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                isActive={isActive}
                tooltip={!isSidebarOpen ? item.title : undefined}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-5 w-5" />
                {isSidebarOpen && <span>{item.title}</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </div>
  );
};

export default SidebarItems;
