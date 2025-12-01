import { API_BASE_URL } from '@/types/api';
import type { 
  Cliente, Funcionario, Log, Oportunidade, Pedido, Produto, Usuario, 
  LoginDTO, LoginResponse 
} from '@/types/api';

// Mapeamento das rotas
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

// --- FUNÇÃO CORE DE FETCH ---
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers as any || {}),
  };
  
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) { 
        localStorage.removeItem('token'); 
        throw new Error("Sessão expirada. Faça login novamente."); 
    }
    if (response.status === 403) { throw new Error("Sem permissão."); }
    
    if (!response.ok) {
        // Tenta ler a mensagem de erro do backend, se houver
        const errorText = await response.text();
        throw new Error(errorText || `Erro HTTP: ${response.status}`);
    }

    // Se a resposta for vazia (ex: delete), retorna null
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error(`Erro na requisição para ${url}:`, error);
    throw error;
  }
}

// --- IMPLEMENTAÇÃO DAS APIS REAIS ---

export const authApi = {
  login: (credentials: LoginDTO) => fetchApi<LoginResponse>(API_ENDPOINTS.login, { method: 'POST', body: JSON.stringify(credentials) }),
};

export const clienteApi = {
  getAll: () => fetchApi<Cliente[]>(API_ENDPOINTS.clientes),
  getById: (id: number) => fetchApi<Cliente>(`${API_ENDPOINTS.clientes}/${id}`),
  create: (c: Partial<Cliente>) => fetchApi<Cliente>(API_ENDPOINTS.clientes, { method: 'POST', body: JSON.stringify(c) }),
  update: (id: number, c: Partial<Cliente>) => fetchApi<Cliente>(`${API_ENDPOINTS.clientes}/${id}`, { method: 'PUT', body: JSON.stringify(c) }),
  delete: (id: number) => fetchApi<void>(`${API_ENDPOINTS.clientes}/${id}`, { method: 'DELETE' }),
};

export const produtoApi = {
  getAll: () => fetchApi<Produto[]>(API_ENDPOINTS.produtos),
  create: (p: Partial<Produto>) => fetchApi<Produto>(API_ENDPOINTS.produtos, { method: 'POST', body: JSON.stringify(p) }),
  update: (id: number, p: Partial<Produto>) => fetchApi<Produto>(`${API_ENDPOINTS.produtos}/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  delete: (id: number) => fetchApi<void>(`${API_ENDPOINTS.produtos}/${id}`, { method: 'DELETE' }),
};

export const pedidoApi = {
  getAll: () => fetchApi<Pedido[]>(API_ENDPOINTS.pedidos),
  create: (p: Partial<Pedido>) => fetchApi<Pedido>(API_ENDPOINTS.pedidos, { method: 'POST', body: JSON.stringify(p) }),
  update: (id: number, p: Partial<Pedido>) => fetchApi<Pedido>(`${API_ENDPOINTS.pedidos}/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  delete: (id: number) => fetchApi<void>(`${API_ENDPOINTS.pedidos}/${id}`, { method: 'DELETE' }),
};

export const oportunidadeApi = {
  getAll: () => fetchApi<Oportunidade[]>(API_ENDPOINTS.oportunidades),
  create: (op: Partial<Oportunidade>) => fetchApi<Oportunidade>(API_ENDPOINTS.oportunidades, { method: 'POST', body: JSON.stringify(op) }),
  update: (id: number, op: Partial<Oportunidade>) => fetchApi<Oportunidade>(`${API_ENDPOINTS.oportunidades}/${id}`, { method: 'PUT', body: JSON.stringify(op) }),
  delete: (id: number) => fetchApi<void>(`${API_ENDPOINTS.oportunidades}/${id}`, { method: 'DELETE' }),
};

export const funcionarioApi = {
  getAll: () => fetchApi<Funcionario[]>(API_ENDPOINTS.funcionarios),
  create: (f: Partial<Funcionario>) => fetchApi<Funcionario>(API_ENDPOINTS.funcionarios, { method: 'POST', body: JSON.stringify(f) }),
  update: (id: number, f: Partial<Funcionario>) => fetchApi<Funcionario>(`${API_ENDPOINTS.funcionarios}/${id}`, { method: 'PUT', body: JSON.stringify(f) }),
  delete: (id: number) => fetchApi<void>(`${API_ENDPOINTS.funcionarios}/${id}`, { method: 'DELETE' }),
};

export const logApi = {
  getAll: () => fetchApi<Log[]>(API_ENDPOINTS.logs),
  create: (l: Partial<Log>) => fetchApi<Log>(API_ENDPOINTS.logs, { method: 'POST', body: JSON.stringify(l) }),
};

export const usuarioApi = {
  getAll: () => fetchApi<Usuario[]>(API_ENDPOINTS.usuarios),
};