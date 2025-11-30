import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./components/auth/LoginPage"; // Ajusta o caminho se for diferente
import { Dashboard } from "./components/dashboard/Dashboard"; // Ajusta caminhos...
import { ClientesView } from "./components/views/ClientesView";
import { ProdutosView } from "./components/views/ProdutosView";
import { PedidosView } from "./components/views/PedidosView";
import { OportunidadesView } from "./components/views/OportunidadesView";
import { FuncionariosView } from "./components/views/FuncionariosView";
import { LogsView } from "./components/views/LogsView";
import { FAQView } from "./components/views/FAQView";
import { AppProvider, useApp } from "./contexts/AppContext";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para proteger rotas (Redireciona para login se não tiver token)
const RotaProtegida = () => {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

// Componente Wrapper para fornecer o Contexto antes das rotas
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rota Pública - Login */}
      <Route path="/login" element={<Login />} />

      {/* Rotas Privadas (Protegidas) */}
      <Route element={<RotaProtegida />}>
        <Route path="/" element={<MainLayout />}>
          {/* Redireciona a raiz "/" para "/dashboard" */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clientes" element={<ClientesView />} />
          <Route path="produtos" element={<ProdutosView />} />
          <Route path="pedidos" element={<PedidosView />} />
          <Route path="oportunidades" element={<OportunidadesView />} />
          <Route path="funcionarios" element={<FuncionariosView />} />
          <Route path="logs" element={<LogsView />} />
          <Route path="faq" element={<FAQView />} />
        </Route>
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
           <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;