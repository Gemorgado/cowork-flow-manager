
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
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
  );
};

export default Header;
