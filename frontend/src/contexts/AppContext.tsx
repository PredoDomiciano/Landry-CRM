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
  
  // --- DADOS (Listas) ---
  logs: Log[];
  clientes: Cliente[];
  oportunidades: Oportunidade[];
  pedidos: Pedido[];
  produtos: Produto[];
  funcionarios: Funcionario[];
  
  // --- AÇÕES CRUD (Adicionar) ---
  addLog: (log: Partial<Log>) => Promise<void>;
  addCliente: (cliente: Partial<Cliente>) => Promise<void>;
  addOportunidade: (oportunidade: Partial<Oportunidade>) => Promise<void>;
  addPedido: (pedido: Partial<Pedido>) => Promise<void>;
  addProduto: (produto: Partial<Produto>) => Promise<void>;
  addFuncionario: (funcionario: Partial<Funcionario>) => Promise<void>;
  
  // --- FUNÇÕES DE PRODUTO (Update/Delete) ---
  updateProduto: (id: number, produto: Partial<Produto>) => Promise<void>;
  
  // --- FUNÇÕES DE FUNCIONÁRIO (Update/Delete) ---
  deleteFuncionario: (id: number) => Promise<void>;
  updateFuncionario: (id: number, funcionario: Partial<Funcionario>) => Promise<void>;

  // --- FUNÇÕES DE PEDIDO (Novas - Update/Delete) ---
  deletePedido: (id: number) => Promise<void>;
  updatePedido: (id: number, pedido: Partial<Pedido>) => Promise<void>;
  updatePedidoStatus: (id: number, status: string) => Promise<void>;

  // --- OUTROS ---
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

  // Carregar dados ao iniciar (se logado)
  useEffect(() => {
    if (isLoggedIn) {
      refreshData();
    }
  }, [isLoggedIn]);

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
        
        // CORREÇÃO 1: Usando (data as any).user para evitar erro de tipo se LoginResponse não tiver 'user' definido
        const userData = (data as any).user;
        setCurrentUser(userData || { email, nome: 'Usuário' }); 
        
        // Log automático de login
        await addLog({
            titulo: "Login Realizado",
            descricao: `Usuário ${email} acessou o sistema.`,
            // CORREÇÃO 2: Convertendo Date para string ISO para satisfazer o tipo Log
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

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setClientes([]);
    setPedidos([]);
    setOportunidades([]);
    setProdutos([]);
    setFuncionarios([]);
  };

  // --- AÇÕES CRUD (Create) ---
  
  const addCliente = async (cliente: Partial<Cliente>) => { try { await clienteApi.create(cliente); await refreshData(); } catch (e) { throw e; } };
  const addProduto = async (produto: Partial<Produto>) => { try { await produtoApi.create(produto); await refreshData(); } catch (e) { throw e; } };
  const addPedido = async (pedido: Partial<Pedido>) => { try { await pedidoApi.create(pedido); await refreshData(); } catch (e) { throw e; } };
  const addOportunidade = async (op: Partial<Oportunidade>) => { try { await oportunidadeApi.create(op); await refreshData(); } catch (e) { throw e; } };
  const addFuncionario = async (func: Partial<Funcionario>) => { try { await funcionarioApi.create(func); await refreshData(); } catch (e) { throw e; } };
  
  // CORREÇÃO NO ADDLOG: Casting para 'any' para evitar erro TS2358
  const addLog = async (log: Partial<Log>) => { 
      try { 
          const payload = {
              ...log,
              // Aqui usamos (log.data as any) para enganar o TS e permitir checar se é Date
              data: (log.data as any) instanceof Date ? (log.data as any).toISOString() : log.data
          };
          await logApi.create(payload as Log); 
          await refreshData(); 
      } catch (e) { throw e; } 
  };

  // --- UPDATES E DELETES ---

  // Produtos
  const updateProduto = async (id: number, produto: Partial<Produto>) => {
    try {
        if (produtoApi.update) await produtoApi.update(id, produto);
        await refreshData();
    } catch (e) { throw e; }
  };

  // Funcionários
  const deleteFuncionario = async (id: number) => {
    try {
      if (funcionarioApi.delete) await funcionarioApi.delete(id);
      await refreshData();
    } catch (e) { throw e; }
  };

  const updateFuncionario = async (id: number, funcionario: Partial<Funcionario>) => {
    try {
      if (funcionarioApi.update) await funcionarioApi.update(id, funcionario);
      await refreshData();
    } catch (e) { throw e; }
  };

  // Pedidos
  const updatePedido = async (id: number, pedido: Partial<Pedido>) => {
    try {
        if (pedidoApi.update) await pedidoApi.update(id, pedido);
        await refreshData();
    } catch (e) { throw e; }
  };

  const deletePedido = async (id: number) => {
    try {
        if (pedidoApi.delete) await pedidoApi.delete(id);
        await refreshData();
    } catch (e) { throw e; }
  };

  const updatePedidoStatus = async (id: number, status: string) => {
    try {
      const pedidoAtual = pedidos.find(p => p.idPedido === id);
      if (pedidoAtual) {
         await pedidoApi.update(id, { ...pedidoAtual, status: status as any });
         await refreshData();
      }
    } catch (e) { console.error(e); }
  };

  // Oportunidades
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
      updatePedidoStatus, updateOportunidadeStatus,
      updateProduto,
      deleteFuncionario, updateFuncionario,
      deletePedido, updatePedido
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