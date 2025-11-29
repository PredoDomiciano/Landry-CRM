// Landry Joias CRM - Mock Data
// Centralized data source for easy maintenance

export interface Cliente {
  idCliente: number;
  nome_do_comercio: string;
  data: string;
  contato: Contato;
  oportunidades: number[]; // Array of opportunity IDs
}

export interface Contato {
  idContato: number;
  endereco: string;
  numero: string;
  email: string;
}

export interface Usuario {
  idUsuario: number;
  login: string;
  senha: string;
  nome: string;
  role: 'admin' | 'vendedor' | 'gerente';
}

export interface Funcionario {
  idFuncionario: number;
  nome: string;
  cpf: string;
  cargo: string;
  email: string;
}

export interface Oportunidade {
  idOportunidade: number;
  nome_da_oportunidade: string;
  valor_estimado: number;
  versao_do_funil: string;
  data_de_fechamento_estimada: string;
  status: 'prospecção' | 'qualificação' | 'proposta' | 'negociação' | 'fechada' | 'perdida';
  clienteId: number;
}

export interface Pedido {
  idPedidos: number;
  numero: string;
  data: string;
  valorTotal: number;
  status: 'pendente' | 'confirmado' | 'produção' | 'enviado' | 'entregue' | 'cancelado';
  clienteId: number;
  produtos: ProdutoPedido[];
}

export interface ProdutoPedido {
  idProdutos: number;
  idPedido: number;
  quantidade: number;
  preco: number;
  valorPedido: number;
}

export interface Produto {
  idProduto: number;
  nome: string;
  descricao: string;
  tipo: 'anel' | 'colar' | 'brinco' | 'pulseira' | 'conjunto';
  tamanho: string;
  valor: number;
  material: string;
  estoque: number;
}

export interface Log {
  idLog: number;
  tipo_de_atividade: string;
  assunto: string;
  descricao: string;
  data: string;
  status: string;
  usuarioId: number;
}

// Mock Data
export const mockClientes: Cliente[] = [
  {
    idCliente: 1,
    nome_do_comercio: "Joias Bella Vista",
    data: "2024-01-15",
    contato: {
      idContato: 1,
      endereco: "Rua das Flores, 123 - São Paulo/SP",
      numero: "+55 11 98765-4321",
      email: "contato@joiasbella.com.br"
    },
    oportunidades: [1, 2]
  },
  {
    idCliente: 2,
    nome_do_comercio: "Elegance Joalheria",
    data: "2024-02-10",
    contato: {
      idContato: 2,
      endereco: "Av. Paulista, 456 - São Paulo/SP",
      numero: "+55 11 97654-3210",
      email: "vendas@elegancejoias.com.br"
    },
    oportunidades: [3]
  },
  {
    idCliente: 3,
    nome_do_comercio: "Royal Diamonds",
    data: "2024-01-25",
    contato: {
      idContato: 3,
      endereco: "Shopping Center, Loja 89 - Rio de Janeiro/RJ",
      numero: "+55 21 98888-7777",
      email: "gerencia@royaldiamonds.com.br"
    },
    oportunidades: [4, 5]
  }
];

export const mockOportunidades: Oportunidade[] = [
  {
    idOportunidade: 1,
    nome_da_oportunidade: "Coleção Noivas Premium",
    valor_estimado: 45000,
    versao_do_funil: "Qualificação",
    data_de_fechamento_estimada: "2024-12-15",
    status: 'qualificação',
    clienteId: 1
  },
  {
    idOportunidade: 2,
    nome_da_oportunidade: "Linha Executiva Masculina",
    valor_estimado: 28000,
    versao_do_funil: "Proposta",
    data_de_fechamento_estimada: "2024-11-30",
    status: 'proposta',
    clienteId: 1
  },
  {
    idOportunidade: 3,
    nome_da_oportunidade: "Coleção Infantil Deluxe",
    valor_estimado: 15000,
    versao_do_funil: "Negociação",
    data_de_fechamento_estimada: "2024-10-20",
    status: 'negociação',
    clienteId: 2
  },
  {
    idOportunidade: 4,
    nome_da_oportunidade: "Joias Exclusivas Diamante",
    valor_estimado: 75000,
    versao_do_funil: "Prospecção",
    data_de_fechamento_estimada: "2025-01-15",
    status: 'prospecção',
    clienteId: 3
  },
  {
    idOportunidade: 5,
    nome_da_oportunidade: "Parceria Anual Premium",
    valor_estimado: 120000,
    versao_do_funil: "Qualificação",
    data_de_fechamento_estimada: "2024-12-31",
    status: 'qualificação',
    clienteId: 3
  }
];

