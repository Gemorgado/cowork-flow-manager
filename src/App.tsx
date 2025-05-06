
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Clients from "./pages/Clients";
import Services from "./pages/Services";
import Occupancy from "./pages/Occupancy";
import NotFound from "./pages/NotFound";

// Components
import AppLayout from "./components/layout/AppLayout";

const queryClient = new QueryClient();

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const { user, loading, hasPermission } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredPermission && !hasPermission(requiredPermission as any)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    
    <Route 
      path="/" 
      element={<Navigate to="/dashboard" replace />} 
    />
    
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute requiredPermission="dashboard">
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/users" 
      element={
        <ProtectedRoute requiredPermission="users">
          <AppLayout>
            <Users />
          </AppLayout>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/clients" 
      element={
        <ProtectedRoute requiredPermission="clients">
          <AppLayout>
            <Clients />
          </AppLayout>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/services" 
      element={
        <ProtectedRoute requiredPermission="services">
          <AppLayout>
            <Services />
          </AppLayout>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/occupancy" 
      element={
        <ProtectedRoute requiredPermission="occupancy">
          <AppLayout>
            <Occupancy />
          </AppLayout>
        </ProtectedRoute>
      } 
    />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
