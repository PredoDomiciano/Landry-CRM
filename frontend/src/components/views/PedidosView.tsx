import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockPedidos, mockClientes, mockProdutos, Pedido } from '@/data/mockData';
import { Search, Plus, Package, Calendar, DollarSign, Eye } from 'lucide-react';
import { PedidoForm } from '@/components/forms/PedidoForm';

const statusColors = {
  'pendente': '#f59e0b',
  'confirmado': '#3b82f6',
  'produção': '#8b5cf6',
  'enviado': '#10b981',
  'entregue': '#22c55e',
  'cancelado': '#ef4444'
};

export const PedidosView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pedidos, setPedidos] = useState(mockPedidos);
  const [showForm, setShowForm] = useState(false);

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = pedido.numero.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pedido.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getClienteName = (clienteId: number) => {
    const cliente = mockClientes.find(c => c.idCliente === clienteId);
    return cliente?.nome_do_comercio || 'Cliente não encontrado';
  };

  const getProdutoNome = (produtoId: number) => {
    const produto = mockProdutos.find(p => p.idProduto === produtoId);
    return produto?.nome || 'Produto não encontrado';
  };

  const statusCounts = pedidos.reduce((acc, pedido) => {
    acc[pedido.status] = (acc[pedido.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = pedidos.reduce((sum, pedido) => sum + pedido.valorTotal, 0);

  const handleAddPedido = (novoPedido: Omit<Pedido, 'idPedidos'>) => {
    const pedido: Pedido = {
      ...novoPedido,
      idPedidos: Math.max(...pedidos.map(p => p.idPedidos)) + 1
    };
    setPedidos([...pedidos, pedido]);
  };

  return (
    <div className="p-6 space-y-6">
      <PedidoForm 
        open={showForm} 
        onOpenChange={setShowForm} 
        onSubmit={handleAddPedido} 
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pedidos</h1>
          <p className="text-muted-foreground">Gerencie todos os pedidos de joias</p>
        </div>
        <Button 
          className="bg-accent-gold text-accent-gold-foreground hover:bg-accent-gold/90"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar pedidos..."
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
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="confirmado">Confirmado</SelectItem>
            <SelectItem value="produção">Produção</SelectItem>
            <SelectItem value="enviado">Enviado</SelectItem>
            <SelectItem value="entregue">Entregue</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent-gold/20 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-accent-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pedidos.length}</p>
                <p className="text-xs text-muted-foreground">Total Pedidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusCounts['confirmado'] + statusCounts['produção'] || 0}</p>
                <p className="text-xs text-muted-foreground">Em Andamento</p>
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
                <p className="text-xs text-muted-foreground">Valor Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusCounts['entregue'] || 0}</p>
                <p className="text-xs text-muted-foreground">Entregues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Pedidos</CardTitle>
          <CardDescription>Distribuição dos pedidos por status</CardDescription>
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

      {/* Orders List */}
      <div className="space-y-4">
        {filteredPedidos.map((pedido) => (
          <Card key={pedido.idPedidos} className="shadow-elegant hover:shadow-glow transition-smooth">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{pedido.numero}</CardTitle>
                  <CardDescription>
                    {getClienteName(pedido.clienteId)} • {new Date(pedido.data).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="secondary"
                    style={{ 
                      backgroundColor: `${statusColors[pedido.status as keyof typeof statusColors]}20`,
                      color: statusColors[pedido.status as keyof typeof statusColors],
                      border: `1px solid ${statusColors[pedido.status as keyof typeof statusColors]}40`
                    }}
                  >
                    {pedido.status}
                  </Badge>
                  <span className="text-lg font-bold text-accent-gold">
                    R$ {pedido.valorTotal.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Produtos do Pedido */}
                <div>
                  <h4 className="font-medium mb-3 text-sm text-muted-foreground">Produtos</h4>
                  <div className="space-y-2">
                    {pedido.produtos.map((produto, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-surface-variant rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{getProdutoNome(produto.idProdutos)}</p>
                          <p className="text-xs text-muted-foreground">
                            Qtd: {produto.quantidade} • Preço unitário: R$ {produto.preco.toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <p className="text-sm font-bold">
                          R$ {produto.valorPedido.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Informações do Pedido */}
                <div>
                  <h4 className="font-medium mb-3 text-sm text-muted-foreground">Detalhes</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Data do Pedido</span>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                        {new Date(pedido.data).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Número de Itens</span>
                      <span className="text-sm font-medium">{pedido.produtos.length} produto(s)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Valor Total</span>
                      <span className="text-sm font-bold text-accent-gold">
                        R$ {pedido.valorTotal.toLocaleString('pt-BR')}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      <Button variant="outline" size="sm">
                        Atualizar Status
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPedidos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum pedido encontrado</p>
        </div>
      )}
    </div>
  );
};