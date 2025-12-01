import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext'; // Importação do contexto
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  Package,
  Calendar,
  Target,
  Award,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { ESTAGIO_FUNIL_LABELS, STATUS_PEDIDO_LABELS } from '@/types/api';

const COLORS = ['#eab308', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

export const Dashboard = () => {
  // CONEXÃO COM DADOS REAIS DO CONTEXTO
  const { clientes, pedidos, produtos, oportunidades, funcionarios } = useApp();

  // --- CÁLCULOS KPI (Indicadores Chave de Desempenho) ---
  
  // Receita Total (Soma dos pedidos confirmados/pagos/entregues/enviados)
  // Ignoramos Cancelados e Pendentes para receita realizada, mas depende da regra de negócio.
  // Aqui somamos tudo que não é cancelado para ter uma visão geral.
  const totalVendas = pedidos
    .filter(p => p.status !== 'CANCELADO')
    .reduce((acc, p) => acc + (p.valorTotal || 0), 0);
  
  const totalClientes = clientes.length;
  
  // Oportunidades "Ativas" (Não Fechadas nem Perdidas)
  const oportunidadesAtivas = oportunidades.filter(
    o => o.estagioFunil !== 'FECHADA' && o.estagioFunil !== 'PERDIDA'
  ).length;

  // Valor em Pipeline (Soma das oportunidades ativas)
  const valorEmPipeline = oportunidades
    .filter(o => o.estagioFunil !== 'FECHADA' && o.estagioFunil !== 'PERDIDA')
    .reduce((acc, o) => acc + (o.valorEstimado || 0), 0);

  // Alertas de Estoque
  const estoqueBaixo = produtos.filter(p => p.quantidadeEstoque > 0 && p.quantidadeEstoque < 5).length;
  const produtosSemEstoque = produtos.filter(p => p.quantidadeEstoque === 0).length;

  // --- PREPARAÇÃO DE DADOS PARA GRÁFICOS ---

  // 1. Gráfico de Vendas por Mês
  // Agrupa pedidos por mês (ex: "jan", "fev")
  const vendasPorMes = pedidos
    .filter(p => p.status !== 'CANCELADO')
    .reduce((acc: Record<string, number>, pedido) => {
      // Converte data YYYY-MM-DD para nome do mês
      const dataObj = new Date(pedido.data);
      if (!isNaN(dataObj.getTime())) {
          const mes = dataObj.toLocaleString('pt-BR', { month: 'short' }); // "jan", "fev"
          // Capitaliza a primeira letra (Jan, Fev)
          const mesFormatado = mes.charAt(0).toUpperCase() + mes.slice(1);
          
          acc[mesFormatado] = (acc[mesFormatado] || 0) + pedido.valorTotal;
      }
      return acc;
    }, {});

  // Transforma o objeto em array para o Recharts
  // Define uma ordem fixa de meses se quiser, ou usa a ordem que aparecer
  const chartData = Object.keys(vendasPorMes).map(mes => ({
    name: mes,
    total: vendasPorMes[mes]
  }));

  // Se não houver dados, mostra mock para o gráfico não ficar vazio
  const finalChartData = chartData.length > 0 ? chartData : [
    { name: 'Jan', total: 0 }, { name: 'Fev', total: 0 }, { name: 'Mar', total: 0 }
  ];

  // 2. Distribuição do Funil (Gráfico de Pizza)
  const funilCount = oportunidades.reduce((acc: Record<string, number>, op) => {
    const label = ESTAGIO_FUNIL_LABELS[op.estagioFunil] || op.estagioFunil;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(funilCount).map(key => ({
    name: key,
    value: funilCount[key]
  }));

  const finalPieData = pieData.length > 0 ? pieData : [{ name: 'Sem dados', value: 1 }];

  return (
    <div className="p-6 space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard Gerencial</h1>
        <p className="text-muted-foreground">Visão geral em tempo real da Landry Jóias.</p>
      </div>

      {/* --- SEÇÃO DE CARDS KPI --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Receita */}
        <Card className="shadow-sm border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
            <DollarSign className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">R$ {totalVendas.toLocaleString('pt-BR')}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span className="font-medium">Atualizado</span>
              <span className="text-muted-foreground ml-1">em tempo real</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Clientes */}
        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Base de Clientes</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalClientes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {clientes.length > 0 ? 'Clientes ativos cadastrados' : 'Nenhum cliente cadastrado'}
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Pipeline */}
        <Card className="shadow-sm border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pipeline de Vendas</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">R$ {valorEmPipeline.toLocaleString('pt-BR')}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {oportunidadesAtivas} oportunidades em aberto
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Estoque Alerta */}
        <Card className="shadow-sm border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alertas de Estoque</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estoqueBaixo + produtosSemEstoque}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {produtosSemEstoque} esgotados, {estoqueBaixo} baixo estoque
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- SEÇÃO DE GRÁFICOS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        
        {/* Gráfico Principal (Linha) - Ocupa 4 colunas */}
        <Card className="lg:col-span-4 shadow-md">
          <CardHeader>
            <CardTitle>Desempenho de Vendas</CardTitle>
            <CardDescription>Receita mensal acumulada (exclui cancelados)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={finalChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `R$${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Vendas']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#eab308" 
                    strokeWidth={3} 
                    dot={{ fill: '#eab308', strokeWidth: 2 }} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico Secundário (Pizza) - Ocupa 3 colunas */}
        <Card className="lg:col-span-3 shadow-md">
          <CardHeader>
            <CardTitle>Funil de Oportunidades</CardTitle>
            <CardDescription>Distribuição atual por estágio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={finalPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {finalPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value, 'Qtd']} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              {/* Texto central no Donut */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                <span className="text-2xl font-bold text-slate-800">{oportunidades.length}</span>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- LISTAS DE DETALHE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Lista de Pedidos Recentes */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-accent-gold" />
                  Pedidos Recentes
                </CardTitle>
                <CardDescription>Últimas transações registradas</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-normal">
                Últimos 5
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pedidos.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">Nenhum pedido encontrado.</div>
              ) : (
                // Ordenar por data (mais recente) e pegar top 5
                [...pedidos]
                  .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                  .slice(0, 5)
                  .map((pedido) => (
                  <div key={pedido.idPedido} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-900">Pedido #{pedido.idPedido}</p>
                        <p className="text-xs text-muted-foreground">
                          {pedido.data ? new Date(pedido.data).toLocaleDateString('pt-BR') : 'Data n/a'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-slate-800">
                        R$ {pedido.valorTotal ? pedido.valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2}) : '0,00'}
                      </p>
                      <Badge 
                        variant={pedido.status === 'CONFIRMADO' ? 'default' : 'secondary'}
                        className={`text-[10px] mt-1 ${pedido.status === 'CONFIRMADO' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}`}
                      >
                        {STATUS_PEDIDO_LABELS[pedido.status] || pedido.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Produtos em Destaque / Estoque */}
        <Card className="shadow-md">
          <CardHeader>
             <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  Top Produtos
                </CardTitle>
                <CardDescription>Itens com maior valor agregado</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {produtos.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">Nenhum produto cadastrado.</div>
              ) : (
                // Ordenar por valor (mais caros primeiro) e pegar top 5
                [...produtos].sort((a, b) => b.valor - a.valor).slice(0, 5).map((prod) => (
                  <div key={prod.idProduto} className="flex items-center gap-4 p-2 hover:bg-slate-50 rounded-md transition-colors">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                         <Package className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{prod.nome}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Estoque: <span className={prod.quantidadeEstoque < 5 ? "text-red-500 font-bold" : ""}>{prod.quantidadeEstoque}</span></span>
                          <span>•</span>
                          <span>{prod.material}</span>
                        </div>
                      </div>
                      <div className="font-bold text-sm text-slate-700 whitespace-nowrap">
                        R$ {prod.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                      </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};