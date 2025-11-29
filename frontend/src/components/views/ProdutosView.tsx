import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Produto } from '@/data/mockData';
import { Search, Plus, Package, DollarSign, Star, AlertTriangle } from 'lucide-react';
import { ProdutoForm } from '@/components/forms/ProdutoForm';
import { useApp } from '@/contexts/AppContext';

export const ProdutosView = () => {
  const { produtos, addProduto } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = tipoFilter === 'all' || produto.tipo === tipoFilter;
    return matchesSearch && matchesType;
  });

  const handleAddProduto = (novoProduto: Omit<Produto, 'idProduto'>) => {
    addProduto(novoProduto);
    setShowForm(false);
  };

  const getStockStatus = (estoque: number) => {
    if (estoque === 0) return { status: 'Sem estoque', color: 'destructive' };
    if (estoque <= 2) return { status: 'Estoque baixo', color: 'warning' };
    return { status: 'Em estoque', color: 'success' };
  };

  const totalProducts = produtos.length;
  const totalValue = produtos.reduce((sum, produto) => sum + (produto.valor * produto.estoque), 0);
  const lowStockCount = produtos.filter(p => p.estoque <= 2).length;
  const outOfStockCount = produtos.filter(p => p.estoque === 0).length;

  const tiposCounts = produtos.reduce((acc, produto) => {
    acc[produto.tipo] = (acc[produto.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      <ProdutoForm 
        open={showForm} 
        onOpenChange={setShowForm} 
        onSubmit={handleAddProduto} 
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seu catálogo de joias</p>
        </div>
        <Button 
          className="bg-accent-gold text-accent-gold-foreground hover:bg-accent-gold/90"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="anel">Anel</SelectItem>
            <SelectItem value="colar">Colar</SelectItem>
            <SelectItem value="brinco">Brinco</SelectItem>
            <SelectItem value="pulseira">Pulseira</SelectItem>
            <SelectItem value="conjunto">Conjunto</SelectItem>
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
                <p className="text-2xl font-bold">{totalProducts}</p>
                <p className="text-xs text-muted-foreground">Total Produtos</p>
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
                <p className="text-xs text-muted-foreground">Valor em Estoque</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{lowStockCount}</p>
                <p className="text-xs text-muted-foreground">Estoque Baixo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-destructive/20 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{outOfStockCount}</p>
                <p className="text-xs text-muted-foreground">Sem Estoque</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos por Categoria</CardTitle>
          <CardDescription>Distribuição dos produtos por tipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(tiposCounts).map(([tipo, count]) => (
              <div key={tipo} className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-accent-gold" />
                <span className="text-sm font-medium capitalize">{tipo}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProdutos.map((produto) => {
          const stockInfo = getStockStatus(produto.estoque);

          return (
            <Card key={produto.idProduto} className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">
                      {produto.nome}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {produto.descricao}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {produto.tipo}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preço */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Preço Unitário</span>
                  <span className="text-lg font-bold text-accent-gold">
                    R$ {produto.valor.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Material */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Material</span>
                  <span className="text-sm font-medium text-right flex-1 ml-2">
                    {produto.material}
                  </span>
                </div>

                {/* Tamanho */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tamanho</span>
                  <span className="text-sm font-medium">{produto.tamanho}</span>
                </div>

                {/* Estoque */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estoque</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{produto.estoque} unidades</span>
                    <Badge 
                      variant={stockInfo.color === 'success' ? 'default' : 
                              stockInfo.color === 'warning' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {stockInfo.status}
                    </Badge>
                  </div>
                </div>

                {/* Valor Total em Estoque */}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Valor Total</span>
                    <span className="text-sm font-bold">
                      R$ {(produto.valor * produto.estoque).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Low Stock Warning */}
                {produto.estoque <= 2 && produto.estoque > 0 && (
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span className="text-xs text-warning font-medium">
                        Estoque baixo - considere repor
                      </span>
                    </div>
                  </div>
                )}

                {produto.estoque === 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-destructive" />
                      <span className="text-xs text-destructive font-medium">
                        Produto sem estoque
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Detalhes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-accent-gold/10 border-accent-gold/30 text-accent-gold hover:bg-accent-gold/20"
                  >
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProdutos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  );
};
