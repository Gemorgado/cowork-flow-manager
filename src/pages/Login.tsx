
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { seedDatabase } from '@/utils/seedDatabase';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@cowork.com');
  const [password, setPassword] = useState('senha123');
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro durante o login.';
      toast.error(errorMessage);
      toast.info('Tente criar a conta de administrador primeiro clicando no botão abaixo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      console.log('Creating admin account...');
      const result = await seedDatabase();
      if (result.success) {
        toast.success('Conta de administrador criada com sucesso! Tente fazer login agora.');
        // Automatically fill in the login form with admin credentials
        setEmail('admin@cowork.com');
        setPassword('senha123');
      } else {
        toast.error('Erro ao criar conta de administrador.');
        console.error('Error details:', result.error);
      }
    } catch (error) {
      console.error('Error creating admin account:', error);
      toast.error('Erro ao criar conta de administrador');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cowork-50 to-cowork-100">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-cowork-800">CoWork Flow</h1>
          <p className="text-cowork-600 mt-2">Sistema de Gestão para Coworking</p>
        </div>
        
        <Card className="w-full shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full mt-6 bg-cowork-600 hover:bg-cowork-700" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : 'Entrar'}
              </Button>
            </form>
            
            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSeedDatabase}
                disabled={isSeeding}
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : 'Criar conta de administrador'}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col justify-center items-center">
            <div className="text-sm text-gray-500 text-center">
              <p className="mb-1 font-semibold">Credenciais de acesso:</p>
              <p><strong>Email:</strong> admin@cowork.com</p>
              <p><strong>Senha:</strong> senha123</p>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Clique em "Criar conta de administrador" antes de tentar fazer login pela primeira vez.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
