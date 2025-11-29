import { createContext, useContext, useState, ReactNode } from 'react';
import { Log, Cliente, Oportunidade, Pedido, Produto, Funcionario, mockClientes, mockOportunidades, mockPedidos, mockProdutos, mockFuncionarios, mockLogs } from '@/data/mockData';

interface AppContextType {
  // Auth
  isLoggedIn: boolean;
  currentUser: { email: string; nome: string } | null;
  login: (email: string, senha: string) => boolean;
  logout: () => void;
  
  // Logs
  logs: Log[];
  addLog: (log: Omit<Log, 'idLog' | 'data' | 'usuarioId'>) => void;
  
  // Data
  clientes: Cliente[];
  oportunidades: Oportunidade[];
  pedidos: Pedido[];
  produtos: Produto[];
  funcionarios: Funcionario[];
  
  // Actions
  addCliente: (cliente: Omit<Cliente, 'idCliente'>) => void;
  addOportunidade: (oportunidade: Omit<Oportunidade, 'idOportunidade'>) => void;
  addPedido: (pedido: Omit<Pedido, 'idPedidos'>) => void;
  addProduto: (produto: Omit<Produto, 'idProduto'>) => void;
  addFuncionario: (funcionario: Omit<Funcionario, 'idFuncionario'>) => void;
  updatePedidoStatus: (id: number, status: Pedido['status']) => void;
  updateOportunidadeStatus: (id: number, status: Oportunidade['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; nome: string } | null>(null);
  const [logs, setLogs] = useState<Log[]>(mockLogs);
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>(mockOportunidades);
  const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidos);
  const [produtos, setProdutos] = useState<Produto[]>(mockProdutos);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(mockFuncionarios);

  const login = (email: string, senha: string) => {
    // Visual only - accepts any credentials
    if (email && senha) {
      setIsLoggedIn(true);
      setCurrentUser({ email, nome: email.split('@')[0] });
      addLog({
        tipo_de_atividade: 'Atividade',
        assunto: 'Login realizado',
        descricao: `Usuário ${email} realizou login no sistema`,
        status: 'Concluído'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    addLog({
      tipo_de_atividade: 'Atividade',
      assunto: 'Logout realizado',
      descricao: `Usuário ${currentUser?.email} realizou logout do sistema`,
      status: 'Concluído'
    });
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const addLog = (log: Omit<Log, 'idLog' | 'data' | 'usuarioId'>) => {
    const newLog: Log = {
      ...log,
      idLog: logs.length + 1,
      data: new Date().toISOString().replace('T', ' ').substring(0, 16),
      usuarioId: 1
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const addCliente = (cliente: Omit<Cliente, 'idCliente'>) => {
    const newCliente = { ...cliente, idCliente: clientes.length + 1 };
    setClientes(prev => [...prev, newCliente]);
    addLog({
      tipo_de_atividade: 'Atividade',
      assunto: 'Cliente adicionado',
      descricao: `Novo cliente "${cliente.nome_do_comercio}" foi cadastrado no sistema`,
      status: 'Concluído'
    });
  };

  const addOportunidade = (oportunidade: Omit<Oportunidade, 'idOportunidade'>) => {
    const newOportunidade = { ...oportunidade, idOportunidade: oportunidades.length + 1 };
    setOportunidades(prev => [...prev, newOportunidade]);
    addLog({
      tipo_de_atividade: 'Atividade',
      assunto: 'Oportunidade criada',
      descricao: `Nova oportunidade "${oportunidade.nome_da_oportunidade}" foi criada - Valor: R$ ${oportunidade.valor_estimado.toLocaleString()}`,
      status: 'Concluído'
    });
  };

  const addPedido = (pedido: Omit<Pedido, 'idPedidos'>) => {
    const newPedido = { ...pedido, idPedidos: pedidos.length + 1 };
    setPedidos(prev => [...prev, newPedido]);
    addLog({
      tipo_de_atividade: 'Atividade',
      assunto: 'Pedido criado',
      descricao: `Novo pedido "${pedido.numero}" foi criado - Valor: R$ ${pedido.valorTotal.toLocaleString()}`,
      status: 'Concluído'
    });
  };

  const addProduto = (produto: Omit<Produto, 'idProduto'>) => {
    const newProduto = { ...produto, idProduto: produtos.length + 1 };
    setProdutos(prev => [...prev, newProduto]);
    addLog({
      tipo_de_atividade: 'Atividade',
      assunto: 'Produto adicionado',
      descricao: `Novo produto "${produto.nome}" foi cadastrado no sistema`,
      status: 'Concluído'
    });
  };

  const addFuncionario = (funcionario: Omit<Funcionario, 'idFuncionario'>) => {
    const newFuncionario = { ...funcionario, idFuncionario: funcionarios.length + 1 };
    setFuncionarios(prev => [...prev, newFuncionario]);
    addLog({
      tipo_de_atividade: 'Atividade',
      assunto: 'Funcionário adicionado',
      descricao: `Novo funcionário "${funcionario.nome}" foi cadastrado no sistema`,
      status: 'Concluído'
    });
  };

  const updatePedidoStatus = (id: number, status: Pedido['status']) => {
    setPedidos(prev => prev.map(p => p.idPedidos === id ? { ...p, status } : p));
    const pedido = pedidos.find(p => p.idPedidos === id);
    addLog({
      tipo_de_atividade: 'Atividade',
      assunto: 'Status do pedido atualizado',
      descricao: `Pedido "${pedido?.numero}" teve status alterado para "${status}"`,
      status: 'Concluído'
    });
  };

  const updateOportunidadeStatus = (id: number, status: Oportunidade['status']) => {
    setOportunidades(prev => prev.map(o => o.idOportunidade === id ? { ...o, status } : o));
    const oportunidade = oportunidades.find(o => o.idOportunidade === id);
    addLog({
      tipo_de_atividade: 'Atividade',
      assunto: 'Status da oportunidade atualizado',
      descricao: `Oportunidade "${oportunidade?.nome_da_oportunidade}" avançou para "${status}"`,
      status: 'Concluído'
    });
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      currentUser,
      login,
      logout,
      logs,
      addLog,
      clientes,
      oportunidades,
      pedidos,
      produtos,
      funcionarios,
      addCliente,
      addOportunidade,
      addPedido,
      addProduto,
      addFuncionario,
      updatePedidoStatus,
      updateOportunidadeStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
