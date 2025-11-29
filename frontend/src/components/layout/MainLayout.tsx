import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from '../dashboard/Dashboard';
import { ClientesView } from '../views/ClientesView';
import { OportunidadesView } from '../views/OportunidadesView';
import { PedidosView } from '../views/PedidosView';
import { ProdutosView } from '../views/ProdutosView';
import { FuncionariosView } from '../views/FuncionariosView';
import { LogsView } from '../views/LogsView';
import { FAQView } from '../views/FAQView';

export const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'clientes':
        return <ClientesView />;
      case 'oportunidades':
        return <OportunidadesView />;
      case 'pedidos':
        return <PedidosView />;
      case 'produtos':
        return <ProdutosView />;
      case 'funcionarios':
        return <FuncionariosView />;
      case 'logs':
        return <LogsView />;
      case 'faq':
        return <FAQView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};