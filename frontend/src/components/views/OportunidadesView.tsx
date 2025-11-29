import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Oportunidade } from '@/data/mockData';
import { Search, Plus, Calendar, DollarSign, Target, TrendingUp, ChevronRight } from 'lucide-react';
import { OportunidadeForm } from '@/components/forms/OportunidadeForm';
import { useApp } from '@/contexts/AppContext';

const statusColors = {
  'prospecção': '#94a3b8',
  'qualificação': '#3b82f6', 
  'proposta': '#f59e0b',
  'negociação': '#10b981',
  'fechada': '#22c55e',
  'perdida': '#ef4444'
};

export const OportunidadesView = () => {
  const { oportunidades, clientes, addOportunidade, updateOportunidadeStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const filteredOportunidades = oportunidades.filter(oportunidade => {
    const matchesSearch = oportunidade.nome_da_oportunidade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || oportunidade.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddOportunidade = (novaOportunidade: Omit<Oportunidade, 'idOportunidade'>) => {
    addOportunidade(novaOportunidade);
    setShowForm(false);
  };

  const handleAvancarStatus = (id: number, statusAtual: Oportunidade['status']) => {
    const statusOrder: Oportunidade['status'][] = ['prospecção', 'qualificação', 'proposta', 'negociação', 'fechada'];
    const currentIndex = statusOrder.indexOf(statusAtual);
    if (currentIndex < statusOrder.length - 1) {
      updateOportunidadeStatus(id, statusOrder[currentIndex + 1]);
    }
  };

  const getClienteName = (clienteId: number) => {
    const cliente = clientes.find(c => c.idCliente === clienteId);
    return cliente?.nome_do_comercio || 'Cliente não encontrado';
  };

  const statusCounts = oportunidades.reduce((acc, op) => {
    acc[op.status] = (acc[op.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = oportunidades.reduce((sum, op) => sum + op.valor_estimado, 0);

  return (
    <div className="p-6 space-y-6">
      <OportunidadeForm 
        open={showForm} 
        onOpenChange={setShowForm} 
        onSubmit={handleAddOportunidade} 
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Oportunidades</h1>
          <p className="text-muted-foreground">Gerencie seu funil de vendas</p>
        </div>
        <Button 
          className="bg-accent-gold text-accent-gold-foreground hover:bg-accent-gold/90"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Oportunidade
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar oportunidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="prospecção">Prospecção</SelectItem>
            <SelectItem value="qualificação">Qualificação</SelectItem>
            <SelectItem value="proposta">Proposta</SelectItem>
            <SelectItem value="negociação">Negociação</SelectItem>
            <SelectItem value="fechada">Fechada</SelectItem>
            <SelectItem value="perdida">Perdida</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent-gold/20 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-accent-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{oportunidades.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(statusCounts['qualificação'] || 0) + (statusCounts['proposta'] || 0) + (statusCounts['negociação'] || 0)}</p>
                <p className="text-xs text-muted-foreground">Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">R$ {totalValue.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-muted-foreground">Valor Pipeline</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusCounts['fechada'] || 0}</p>
                <p className="text-xs text-muted-foreground">Fechadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Vendas</CardTitle>
          <CardDescription>Distribuição das oportunidades por estágio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: statusColors[status as keyof typeof statusColors] }}
                />
                <span className="text-sm font-medium capitalize">{status}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOportunidades.map((oportunidade) => (
          <Card key={oportunidade.idOportunidade} className="shadow-elegant hover:shadow-glow transition-smooth">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight">
                    {oportunidade.nome_da_oportunidade}
                  </CardTitle>
                  <CardDescription>
                    {getClienteName(oportunidade.clienteId)}
                  </CardDescription>
                </div>
                <Badge 
                  variant="secondary"
                  style={{ 
                    backgroundColor: `${statusColors[oportunidade.status as keyof typeof statusColors]}20`,
                    color: statusColors[oportunidade.status as keyof typeof statusColors],
                    border: `1px solid ${statusColors[oportunidade.status as keyof typeof statusColors]}40`
                  }}
                >
                  {oportunidade.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Valor */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Valor Estimado</span>
                <span className="text-lg font-bold text-accent-gold">
                  R$ {oportunidade.valor_estimado.toLocaleString('pt-BR')}
                </span>
              </div>

              {/* Data de fechamento */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fechamento Previsto</span>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                  {new Date(oportunidade.data_de_fechamento_estimada).toLocaleDateString('pt-BR')}
                </div>
              </div>

              {/* Funil */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estágio do Funil</span>
                <span className="text-sm font-medium">{oportunidade.versao_do_funil}</span>
              </div>

              {/* Progress bar baseado no status */}
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all"
                  style={{ 
                    backgroundColor: statusColors[oportunidade.status as keyof typeof statusColors],
                    width: oportunidade.status === 'prospecção' ? '20%' :
                           oportunidade.status === 'qualificação' ? '40%' :
                           oportunidade.status === 'proposta' ? '60%' :
                           oportunidade.status === 'negociação' ? '80%' :
                           oportunidade.status === 'fechada' ? '100%' : '10%'
                  }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Detalhes
                </Button>
                {oportunidade.status !== 'fechada' && oportunidade.status !== 'perdida' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-accent-gold/10 border-accent-gold/30 text-accent-gold hover:bg-accent-gold/20"
                    onClick={() => handleAvancarStatus(oportunidade.idOportunidade, oportunidade.status)}
                  >
                    <ChevronRight className="w-4 h-4" />
                    Avançar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOportunidades.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma oportunidade encontrada</p>
        </div>
      )}
    </div>
  );
};
