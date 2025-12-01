import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  clienteApi, oportunidadeApi, pedidoApi, produtoApi, 
  funcionarioApi, logApi, authApi 
} from '../services/api'; 
import type { Log, Cliente, Oportunidade, Pedido, Produto, Funcionario, Usuario } from '../types/api'; 

interface AppContextType {
  isLoggedIn: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  currentUser: Usuario | null;
  
  // Dados
  logs: Log[];
  clientes: Cliente[];
  oportunidades: Oportunidade[];
  pedidos: Pedido[];
  produtos: Produto[];
  funcionarios: Funcionario[];
  
  // Ações CRUD
  addLog: (log: Partial<Log>) => Promise<void>;
  addCliente: (cliente: Partial<Cliente>) => Promise<void>;
  addOportunidade: (oportunidade: Partial<Oportunidade>) => Promise<void>;
  addPedido: (pedido: Partial<Pedido>) => Promise<void>;
  addProduto: (produto: Partial<Produto>) => Promise<void>;
  addFuncionario: (funcionario: Partial<Funcionario>) => Promise<void>;
  
  // Updates e Deletes
  updateProduto: (id: number, produto: Partial<Produto>) => Promise<void>;
  deleteProduto: (id: number) => Promise<void>;
  
  deleteFuncionario: (id: number) => Promise<void>;
  updateFuncionario: (id: number, funcionario: Partial<Funcionario>) => Promise<void>;

  deletePedido: (id: number) => Promise<void>;
  updatePedido: (id: number, pedido: Partial<Pedido>) => Promise<void>;
  updatePedidoStatus: (id: number, status: string) => Promise<void>;

  updateOportunidadeStatus: (id: number, status: string) => Promise<void>;
  // --- CORREÇÃO 1: ADICIONADO updateOportunidade ---
  updateOportunidade: (id: number, oportunidade: Partial<Oportunidade>) => Promise<void>;
  deleteOportunidade: (id: number) => Promise<void>; 
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

