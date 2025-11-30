// src/types/api.ts

// --- ENUMS (Devem bater com o Java) ---
export type NivelAcesso = 'ADMINISTRADOR' | 'GERENTE' | 'PADRAO';
export type EstagioFunil = 'PROSPECCAO' | 'QUALIFICACAO' | 'PROPOSTA' | 'NEGOCIACAO' | 'FECHADA' | 'PERDIDA';
export type StatusPedido = 'PENDENTE' | 'CONFIRMADO' | 'PRODUCAO' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';

// --- INTERFACES (Modelos de Dados) ---

export interface Contato {
  idContato?: number;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
  numeroCasa: string;
  telefone: string;
  email: string;
}

export interface Usuario {
  idUsuario?: number;
  email: string;
  senha?: string;
  nivelAcesso: NivelAcesso;
  contato?: Contato;
}

// Login DTO
export interface LoginDTO {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

export interface Cliente {
  idCliente?: number;
  cnpj: string; // Java: CNPJ
  nomeDoComercio: string; // Java: nomeDoComercio
  email: string;
  usuario?: Usuario;
  // oportunidades?: Oportunidade[]; // Opcional para evitar ciclo infinito
}

export interface Funcionario {
  idFuncionario?: number;
  nome: string;
  cpf: string;
  cargo: string;
  email: string;
  usuario?: Usuario;
}

export interface Oportunidade {
  idOportunidade?: number;
  nomeOportunidade: string; // Java: nomeOportunidade
  valorEstimado: number;
  estagioFunil: EstagioFunil;
  dataDeFechamentoEstimada: string; // LocalDate vem como string ISO "2023-01-01"
  cliente?: Cliente;
}

export interface Produto {
  idProduto?: number;
  nome: string;
  descricao: string;
  tipo: number; // Java espera int (1, 2, 3...)
  tamanho: number; // Java espera double
  valor: number; // Java espera float
  quantidadeEstoque: number;
  Material: string; // Java: Material (com M maiúsculo)
}

// IDs compostos são complexos, vamos simplificar na interface de visualização
export interface ProdutoPedido {
  // O Java devolve um objeto id: { idPedido: x, idProduto: y }
  id?: {
    idPedido: number;
    idProduto: number;
  };
  produto?: Produto;
  quantidade: number;
  pedra?: string;
  tamanho: string;
  valor: number;
}

export interface Pedido {
  idPedido?: number;
  data: string; // LocalDate
  valorTotal: number;
  status: StatusPedido;
  oportunidade?: Oportunidade;
  itens?: ProdutoPedido[];
}

export interface Log {
  idLog?: number;
  titulo: string;
  tipoDeAtividade: number;
  assunto: string;
  descricao: string;
  data: string; // LocalDateTime
  usuario?: Usuario;
}

// --- CONSTANTES PARA LABEL (Visualização) ---

export const ESTAGIO_FUNIL_LABELS: Record<string, string> = {
  PROSPECCAO : 'Prospecção',
  QUALIFICACAO: 'Qualificação',
  PROPOSTA: 'Proposta',
  NEGOCIACAO: 'Negociação',
  FECHADA: 'Fechada',
  PERDIDA: 'Perdida',
};

export const STATUS_PEDIDO_LABELS: Record<string, string> = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  PRODUCAO: 'Em Produção',
  PAGO: 'Pago',
  ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
};

export const TIPO_ATIVIDADE_LABELS: Record<number, string> = {
  1: 'Reunião',
  2: 'Ligação',
  3: 'Email',
  4: 'Sistema',
  5: 'Outro'
};