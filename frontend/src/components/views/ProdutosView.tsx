import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // Importei os Modais aqui
import { Search, Plus, Package, AlertTriangle, Tag, Pencil, Eye } from 'lucide-react'; // Adicionei o ícone Eye (Olho)
import { ProdutoForm } from '@/components/forms/ProdutoForm';
import { useApp } from '@/contexts/AppContext';
import type { Produto } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export const ProdutosView = () => {
  const { produtos, addProduto, updateProduto } = useApp();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('all');
  
  // Estados para o Formulário (Novo/Editar)
  const [showForm, setShowForm] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);

  // Estados para o Modal de Detalhes
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [produtoDetalhes, setProdutoDetalhes] = useState<Produto | null>(null);

  // Filtragem
  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          produto.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = tipoFilter === 'all' || produto.tipo.toString() === tipoFilter;
    return matchesSearch && matchesType;
  });

  // Salvar ou Atualizar
  const handleSaveProduto = async (dados: Partial<Produto>) => {
    try {
      if (produtoEmEdicao) {
        if (updateProduto && produtoEmEdicao.idProduto) {
           await updateProduto(produtoEmEdicao.idProduto, dados);
           toast({ title: "Sucesso", description: "Produto atualizado com sucesso!" });
        } else {
           toast({ title: "Erro", description: "Não foi possível atualizar.", variant: "destructive" });
        }
      } else {
        await addProduto(dados);
        toast({ title: "Sucesso", description: "Produto criado com sucesso!" });
      }
      setShowForm(false);
      setProdutoEmEdicao(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({ title: "Erro", description: "Falha ao salvar operação.", variant: "destructive" });
    }
  };

  const handleClickEditar = (produto: Produto) => {
    setProdutoEmEdicao(produto);
    setShowForm(true);
  };

  // --- NOVA FUNÇÃO PARA DETALHES ---
  const handleClickDetalhes = (produto: Produto) => {
    setProdutoDetalhes(produto);
    setShowDetalhes(true);
  };

  const handleOpenChange = (open: boolean) => {
    setShowForm(open);
    if (!open) setProdutoEmEdicao(null);
  };

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
        
        <Button 
          onClick={() => { setProdutoEmEdicao(null); setShowForm(true); }} 
          className="bg-accent-gold hover:bg-yellow-600 text-white shadow-md"
        >
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

      {/* Formulário de Criação/Edição */}
      <ProdutoForm 
        open={showForm} 
        onOpenChange={handleOpenChange}
        onSubmit={handleSaveProduto}
        initialData={produtoEmEdicao} 
      />

      {/* --- NOVO MODAL DE DETALHES --- */}
      <Dialog open={showDetalhes} onOpenChange={setShowDetalhes}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Produto</DialogTitle>
            <DialogDescription>Informações completas do item.</DialogDescription>
          </DialogHeader>
          
          {produtoDetalhes && (
            <div className="grid gap-4 py-2 text-sm">
              <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg">
                 <span className="text-xs font-semibold text-muted-foreground uppercase">Nome do Produto</span>
                 <span className="text-base font-medium text-slate-800">{produtoDetalhes.nome}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Categoria</span>
                    <span className="font-medium flex items-center gap-2">
                       <Badge variant="secondary">{getNomeTipo(produtoDetalhes.tipo)}</Badge>
                    </span>
                 </div>
                 <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Preço Unitário</span>
                    <span className="font-bold text-accent-gold text-lg">
                      R$ {produtoDetalhes.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </span>
                 </div>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg">
                 <span className="text-xs font-semibold text-muted-foreground uppercase">Descrição</span>
                 <p className="text-slate-600 leading-relaxed">{produtoDetalhes.descricao}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Estoque</span>
                    <span className={`${produtoDetalhes.quantidadeEstoque < 5 ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                      {produtoDetalhes.quantidadeEstoque} un.
                    </span>
                 </div>
                 <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Material</span>
                    <span className="text-slate-700">{produtoDetalhes.material}</span>
                 </div>
                 <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Tamanho</span>
                    <span className="text-slate-700">{produtoDetalhes.tamanho > 0 ? produtoDetalhes.tamanho : 'Único'}</span>
                 </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetalhes(false)}>Fechar</Button>
            <Button 
               className="bg-accent-gold text-white" 
               onClick={() => {
                 setShowDetalhes(false);
                 handleClickEditar(produtoDetalhes!); // Atalho para editar direto dos detalhes
               }}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProdutos.map((produto) => (
          <Card key={produto.idProduto} className="overflow-hidden hover:shadow-elegant transition-all duration-300 group">
            <div className="h-40 bg-slate-100 flex items-center justify-center relative">
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

              {produto.quantidadeEstoque > 0 && produto.quantidadeEstoque < 5 && (
                <div className="flex items-center gap-2 mb-3 text-yellow-600 bg-yellow-50 p-2 rounded text-xs font-medium">
                   <AlertTriangle className="w-3 h-3" />
                   Estoque baixo
                </div>
              )}

              {produto.quantidadeEstoque === 0 && (
                <div className="flex items-center gap-2 mb-3 text-red-600 bg-red-50 p-2 rounded text-xs font-medium">
                   <Package className="w-3 h-3" />
                   Esgotado
                </div>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                 <Tag className="w-3 h-3" />
                 {produto.material} • Tam: {produto.tamanho > 0 ? produto.tamanho : 'Único'}
              </div>

              <div className="flex gap-2">
                {/* BOTÃO DETALHES FUNCIONANDO */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleClickDetalhes(produto)}
                >
                  <Eye className="w-4 h-4 mr-2 text-muted-foreground" />
                  Detalhes
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-accent-gold hover:text-yellow-700 hover:bg-yellow-50"
                  onClick={() => handleClickEditar(produto)}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};