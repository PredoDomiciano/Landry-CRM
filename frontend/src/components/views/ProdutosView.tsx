import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, Plus, Package, AlertTriangle, Tag, Pencil, Eye, Trash2 } from 'lucide-react';
import { ProdutoForm } from '@/components/forms/ProdutoForm';
import { useApp } from '@/contexts/AppContext'; 
import type { Produto } from '@/types/api';
import { TAMANHO_LABELS } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const ProdutosView = () => {
  const { produtos, addProduto, updateProduto, deleteProduto, addLog, currentUser } = useApp();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('all');
  
  const [showForm, setShowForm] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);
  const [produtoParaDeletar, setProdutoParaDeletar] = useState<Produto | null>(null);

  const [showDetalhes, setShowDetalhes] = useState(false);
  const [produtoDetalhes, setProdutoDetalhes] = useState<Produto | null>(null);

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          produto.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = tipoFilter === 'all' || produto.tipo.toString() === tipoFilter;
    return matchesSearch && matchesType;
  });

  const handleSaveProduto = async (dados: Partial<Produto>) => {
    try {
      if (produtoEmEdicao && produtoEmEdicao.idProduto) {
        if (updateProduto) {
           await updateProduto(produtoEmEdicao.idProduto, dados);
           toast({ title: "Sucesso", description: "Produto atualizado com sucesso!" });
        }
      } else {
        await addProduto(dados);
        toast({ title: "Sucesso", description: "Produto criado com sucesso!" });
        await addLog({
            titulo: "Novo Produto",
            descricao: `Produto ${dados.nome} adicionado ao catálogo.`,
            data: new Date().toISOString(),
            tipoDeAtividade: 5,
            usuario: currentUser || undefined
         });
      }
      setShowForm(false);
      setProdutoEmEdicao(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({ title: "Erro", description: "Falha ao salvar operação.", variant: "destructive" });
    }
  };

  const handleConfirmDelete = async () => {
    if (!produtoParaDeletar || !produtoParaDeletar.idProduto) return;
    try {
        if (deleteProduto) {
            await deleteProduto(produtoParaDeletar.idProduto);
            toast({ title: "Removido", description: "Produto excluído com sucesso." });
        }
    } catch (error) {
        toast({ title: "Erro", description: "Erro ao excluir produto.", variant: "destructive" });
    } finally {
        setProdutoParaDeletar(null);
    }
  };

  const handleClickEditar = (produto: Produto) => {
    setProdutoEmEdicao(produto);
    setShowForm(true);
  };

  const handleClickDetalhes = (produto: Produto) => {
    setProdutoDetalhes(produto);
    setShowDetalhes(true);
  };

  // --- MAPA DE TIPOS (REMOVIDO "OUTROS") ---
  const getNomeTipo = (tipo: number | string) => {
    const tipoInt = typeof tipo === 'string' ? parseInt(tipo) : tipo;
    switch(tipoInt) {
        case 1: return "Anel";
        case 2: return "Colar";
        case 3: return "Brinco";
        case 4: return "Pulseira";
        case 5: return "Relógio";
        default: return "Indefinido"; // Caso venha lixo do banco
    }
  };

  const formatarTamanho = (tamanho: string | number) => {
      if (!tamanho) return 'Único';
      return TAMANHO_LABELS[tamanho.toString()] || tamanho.toString();
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Catálogo de Produtos</h1>
          <p className="text-muted-foreground">Gerencie o inventário e preços das jóias.</p>
        </div>
        
        <Button onClick={() => { setProdutoEmEdicao(null); setShowForm(true); }} className="bg-accent-gold hover:bg-yellow-600 text-white shadow-md">
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
        onOpenChange={(open) => { setShowForm(open); if(!open) setProdutoEmEdicao(null); }}
        onSubmit={handleSaveProduto}
        initialData={produtoEmEdicao} 
      />

      <AlertDialog open={!!produtoParaDeletar} onOpenChange={() => setProdutoParaDeletar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Produto?</AlertDialogTitle>
            <AlertDialogDescription>Remover <b>{produtoParaDeletar?.nome}</b> permanentemente?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showDetalhes} onOpenChange={setShowDetalhes}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Produto</DialogTitle>
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
                    <span className="font-medium"><Badge variant="secondary">{getNomeTipo(produtoDetalhes.tipo)}</Badge></span>
                 </div>
                 <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Preço</span>
                    <span className="font-bold text-accent-gold text-lg">
                      R$ {produtoDetalhes.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </span>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Material</span>
                    <span className="text-slate-700">{produtoDetalhes.material}</span>
                 </div>
                 <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Tamanho</span>
                    <span className="text-slate-700">{formatarTamanho(produtoDetalhes.tamanho)}</span>
                 </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetalhes(false)}>Fechar</Button>
            <Button className="bg-accent-gold text-white" onClick={() => { setShowDetalhes(false); handleClickEditar(produtoDetalhes!); }}>
              <Pencil className="w-4 h-4 mr-2" /> Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProdutos.map((produto) => (
          <Card key={produto.idProduto} className="overflow-hidden hover:shadow-elegant transition-all duration-300 group">
            <div className="h-40 bg-slate-100 flex items-center justify-center relative">
               <Package className="w-16 h-16 text-slate-300" />
               <Badge className="absolute top-2 right-2 bg-white/90 text-slate-800 shadow-sm">
                 {getNomeTipo(produto.tipo)}
               </Badge>
            </div>
            
            <CardContent className="p-5">
              <div className="mb-2">
                <h3 className="font-semibold text-lg line-clamp-1" title={produto.nome}>{produto.nome}</h3>
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
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                 <Tag className="w-3 h-3" />
                 {produto.material} • Tam: {formatarTamanho(produto.tamanho)}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleClickDetalhes(produto)}>
                  <Eye className="w-4 h-4 mr-2 text-muted-foreground" /> Detalhes
                </Button>
                <Button variant="ghost" size="sm" className="text-accent-gold hover:text-yellow-700 hover:bg-yellow-50" onClick={() => handleClickEditar(produto)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => setProdutoParaDeletar(produto)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};