import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom'; // <--- O segredo está aqui

export const MainLayout = () => {
  // Não precisamos mais de estado 'activeTab' aqui!
  // A URL agora controla o que aparece.

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-slate-50/50">
        {/* O Outlet renderiza o componente filho da rota (Dashboard, Clientes, etc.) */}
        <Outlet /> 
      </main>
    </div>
  );
};