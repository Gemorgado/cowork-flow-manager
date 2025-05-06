
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home, X, Menu } from 'lucide-react';
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

      <SidebarItems isSidebarOpen={isSidebarOpen} />
      
      <UserMenu 
        isSidebarOpen={isSidebarOpen} 
        userInitials={userInitials}
      />
    </aside>
  );
};

export default Sidebar;
