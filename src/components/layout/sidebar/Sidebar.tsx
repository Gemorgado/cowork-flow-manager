
import React from 'react';
import { cn } from '@/lib/utils';
import { Home, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar as ShadcnSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter
} from '@/components/ui/sidebar';
import SidebarItems from './SidebarItems';
import UserMenu from './UserMenu';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  userInitials: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isSidebarOpen, 
  toggleSidebar, 
  userInitials 
}) => {
  return (
    <ShadcnSidebar
      collapsible={isSidebarOpen ? "none" : "icon"}
      className={cn(
        'bg-white shadow-md transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <SidebarHeader className="border-b">
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
      </SidebarHeader>

      <SidebarContent>
        <SidebarItems isSidebarOpen={isSidebarOpen} />
      </SidebarContent>
      
      <SidebarFooter>
        <UserMenu 
          isSidebarOpen={isSidebarOpen} 
          userInitials={userInitials}
        />
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
