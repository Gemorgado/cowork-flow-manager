
import React, { useState } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import Users from './Users';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="company">Empresa</TabsTrigger>
              <TabsTrigger value="system">Sistema</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="space-y-4">
              <Users isTab={true} />
            </TabsContent>
            <TabsContent value="company" className="space-y-4">
              <h2 className="text-xl font-semibold">Configurações da Empresa</h2>
              <p className="text-muted-foreground">
                Gerencie as informações da sua empresa, como nome, endereço e configurações fiscais.
              </p>
              {/* Conteúdo futuro para configurações da empresa */}
            </TabsContent>
            <TabsContent value="system" className="space-y-4">
              <h2 className="text-xl font-semibold">Configurações do Sistema</h2>
              <p className="text-muted-foreground">
                Ajuste as configurações gerais do sistema, como notificações, backups e segurança.
              </p>
              {/* Conteúdo futuro para configurações do sistema */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
