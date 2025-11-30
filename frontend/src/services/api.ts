// src/services/api.ts
import { API_BASE_URL } from '@/config/api'; // Certifica-te que criaste este arquivo simples com a URL http://localhost:8080
import type { 
  Cliente, Funcionario, Log, Oportunidade, Pedido, Produto, Usuario, 
  LoginDTO, LoginResponse 
} from '@/types/api';

// Mapeamento exato das rotas do Controller Java
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
  contatos: `${API_BASE_URL}/Contatos`, // Atenção: Teu Java usa Maiúscula aqui
  oportunidades: `${API_BASE_URL}/oportunidades`,
};

// --- FUNÇÃO CORE DE FETCH (Com Token) ---
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers as any || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 403 || response.status === 401) {
      console.warn("Acesso negado ou token expirado.");
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erro HTTP! Status: ${response.status}`);
    }

    // Verifica se há conteúdo antes de fazer parse do JSON
    const text = await response.text();
    return text ? JSON.parse(text) : null;
    
  } catch (error) {
    console.error(`Erro na requisição para ${url}:`, error);
    throw error;
  }
}

// --- SERVIÇOS EXPORTADOS ---

export const authApi = {
  login: (credentials: LoginDTO) => 
    fetchApi<LoginResponse>(API_ENDPOINTS.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};

export const clienteApi = {
  getAll: () => fetchApi<Cliente[]>(API_ENDPOINTS.clientes),
  getById: (id: number) => fetchApi<Cliente>(`${API_ENDPOINTS.clientes}/${id}`),
  create: (cliente: Partial<Cliente>) => 
    fetchApi<Cliente>(API_ENDPOINTS.clientes, { method: 'POST', body: JSON.stringify(cliente) }),
  update: (id: number, cliente: Partial<Cliente>) =>
    fetchApi<Cliente>(`${API_ENDPOINTS.clientes}/${id}`, { method: 'PUT', body: JSON.stringify(cliente) }),
  delete: (id: number) =>
    fetchApi<void>(`${API_ENDPOINTS.clientes}/${id}`, { method: 'DELETE' }),
};

export const produtoApi = {
  getAll: () => fetchApi<Produto[]>(API_ENDPOINTS.produtos),
  create: (produto: Partial<Produto>) => 
    fetchApi<Produto>(API_ENDPOINTS.produtos, { method: 'POST', body: JSON.stringify(produto) }),
  update: (id: number, produto: Partial<Produto>) => 
    fetchApi<Produto>(`${API_ENDPOINTS.produtos}/${id}`, { method: 'PUT', body: JSON.stringify(produto) }),
  delete: (id: number) => 
    fetchApi<void>(`${API_ENDPOINTS.produtos}/${id}`, { method: 'DELETE' }),
};

export const pedidoApi = {
  getAll: () => fetchApi<Pedido[]>(API_ENDPOINTS.pedidos),
  create: (pedido: Partial<Pedido>) => 
    fetchApi<Pedido>(API_ENDPOINTS.pedidos, { method: 'POST', body: JSON.stringify(pedido) }),
  update: (id: number, pedido: Partial<Pedido>) => 
    fetchApi<Pedido>(`${API_ENDPOINTS.pedidos}/${id}`, { method: 'PUT', body: JSON.stringify(pedido) }),
  delete: (id: number) => 
    fetchApi<void>(`${API_ENDPOINTS.pedidos}/${id}`, { method: 'DELETE' }),
};

export const oportunidadeApi = {
  getAll: () => fetchApi<Oportunidade[]>(API_ENDPOINTS.oportunidades),
  create: (op: Partial<Oportunidade>) => 
    fetchApi<Oportunidade>(API_ENDPOINTS.oportunidades, { method: 'POST', body: JSON.stringify(op) }),
  update: (id: number, op: Partial<Oportunidade>) => 
    fetchApi<Oportunidade>(`${API_ENDPOINTS.oportunidades}/${id}`, { method: 'PUT', body: JSON.stringify(op) }),
};

export const funcionarioApi = {
  getAll: () => fetchApi<Funcionario[]>(API_ENDPOINTS.funcionarios),
  create: (func: Partial<Funcionario>) => 
    fetchApi<Funcionario>(API_ENDPOINTS.funcionarios, { method: 'POST', body: JSON.stringify(func) }),
  delete: (id: number) => 
    fetchApi<void>(`${API_ENDPOINTS.funcionarios}/${id}`, { method: 'DELETE' }),
};

export const logApi = {
  getAll: () => fetchApi<Log[]>(API_ENDPOINTS.logs),
  create: (log: Partial<Log>) => 
    fetchApi<Log>(API_ENDPOINTS.logs, { method: 'POST', body: JSON.stringify(log) }),
};

export const usuarioApi = {
  getAll: () => fetchApi<Usuario[]>(API_ENDPOINTS.usuarios),
};