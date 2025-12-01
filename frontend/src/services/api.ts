import { API_BASE_URL } from '../types/api';
import type { 
  Cliente, Funcionario, Log, Oportunidade, Pedido, Produto, Usuario, 
  LoginDTO, LoginResponse 
} from '../types/api';

// Definição dos endpoints
export const API_ENDPOINTS = {
  auth: `${API_BASE_URL}/auth`,
  login: `${API_BASE_URL}/auth/login`,
  clientes: `${API_BASE_URL}/clientes`,
  produtos: `${API_BASE_URL}/produtos`,
  pedidos: `${API_BASE_URL}/pedidos`,
  produtopedido: `${API_BASE_URL}/produtopedido`,
  funcionarios: `${API_BASE_URL}/funcionarios`,
  logs: `${API_BASE_URL}/logs`,
  usuarios: `${API_BASE_URL}/usuarios`,
  contatos: `${API_BASE_URL}/Contatos`,
  oportunidades: `${API_BASE_URL}/oportunidades`,
};

// Função genérica para chamadas API
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers as any || {}),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(url, { ...options, headers });

    // Tratamento de erros de autenticação
    if (response.status === 401) {
      console.warn("Token expirado ou inválido.");
      localStorage.removeItem('token');
      // Opcional: window.location.href = '/login'; 
      throw new Error("Sessão expirada.");
    }
    if (response.status === 403) {
      console.warn("Acesso negado.");
      throw new Error("Sem permissão para realizar esta ação.");
    }
    
    // Tratamento de erros gerais
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro API (${response.status}):`, errorText);
      throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
    }

    // Tenta fazer parse do JSON, se vazio retorna null
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error(`Erro na requisição para ${url}:`, error);
    throw error;
  }
}

// --- API DE AUTENTICAÇÃO ---
export const authApi = {
  login: (credentials: LoginDTO) => fetchApi<LoginResponse>(API_ENDPOINTS.login, { method: 'POST', body: JSON.stringify(credentials) }),
};

// --- API DE CLIENTES (REAL) ---
export const clienteApi = {
  getAll: () => fetchApi<Cliente[]>(API_ENDPOINTS.clientes),
  getById: (id: number) => fetchApi<Cliente>(`${API_ENDPOINTS.clientes}/${id}`),
  
  create: (c: Partial<Cliente>) => {
      // Ajuste fino para garantir que dados vão limpos
      console.log("Enviando cliente para API:", JSON.stringify(c, null, 2));
      return fetchApi<Cliente>(API_ENDPOINTS.clientes, { method: 'POST', body: JSON.stringify(c) });
  },
  
  update: (id: number, c: Partial<Cliente>) => {
      return fetchApi<Cliente>(`${API_ENDPOINTS.clientes}/${id}`, { method: 'PUT', body: JSON.stringify(c) });
  },
  
  delete: (id: number) => fetchApi<void>(`${API_ENDPOINTS.clientes}/${id}`, { method: 'DELETE' }),
};

// --- MOCK LOCAL PARA PRODUTOS ---
// Mantido local para testes de lógica de frontend
let localProdutos: Produto[] = [
  { idProduto: 1, nome: 'Anel Solitário Prata', descricao: 'Anel clássico', tipo: 1, valor: 150.00, quantidadeEstoque: 10, material: 'PRATA_925', tipoPedra: 'ZIRCONIA', tamanho: 'ARO_16' },
  { idProduto: 2, nome: 'Colar Ponto de Luz', descricao: 'Corrente veneziana', tipo: 2, valor: 89.90, quantidadeEstoque: 5, material: 'PRATA_925', tipoPedra: 'CRISTAL', tamanho: 'CM_45' },
  { idProduto: 3, nome: 'Brinco Argola', descricao: 'Argola lisa', tipo: 3, valor: 45.00, quantidadeEstoque: 2, material: 'PRATA_925', tipoPedra: 'SEM_PEDRA', tamanho: 'MM_10' }
];

export const produtoApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...localProdutos]; },
  create: async (p: Partial<Produto>) => { await new Promise(r => setTimeout(r, 200)); const n = { ...p, idProduto: Date.now() } as Produto; localProdutos.push(n); return n; },
  update: async (id: number, p: Partial<Produto>) => { await new Promise(r => setTimeout(r, 200)); localProdutos = localProdutos.map(x => x.idProduto === id ? { ...x, ...p } : x); return localProdutos.find(x => x.idProduto === id) as Produto; },
  delete: async (id: number) => { await new Promise(r => setTimeout(r, 200)); localProdutos = localProdutos.filter(x => x.idProduto !== id); },
};

// --- MOCK LOCAL PARA PEDIDOS ---
let localPedidos: Pedido[] = [];

export const pedidoApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 300)); return [...localPedidos]; },
  create: async (p: Partial<Pedido>) => { await new Promise(r => setTimeout(r, 300)); const n = { ...p, idPedido: Math.floor(Math.random() * 10000) } as Pedido; localPedidos.push(n); return n; },
  update: async (id: number, p: Partial<Pedido>) => { await new Promise(r => setTimeout(r, 300)); localPedidos = localPedidos.map(x => x.idPedido === id ? { ...x, ...p } : x); return localPedidos.find(x => x.idPedido === id) as Pedido; },
  delete: async (id: number) => { await new Promise(r => setTimeout(r, 300)); localPedidos = localPedidos.filter(x => x.idPedido !== id); },
};

// --- MOCK LOCAL PARA OPORTUNIDADES ---
let localOportunidades: Oportunidade[] = [
  { 
     idOportunidade: 1, 
     nomeOportunidade: 'Venda Anel Noivado', 
     valorEstimado: 5000, 
     estagioFunil: 'NEGOCIACAO', 
     dataDeFechamentoEstimada: '2025-12-25',
     cliente: { idCliente: 99, nome: 'João Silva', email: 'joao@teste.com' } as Cliente 
  }
];

export const oportunidadeApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...localOportunidades]; },
  create: async (op: Partial<Oportunidade>) => { await new Promise(r => setTimeout(r, 200)); const n = { ...op, idOportunidade: Date.now() } as Oportunidade; localOportunidades.push(n); return n; },
  update: async (id: number, op: Partial<Oportunidade>) => { await new Promise(r => setTimeout(r, 200)); localOportunidades = localOportunidades.map(x => x.idOportunidade === id ? { ...x, ...op } : x); return localOportunidades.find(x => x.idOportunidade === id) as Oportunidade; },
  delete: async (id: number) => { await new Promise(r => setTimeout(r, 200)); localOportunidades = localOportunidades.filter(x => x.idOportunidade !== id); },
};

// --- MOCK LOCAL PARA LOGS ---
let localLogs: Log[] = [];

export const logApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...localLogs]; },
  create: async (l: Partial<Log>) => { await new Promise(r => setTimeout(r, 200)); const n = { ...l, idLog: Date.now() } as Log; localLogs.push(n); return n; },
};

// --- API DE FUNCIONÁRIOS (REAL) ---
export const funcionarioApi = {
  getAll: () => fetchApi<Funcionario[]>(API_ENDPOINTS.funcionarios),
  create: (f: Partial<Funcionario>) => fetchApi<Funcionario>(API_ENDPOINTS.funcionarios, { method: 'POST', body: JSON.stringify(f) }),
  update: (id: number, f: Partial<Funcionario>) => fetchApi<Funcionario>(`${API_ENDPOINTS.funcionarios}/${id}`, { method: 'PUT', body: JSON.stringify(f) }),
  delete: (id: number) => fetchApi<void>(`${API_ENDPOINTS.funcionarios}/${id}`, { method: 'DELETE' }),
};

// --- API DE USUÁRIOS (REAL) ---
export const usuarioApi = {
  getAll: () => fetchApi<Usuario[]>(API_ENDPOINTS.usuarios),
};