  const [logs, setLogs] = useState<Log[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      refreshData();
    }
  }, [isLoggedIn]);

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setClientes([]);
    setPedidos([]);
    setOportunidades([]);
    setProdutos([]);
    setFuncionarios([]);
    // Opcional: Redirecionar para login via window.location se necessário, 
    // mas geralmente o state isLoggedIn trata disso no Router.
  };

  const refreshData = async () => {
    try {
      console.log("Atualizando dados do backend...");
      const results = await Promise.allSettled([
        clienteApi.getAll(),
        produtoApi.getAll(),
        pedidoApi.getAll(),
        oportunidadeApi.getAll(),
        funcionarioApi.getAll(),
        logApi.getAll()
      ]);

      // --- CORREÇÃO 2: LOGOUT AUTOMÁTICO SE O TOKEN EXPIRE ---
      const hasAuthError = results.some(r => r.status === 'rejected' && ((r.reason?.response?.status === 401) || (r.reason?.response?.status === 403)));
      if (hasAuthError) {
        console.warn("Sessão expirada. Fazendo logout...");
        logout();
        return;
      }

      if (results[0].status === 'fulfilled') setClientes(results[0].value);
      if (results[1].status === 'fulfilled') setProdutos(results[1].value);
      if (results[2].status === 'fulfilled') setPedidos(results[2].value);
      if (results[3].status === 'fulfilled') setOportunidades(results[3].value);
      if (results[4].status === 'fulfilled') setFuncionarios(results[4].value);
      if (results[5].status === 'fulfilled') setLogs(results[5].value);

    } catch (error) {
      console.error("Erro crítico ao carregar dados:", error);
    }
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const data = await authApi.login({ email, senha });
      if (data.token) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        const userData = (data as any).user;
        setCurrentUser(userData || { email, nome: 'Usuário' }); 
        
        await addLog({
            titulo: "Login Realizado",
            descricao: `Usuário ${email} acessou o sistema.`,
            data: new Date().toISOString(),
            tipoDeAtividade: 4, 
            usuario: userData
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login falhou:", error);
      return false;
    }
  };

  const addCliente = async (cliente: Partial<Cliente>) => { try { await clienteApi.create(cliente); await refreshData(); } catch (e) { throw e; } };
  const addProduto = async (produto: Partial<Produto>) => { try { await produtoApi.create(produto); await refreshData(); } catch (e) { throw e; } };
  const addPedido = async (pedido: Partial<Pedido>) => { try { await pedidoApi.create(pedido); await refreshData(); } catch (e) { throw e; } };
  const addOportunidade = async (op: Partial<Oportunidade>) => { try { await oportunidadeApi.create(op); await refreshData(); } catch (e) { throw e; } };
  const addFuncionario = async (func: Partial<Funcionario>) => { try { await funcionarioApi.create(func); await refreshData(); } catch (e) { throw e; } };
  const addLog = async (log: Partial<Log>) => { 
      try { 
          const payload = {
              ...log,
              data: (log.data as any) instanceof Date ? (log.data as any).toISOString() : log.data
          };
          await logApi.create(payload as Log); 
          await refreshData(); 
      } catch (e) { throw e; } 
  };

  const updateProduto = async (id: number, produto: Partial<Produto>) => { try { if (produtoApi.update) await produtoApi.update(id, produto); await refreshData(); } catch (e) { throw e; } };
  const deleteProduto = async (id: number) => { try { if (produtoApi.delete) await produtoApi.delete(id); await refreshData(); } catch (e) { throw e; } };

  const deleteFuncionario = async (id: number) => { try { if (funcionarioApi.delete) await funcionarioApi.delete(id); await refreshData(); } catch (e) { throw e; } };
  const updateFuncionario = async (id: number, funcionario: Partial<Funcionario>) => { try { if (funcionarioApi.update) await funcionarioApi.update(id, funcionario); await refreshData(); } catch (e) { throw e; } };

  const updatePedido = async (id: number, pedido: Partial<Pedido>) => { try { if (pedidoApi.update) await pedidoApi.update(id, pedido); await refreshData(); } catch (e) { throw e; } };
  const deletePedido = async (id: number) => { try { if (pedidoApi.delete) await pedidoApi.delete(id); await refreshData(); } catch (e) { throw e; } };

  const updatePedidoStatus = async (id: number, status: string) => { try { const pedidoAtual = pedidos.find(p => p.idPedido === id); if (pedidoAtual) { await pedidoApi.update(id, { ...pedidoAtual, status: status as any }); await refreshData(); } } catch (e) { console.error(e); } };
  const updateOportunidadeStatus = async (id: number, status: string) => { try { const opAtual = oportunidades.find(o => o.idOportunidade === id); if(opAtual) { await oportunidadeApi.update(id, { ...opAtual, estagioFunil: status as any }); await refreshData(); } } catch (e) { console.error(e); } };

  // --- CORREÇÃO 3: Implementação de updateOportunidade ---
  const updateOportunidade = async (id: number, op: Partial<Oportunidade>) => {
    try {
        if(oportunidadeApi.update) {
            await oportunidadeApi.update(id, op);
            await refreshData();
        }
    } catch (e) { throw e; }
  };

  const deleteOportunidade = async (id: number) => {
    try {
        await oportunidadeApi.delete(id); 
        await refreshData();
    } catch (e) { throw e; }
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn, login, logout, currentUser,
      logs, clientes, oportunidades, pedidos, produtos, funcionarios,
      addLog, addCliente, addOportunidade, addPedido, addProduto, addFuncionario,
      updatePedidoStatus, updateOportunidadeStatus,
      updateProduto, deleteProduto,
      deleteFuncionario, updateFuncionario,
      deletePedido, updatePedido,
      deleteOportunidade, 
      updateOportunidade // <--- AGORA ESTÁ EXPORTADO
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};