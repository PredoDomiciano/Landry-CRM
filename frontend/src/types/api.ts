export const API_BASE_URL = 'http://localhost:8080';

// --- ENUMS DO JAVA (Têm de ser iguais ao Backend) ---

export type NivelAcesso = 'ADMINISTRADOR' | 'GERENTE' | 'PADRAO';
export type EstagioFunil = 'PROSPECCAO' | 'QUALIFICACAO' | 'PROPOSTA' | 'NEGOCIACAO' | 'FECHADA' | 'PERDIDA';
export type StatusPedido = 'PENDENTE' | 'CONFIRMADO' | 'PRODUCAO' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';

// Novos Enums de Produto
export type Material = 'PRATA_925';
export type TipoPedra = 'ZIRCONIA' | 'CRISTAL' | 'SEM_PEDRA';
export type Tamanho = 
  | 'ARO_12' | 'ARO_13' | 'ARO_14' | 'ARO_15' | 'ARO_16' | 'ARO_17' | 'ARO_18' | 'ARO_19' | 'ARO_20' | 'ARO_21' | 'ARO_22' | 'ARO_23' | 'ARO_24' | 'ARO_25' | 'ARO_26'
  | 'CM_40' | 'CM_45' | 'CM_50' | 'CM_60' | 'CM_70'
  | 'MM_8' | 'MM_10' | 'MM_12'
  | 'UNICO' | 'PERSONALIZADO';

export type Cargo = 
  | 'SETOR_COMERCIAL' | 'MODELAGEM' | 'INJECAO_DE_CERA' | 'CRAVACAO' | 'POLIMENTO' 
  | 'ACABAMENTO' | 'FUNDICAO' | 'SOLDAGEM' | 'BANHO' | 'CONTROLE_DE_QUALIDADE' | 'ADMINISTRADOR';

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
  user?: Usuario; // Adicionado user opcional para corrigir erro de login
}

export interface Cliente {
  idCliente?: number;
  // Campos antigos (mantidos para compatibilidade durante migração)
  cnpj?: string; 
  nomeDoComercio?: string; 
  // Campos novos (padrão)
  nome: string; 
  cpf?: string;
  email: string;
  telefone?: string;
  usuario?: Usuario;
  contato?: Contato; // Relacionamento novo
}

export interface Funcionario {
  idFuncionario?: number;
  nome: string;
  cpf: string;
  cargo: Cargo | string; // Aceita string para flexibilidade no frontend
  email: string;
  usuario?: Usuario;
  contato?: Contato;
}

export interface Oportunidade {
  idOportunidade?: number;
  nomeOportunidade: string;
  valorEstimado: number;
  estagioFunil: EstagioFunil;
  dataDeFechamentoEstimada: string;
  cliente?: Cliente;
}

export interface Produto {
  idProduto?: number;
  nome: string;
  descricao: string;
  tipo: number | string; // Flexível para int (backend) ou string (select)
  
  // Novos campos de enum
  tamanho: Tamanho | string; 
  tamanhoPersonalizado?: string;
  material: Material | string;
  tipoPedra: TipoPedra | string;
  corPedra?: string;
  
  valor: number;
  quantidadeEstoque: number;
}

export interface ProdutoPedido {
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
  data: string;
  valorTotal: number;
  status: StatusPedido;
  oportunidade?: Oportunidade;
  itens?: ProdutoPedido[];
}

export interface Log {
  idLog?: number;
  titulo: string;
  tipoDeAtividade: number;
  assunto?: string; // Opcional
  descricao: string;
  data: string; 
  usuario?: { email: string } | Usuario; // Flexível para receber objeto completo ou parcial
}

// --- MAPAS DE TRADUÇÃO (Para mostrar bonito na tela) ---

export const TAMANHO_LABELS: Record<string, string> = {
  'ARO_12': 'Anel - 12', 'ARO_13': 'Anel - 13', 'ARO_14': 'Anel - 14',
  'ARO_15': 'Anel - 15', 'ARO_16': 'Anel - 16', 'ARO_17': 'Anel - 17',
  'ARO_18': 'Anel - 18', 'ARO_19': 'Anel - 19', 'ARO_20': 'Anel - 20',
  'ARO_21': 'Anel - 21', 'ARO_22': 'Anel - 22', 'ARO_23': 'Anel - 23',
  'ARO_24': 'Anel - 24', 'ARO_25': 'Anel - 25', 'ARO_26': 'Anel - 26',
  'CM_40': 'Colar - 40cm', 'CM_45': 'Colar - 45cm', 'CM_50': 'Colar - 50cm',
  'CM_60': 'Colar - 60cm', 'CM_70': 'Colar - 70cm',
  'MM_8': 'Argola - 8mm', 'MM_10': 'Argola - 10mm', 'MM_12': 'Argola - 12mm',
  'UNICO': 'Tamanho Único',
  'PERSONALIZADO': 'Personalizado'
};

export const MATERIAL_LABELS: Record<string, string> = {
  'PRATA_925': 'Prata 925'
};

export const PEDRA_LABELS: Record<string, string> = {
  'ZIRCONIA': 'Zircônia',
  'CRISTAL': 'Cristal',
  'SEM_PEDRA': 'Sem Pedra'
};

export const CARGO_LABELS: Record<string, string> = {
  'SETOR_COMERCIAL': 'Comercial',
  'MODELAGEM': 'Modelagem 3D',
  'INJECAO_DE_CERA': 'Injeção de Cera',
  'CRAVACAO': 'Cravação',
  'POLIMENTO': 'Polimento',
  'ACABAMENTO': 'Acabamento',
  'FUNDICAO': 'Fundição',
  'SOLDAGEM': 'Soldagem',
  'BANHO': 'Banho',
  'CONTROLE_DE_QUALIDADE': 'Qualidade',
  'ADMINISTRADOR': 'Administração'
};

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
  4: 'Sistema' 
};