export const mockProdutos: Produto[] = [
  {
    idProduto: 1,
    nome: "Anel Solitário Diamante 1ct",
    descricao: "Anel solitário em ouro branco 18k com diamante de 1 quilate",
    tipo: 'anel',
    tamanho: "Variados",
    valor: 8500,
    material: "Ouro Branco 18k + Diamante",
    estoque: 5
  },
  {
    idProduto: 2,
    nome: "Colar Pérolas Tahiti",
    descricao: "Colar de pérolas negras do Tahiti com fecho em ouro",
    tipo: 'colar',
    tamanho: "45cm",
    valor: 12000,
    material: "Pérolas + Ouro Amarelo 18k",
    estoque: 3
  },
  {
    idProduto: 3,
    nome: "Brincos Esmeralda Oval",
    descricao: "Par de brincos com esmeraldas ovais e diamantes",
    tipo: 'brinco',
    tamanho: "2cm",
    valor: 15500,
    material: "Ouro Branco 18k + Esmeraldas + Diamantes",
    estoque: 2
  },
  {
    idProduto: 4,
    nome: "Pulseira Tennis Diamantes",
    descricao: "Pulseira tennis com diamantes lapidação brilhante",
    tipo: 'pulseira',
    tamanho: "18cm",
    valor: 22000,
    material: "Ouro Branco 18k + Diamantes",
    estoque: 4
  }
];

export const mockPedidos: Pedido[] = [
  {
    idPedidos: 1,
    numero: "PED-2024-001",
    data: "2024-09-15",
    valorTotal: 25500,
    status: 'confirmado',
    clienteId: 1,
    produtos: [
      { idProdutos: 1, idPedido: 1, quantidade: 2, preco: 8500, valorPedido: 17000 },
      { idProdutos: 3, idPedido: 1, quantidade: 1, preco: 15500, valorPedido: 15500 }
    ]
  },
  {
    idPedidos: 2,
    numero: "PED-2024-002",
    data: "2024-09-10",
    valorTotal: 34000,
    status: 'produção',
    clienteId: 2,
    produtos: [
      { idProdutos: 2, idPedido: 2, quantidade: 1, preco: 12000, valorPedido: 12000 },
      { idProdutos: 4, idPedido: 2, quantidade: 1, preco: 22000, valorPedido: 22000 }
    ]
  }
];

export const mockFuncionarios: Funcionario[] = [
  {
    idFuncionario: 1,
    nome: "Ana Silva Santos",
    cpf: "123.456.789-00",
    cargo: "Gerente de Vendas",
    email: "ana.santos@landryjoias.com.br"
  },
  {
    idFuncionario: 2,
    nome: "Carlos Eduardo Lima",
    cpf: "987.654.321-00",
    cargo: "Consultor Senior",
    email: "carlos.lima@landryjoias.com.br"
  },
  {
    idFuncionario: 3,
    nome: "Mariana Costa Oliveira",
    cpf: "456.789.123-00",
    cargo: "Designer de Joias",
    email: "mariana.oliveira@landryjoias.com.br"
  }
];

export const mockLogs: Log[] = [
  {
    idLog: 1,
    tipo_de_atividade: "Reunião",
    assunto: "Apresentação nova coleção",
    descricao: "Reunião com cliente Joias Bella Vista para apresentar coleção noivas premium",
    data: "2024-09-07 14:30",
    status: "Concluído",
    usuarioId: 1
  },
  {
    idLog: 2,
    tipo_de_atividade: "Ligação",
    assunto: "Follow-up proposta",
    descricao: "Ligação de acompanhamento da proposta linha executiva masculina",
    data: "2024-09-06 10:15",
    status: "Pendente retorno",
    usuarioId: 2
  },
  {
    idLog: 3,
    tipo_de_atividade: "Email",
    assunto: "Envio catálogo digital",
    descricao: "Envio de catálogo digital coleção infantil deluxe para Elegance Joalheria",
    data: "2024-09-05 16:45",
    status: "Enviado",
    usuarioId: 1
  }
];

// Funções auxiliares para estatísticas
export const getOportunidadesByStatus = () => {
  const statusCount = mockOportunidades.reduce((acc, oportunidade) => {
    acc[oportunidade.status] = (acc[oportunidade.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return statusCount;
};

export const getTotalValueByStatus = () => {
  const statusValue = mockOportunidades.reduce((acc, oportunidade) => {
    acc[oportunidade.status] = (acc[oportunidade.status] || 0) + oportunidade.valor_estimado;
    return acc;
  }, {} as Record<string, number>);
  
  return statusValue;
};

export const getMonthlyRevenue = () => {
  // Simulated monthly data for charts
  return [
    { month: 'Jan', value: 45000 },
    { month: 'Fev', value: 52000 },
    { month: 'Mar', value: 48000 },
    { month: 'Abr', value: 61000 },
    { month: 'Mai', value: 55000 },
    { month: 'Jun', value: 67000 },
    { month: 'Jul', value: 59000 },
    { month: 'Ago', value: 73000 },
    { month: 'Set', value: 68000 }
  ];
};