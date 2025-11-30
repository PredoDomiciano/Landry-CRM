import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  clienteApi, oportunidadeApi, pedidoApi, produtoApi, 
  funcionarioApi, logApi, authApi 
} from '@/services/api';
import type { Log, Cliente, Oportunidade, Pedido, Produto, Funcionario, Usuario } from '@/types/api';

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
  
  updatePedidoStatus: (id: number, status: string) => Promise<void>;
  updateOportunidadeStatus: (id: number, status: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

  // Estados dos Dados
  const [logs, setLogs] = useState<Log[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  // Carregar dados quando entra
  useEffect(() => {
    if (isLoggedIn) {
      refreshData();
    }
  }, [isLoggedIn]);

  const refreshData = async () => {
    try {
      console.log("Atualizando dados do backend...");
      // Executa todas as chamadas em paralelo
      const results = await Promise.allSettled([
        clienteApi.getAll(),
        produtoApi.getAll(),
        pedidoApi.getAll(),
        oportunidadeApi.getAll(),
        funcionarioApi.getAll(),
        logApi.getAll()
      ]);

      if (results[0].status === 'fulfilled') setClientes(results[0].value);
      else console.error("Erro Clientes:", results[0].reason);

      if (results[1].status === 'fulfilled') setProdutos(results[1].value);
      if (results[2].status === 'fulfilled') setPedidos(results[2].value);
      if (results[3].status === 'fulfilled') setOportunidades(results[3].value);
      if (results[4].status === 'fulfilled') setFuncionarios(results[4].value);
      if (results[5].status === 'fulfilled') setLogs(results[5].value);

    } catch (error) {
      console.error("Erro crítico ao carregar dados:", error);
    }
  };

  // --- AUTENTICAÇÃO ---
  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const data = await authApi.login({ email, senha });
      if (data.token) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        // Opcional: decodificar token se quiser dados do usuário agora
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login falhou:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setClientes([]);
    setPedidos([]);
    setOportunidades([]);
  };

  // --- AÇÕES DE CADASTRO (CRUD) ---
  // Todas chamam refreshData() no final para atualizar a tela
  
  const addCliente = async (cliente: Partial<Cliente>) => {
    try { await clienteApi.create(cliente); await refreshData(); } catch (e) { throw e; }
  };

  const addProduto = async (produto: Partial<Produto>) => {
    try { await produtoApi.create(produto); await refreshData(); } catch (e) { throw e; }
  };

  const addPedido = async (pedido: Partial<Pedido>) => {
    try { await pedidoApi.create(pedido); await refreshData(); } catch (e) { throw e; }
  };

  const addOportunidade = async (op: Partial<Oportunidade>) => {
    try { await oportunidadeApi.create(op); await refreshData(); } catch (e) { throw e; }
  };

  const addFuncionario = async (func: Partial<Funcionario>) => {
    try { await funcionarioApi.create(func); await refreshData(); } catch (e) { throw e; }
  };

  const addLog = async (log: Partial<Log>) => {
    try { await logApi.create(log); await refreshData(); } catch (e) { throw e; }
  };

  // --- AÇÕES DE ATUALIZAÇÃO ---

  const updatePedidoStatus = async (id: number, status: string) => {
    try {
      const pedidoAtual = pedidos.find(p => p.idPedido === id);
      if (pedidoAtual) {
         // Envia o objeto atualizado. Ajuste conforme o Java espera (PATCH ou PUT completo)
         await pedidoApi.update(id, { ...pedidoAtual, status: status as any });
         await refreshData();
      }
    } catch (e) { console.error(e); }
  };

  const updateOportunidadeStatus = async (id: number, status: string) => {
    try {
       const opAtual = oportunidades.find(o => o.idOportunidade === id);
       if(opAtual) {
          await oportunidadeApi.update(id, { ...opAtual, estagioFunil: status as any }); 
          await refreshData();
       }
    } catch (e) { console.error(e); }
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn, login, logout, currentUser,
      logs, clientes, oportunidades, pedidos, produtos, funcionarios,
      addLog, addCliente, addOportunidade, addPedido, addProduto, addFuncionario,
      updatePedidoStatus, updateOportunidadeStatus
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