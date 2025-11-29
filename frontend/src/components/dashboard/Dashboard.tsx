import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { getMonthlyRevenue } from '@/data/mockData';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  Package,
  Calendar,
  Target,
  Award
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

const statusColors = {
  'prospecção': '#94a3b8',
  'qualificação': '#3b82f6', 
  'proposta': '#f59e0b',
  'negociação': '#10b981',
  'fechada': '#22c55e',
  'perdida': '#ef4444'
};

export const Dashboard = () => {
  const { clientes, oportunidades, pedidos } = useApp();
  
  const totalOportunidades = oportunidades.length;
  const totalClientes = clientes.length;
  const totalPedidos = pedidos.length;
  const valorTotalOportunidades = oportunidades.reduce((sum, op) => sum + op.valor_estimado, 0);
  const valorTotalPedidos = pedidos.reduce((sum, pedido) => sum + pedido.valorTotal, 0);
  
  const oportunidadesPorStatus = oportunidades.reduce((acc, op) => {
    acc[op.status] = (acc[op.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const revenueData = getMonthlyRevenue();

  const pieData = Object.entries(oportunidadesPorStatus).map(([status, count]) => ({
    name: status,
    value: count,
    color: statusColors[status as keyof typeof statusColors]
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu negócio de joias</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-accent-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              +2 novos este mês
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades Ativas</CardTitle>
            <Target className="h-4 w-4 text-accent-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOportunidades}</div>
            <p className="text-xs text-muted-foreground">
              R$ {valorTotalOportunidades.toLocaleString('pt-BR')} em pipeline
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Ativos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-accent-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPedidos}</div>
            <p className="text-xs text-muted-foreground">
              R$ {valorTotalPedidos.toLocaleString('pt-BR')} faturados
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-accent-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 68.000</div>
            <p className="text-xs text-success">
              +12.5% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-gold" />
              Receita Mensal
            </CardTitle>
            <CardDescription>
              Evolução da receita nos últimos 9 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--accent-gold))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--accent-gold))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-accent-gold" />
              Oportunidades por Status
            </CardTitle>
            <CardDescription>
              Distribuição das oportunidades no funil de vendas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [value, name]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(oportunidadesPorStatus).map(([status, count]) => (
                <Badge 
                  key={status} 
                  variant="secondary"
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${statusColors[status as keyof typeof statusColors]}20`,
                    color: statusColors[status as keyof typeof statusColors],
                    border: `1px solid ${statusColors[status as keyof typeof statusColors]}40`
                  }}
                >
                  {status}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-gold" />
              Principais Oportunidades
            </CardTitle>
            <CardDescription>Maiores oportunidades em aberto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {oportunidades
                .sort((a, b) => b.valor_estimado - a.valor_estimado)
                .slice(0, 4)
                .map((oportunidade) => (
                  <div key={oportunidade.idOportunidade} className="flex items-center justify-between p-3 rounded-lg bg-surface-variant">
                    <div>
                      <p className="font-medium text-sm">{oportunidade.nome_da_oportunidade}</p>
                      <p className="text-xs text-muted-foreground">
                        Fechamento: {new Date(oportunidade.data_de_fechamento_estimada).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">R$ {oportunidade.valor_estimado.toLocaleString('pt-BR')}</p>
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: `${statusColors[oportunidade.status as keyof typeof statusColors]}20`,
                          color: statusColors[oportunidade.status as keyof typeof statusColors]
                        }}
                      >
                        {oportunidade.status}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-accent-gold" />
              Pedidos Recentes
            </CardTitle>
            <CardDescription>Últimos pedidos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div key={pedido.idPedidos} className="flex items-center justify-between p-3 rounded-lg bg-surface-variant">
                  <div>
                    <p className="font-medium text-sm">{pedido.numero}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(pedido.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">R$ {pedido.valorTotal.toLocaleString('pt-BR')}</p>
                    <Badge 
                      variant={pedido.status === 'confirmado' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {pedido.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
