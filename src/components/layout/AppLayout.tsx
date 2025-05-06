
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Import our components
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import { SidebarProvider } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cowork-600 mx-auto mb-4" />
          <p className="text-cowork-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    // Redirect to login after a short delay to avoid loops
    setTimeout(() => navigate('/login'), 100);
    return null;
  }

  // Generate user initials for the avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : user?.email.substring(0, 2).toUpperCase() || 'U';

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Sidebar */}
        <Sidebar 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          userInitials={initials}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="p-6 pb-16">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
