import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Package, AlertTriangle, Tag } from 'lucide-react';
import { ProdutoForm } from '@/components/forms/ProdutoForm';
import { useApp } from '@/contexts/AppContext';
import type { Produto } from '@/types/api';

export const ProdutosView = () => {
  const { produtos, addProduto } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  // Filtragem
  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    // O backend Java envia 'tipo' como número. O Select retorna string.
    const matchesType = tipoFilter === 'all' || produto.tipo.toString() === tipoFilter;
    return matchesSearch && matchesType;
  });

  const handleAddProduto = async (novoProduto: Partial<Produto>) => {
    await addProduto(novoProduto);
    setShowForm(false);
  };

  // Helper para traduzir o INT do Java para Texto amigável
  const getNomeTipo = (tipo: number) => {
    switch(tipo) {
        case 1: return "Anel";
        case 2: return "Colar";
        case 3: return "Brinco";
        case 4: return "Pulseira";
        case 5: return "Relógio";
        case 6: return "Conjunto";
        default: return "Outro";
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Catálogo de Produtos</h1>
          <p className="text-muted-foreground">Gerencie o inventário e preços das jóias.</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-accent-gold hover:bg-yellow-600 text-white shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, descrição ou material..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="1">Anéis</SelectItem>
            <SelectItem value="2">Colares</SelectItem>
            <SelectItem value="3">Brincos</SelectItem>
            <SelectItem value="4">Pulseiras</SelectItem>
            <SelectItem value="5">Relógios</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProdutoForm 
        open={showForm} 
        onOpenChange={setShowForm}
        onSubmit={handleAddProduto}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProdutos.map((produto) => (
          <Card key={produto.idProduto} className="overflow-hidden hover:shadow-elegant transition-all duration-300 group">
            <div className="h-40 bg-slate-100 flex items-center justify-center relative">
               {/* Placeholder para imagem */}
               <Package className="w-16 h-16 text-slate-300" />
               <Badge className="absolute top-2 right-2 bg-white/90 text-slate-800 hover:bg-white shadow-sm">
                 {getNomeTipo(produto.tipo)}
               </Badge>
            </div>
            
            <CardContent className="p-5">
              <div className="mb-2">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-lg line-clamp-1" title={produto.nome}>{produto.nome}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-3">{produto.descricao}</p>
              </div>

              <div className="flex items-center justify-between mb-4 bg-slate-50 p-2 rounded-md">
                 <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Preço</span>
                    <span className="font-bold text-accent-gold text-lg">R$ {produto.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                 </div>
                 <div className="text-right">
                    <span className="text-xs text-muted-foreground">Estoque</span>
                    <div className={`font-bold ${produto.quantidadeEstoque < 5 ? 'text-red-500' : 'text-slate-700'}`}>
                        {produto.quantidadeEstoque} un.
                    </div>
                 </div>
              </div>

              {/* Alertas de Estoque */}
              {produto.quantidadeEstoque > 0 && produto.quantidadeEstoque < 5 && (
                <div className="flex items-center gap-2 mb-3 text-yellow-600 bg-yellow-50 p-2 rounded text-xs font-medium">
                   <AlertTriangle className="w-3 h-3" />
                   Estoque baixo - Considere repor
                </div>
              )}

              {produto.quantidadeEstoque === 0 && (
                <div className="flex items-center gap-2 mb-3 text-red-600 bg-red-50 p-2 rounded text-xs font-medium">
                   <Package className="w-3 h-3" />
                   Produto esgotado
                </div>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                 <Tag className="w-3 h-3" />
                 {/* O Java retorna Material com M maiúsculo */}
                 {produto.Material} • Tam: {produto.tamanho > 0 ? produto.tamanho : 'Único'}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Detalhes
                </Button>
                <Button variant="ghost" size="sm" className="text-accent-gold hover:text-yellow-700 hover:bg-yellow-50">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProdutos.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  );
};