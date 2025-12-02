import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Package, Calendar, Pencil, Trash2, ChevronRight, User, ShoppingBag, Ban } from 'lucide-react';
import { PedidoForm } from '@/components/forms/PedidoForm';
import { useApp } from '../../contexts/AppContext'; 
import type { Pedido } from '@/types/api';
import { STATUS_PEDIDO_LABELS } from '@/types/api';
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

const statusColors: Record<string, string> = {
  'PENDENTE': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'CONFIRMADO': 'bg-blue-100 text-blue-700 border-blue-200',
  'PRODUCAO': 'bg-purple-100 text-purple-700 border-purple-200',
  'PAGO': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'ENVIADO': 'bg-pink-100 text-pink-700 border-pink-200',
  'ENTREGUE': 'bg-green-100 text-green-700 border-green-200',
  'CANCELADO': 'bg-red-100 text-red-700 border-red-200'
};

export const PedidosView = () => {
  const { pedidos, produtos, addPedido, updatePedido, deletePedido, updatePedidoStatus, oportunidades, clientes } = useApp();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ativos'); 
  
  const [showForm, setShowForm] = useState(false);
  const [pedidoEmEdicao, setPedidoEmEdicao] = useState<Pedido | null>(null);
  const [pedidoParaDeletar, setPedidoParaDeletar] = useState<Pedido | null>(null);

  const formatarDataDisplay = (dataString?: string) => {
      if (!dataString) return '-';
      const dataLimpa = dataString.split('T')[0];
      const [ano, mes, dia] = dataLimpa.split('-');
      return `${dia}/${mes}/${ano}`;
  };

  const getNomeCliente = (pedido: Pedido) => {
    const clienteDireto = pedido.oportunidade?.cliente as any;
    if (clienteDireto?.nome) return clienteDireto.nome;
    if (clienteDireto?.nomeDoComercio) return clienteDireto.nomeDoComercio;

    if (pedido.oportunidade?.idOportunidade) {
        const idOp = String(pedido.oportunidade.idOportunidade);
        const opGlobal = oportunidades.find(o => String(o.idOportunidade) === idOp);
        if (opGlobal?.cliente) {
            return (opGlobal.cliente as any).nome || (opGlobal.cliente as any).nomeDoComercio;
        }
    }
    return 'Cliente Não Vinculado';
  };

  const getResumoItens = (pedido: Pedido) => {
    if (!pedido.itens || pedido.itens.length === 0) return 'Sem itens';
    return pedido.itens.map(item => {
        let nomeProd = (item as any).produto?.nome;
        const idProd = (item as any).produto?.idProduto || (item as any).produtoId;
        if (!nomeProd && idProd) {
            const prodGlobal = produtos.find(p => String(p.idProduto) === String(idProd));
            if (prodGlobal) nomeProd = prodGlobal.nome;
        }
        return `${item.quantidade}x ${nomeProd || 'Produto #' + idProd}`;
    }).join(', ');
  };

  const filteredPedidos = pedidos.filter(pedido => {
    const searchLower = searchTerm.toLowerCase();
    const clienteNome = getNomeCliente(pedido).toLowerCase();

    const matchesSearch = 
        pedido.idPedido?.toString().includes(searchLower) ||
        pedido.valorTotal.toString().includes(searchLower) ||
        clienteNome.includes(searchLower);
        
    let matchesStatus = true;
    if (statusFilter === 'ativos') {
        matchesStatus = pedido.status !== 'ENTREGUE' && pedido.status !== 'CANCELADO';
    } else if (statusFilter !== 'all') {
        matchesStatus = pedido.status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  const handleSavePedido = async (dados: Partial<Pedido>) => {
    try {
      if (pedidoEmEdicao && pedidoEmEdicao.idPedido) {
        if (updatePedido) {
            await updatePedido(pedidoEmEdicao.idPedido, dados);
            toast({ title: "Sucesso", description: "Pedido atualizado." });
        }
      } else {
        await addPedido(dados);
        toast({ title: "Sucesso", description: "Pedido criado." });
      }
      setShowForm(false);
      setPedidoEmEdicao(null);
    } catch (error) {
       console.error(error);
       toast({ title: "Erro", description: "Falha ao salvar pedido.", variant: "destructive" });
    }
  };

  const handleClickEditar = (pedido: Pedido) => {
    setPedidoEmEdicao(pedido);
    setShowForm(true);
  };

  const handleConfirmDelete = async () => {
    if (!pedidoParaDeletar || !deletePedido || !pedidoParaDeletar.idPedido) return;
    try {
        await deletePedido(pedidoParaDeletar.idPedido);
        toast({ title: "Removido", description: "Pedido e seus itens foram excluídos." });
    } catch (error: any) {
        // CORREÇÃO: Mostra o motivo real se falhar
        toast({ 
            title: "Não foi possível excluir", 
            description: error.message || "Erro desconhecido ao excluir pedido.", 
            variant: "destructive" 
        });
    } finally {
        setPedidoParaDeletar(null);
    }
  };

  const handleCancelarPedido = async (id: number) => {
      try {
          await updatePedidoStatus(id, 'CANCELADO');
          toast({ title: "Pedido Cancelado", description: "Status alterado para Cancelado." });
      } catch (error) {
          toast({ title: "Erro", description: "Erro ao cancelar pedido.", variant: "destructive" });
      }
  };

  const handleAvancarStatus = async (id: number, currentStatus: string) => {
    const fluxo = ['PENDENTE', 'CONFIRMADO', 'PAGO', 'PRODUCAO', 'ENVIADO', 'ENTREGUE'];
    const index = fluxo.indexOf(currentStatus);
    if (index >= 0 && index < fluxo.length - 1) {
      await updatePedidoStatus(id, fluxo[index + 1]);
      toast({ title: "Status Atualizado", description: `Pedido avançou para ${fluxo[index + 1]}` });
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Pedidos</h1>
          <p className="text-muted-foreground">Acompanhe o fluxo de vendas e entregas.</p>
        </div>
        <Button 
          onClick={() => { setPedidoEmEdicao(null); setShowForm(true); }} 
          className="bg-accent-gold hover:bg-yellow-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, Valor ou Cliente..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ativos">Em Andamento (Padrão)</SelectItem>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PENDENTE">Pendente</SelectItem>
            <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
            <SelectItem value="PRODUCAO">Em Produção</SelectItem>
            <SelectItem value="ENVIADO">Enviado</SelectItem>
            <SelectItem value="ENTREGUE">Entregue</SelectItem>
            <SelectItem value="CANCELADO">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PedidoForm 
        open={showForm} 
        onOpenChange={(open) => {
            setShowForm(open);
            if(!open) setPedidoEmEdicao(null);
        }}
        onSubmit={handleSavePedido}
        initialData={pedidoEmEdicao}
      />

      <AlertDialog open={!!pedidoParaDeletar} onOpenChange={() => setPedidoParaDeletar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação removerá o Pedido <b>#{pedidoParaDeletar?.idPedido}</b>. Use "Cancelar" se quiser manter o histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
                Excluir Definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPedidos.map((pedido) => (
          <Card key={pedido.idPedido} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-accent-gold group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-accent-gold/10 transition-colors shrink-0">
                    <Package className="h-6 w-6 text-slate-600 group-hover:text-accent-gold" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-lg">Pedido #{pedido.idPedido}</h3>
                    <div className="flex items-center text-sm font-medium text-slate-700 gap-1 truncate">
                       <User className="w-3 h-3 text-muted-foreground" />
                       <span className="truncate" title={getNomeCliente(pedido)}>
                         {getNomeCliente(pedido)}
                       </span>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${statusColors[pedido.status] || 'bg-slate-100'} border px-2 py-1 text-xs shrink-0`}
                >
                  {STATUS_PEDIDO_LABELS[pedido.status] || pedido.status}
                </Badge>
              </div>

              <div className="mb-4 pl-[3.5rem]">
                 <div className="flex items-center text-xs text-muted-foreground gap-1 mb-1">
                    <Calendar className="w-3 h-3" />
                    {formatarDataDisplay(pedido.data)}
                 </div>
                 
                 <div className="bg-slate-50 p-2 rounded text-xs text-slate-600 flex gap-2 items-start">
                    <ShoppingBag className="w-3 h-3 mt-0.5 shrink-0" />
                    <p className="line-clamp-2" title={getResumoItens(pedido)}>
                       {getResumoItens(pedido)}
                    </p>
                 </div>

                 <div className="flex justify-between items-end mt-2">
                    <span className="text-xs text-slate-500">Total</span>
                    <span className="text-lg font-bold text-slate-900">R$ {pedido.valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                 </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t items-center">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" onClick={() => handleClickEditar(pedido)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                
                {pedido.status !== 'CANCELADO' && pedido.status !== 'ENTREGUE' && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500" title="Cancelar Pedido"
                        onClick={() => pedido.idPedido && handleCancelarPedido(pedido.idPedido)}>
                        <Ban className="w-4 h-4" />
                    </Button>
                )}

                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setPedidoParaDeletar(pedido)}>
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="flex-1"></div>

                {pedido.status !== 'ENTREGUE' && pedido.status !== 'CANCELADO' && (
                  <Button 
                    size="sm"
                    className="bg-accent-gold/10 text-accent-gold hover:bg-accent-gold/20 border-accent-gold/20 border"
                    onClick={() => pedido.idPedido && handleAvancarStatus(pedido.idPedido, pedido.status)}
                  >
                    Avançar <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPedidos.length === 0 && (
        <div className="text-center py-12">
           <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-muted-foreground">
             {statusFilter === 'ativos' ? "Nenhum pedido pendente." : "Nenhum pedido encontrado."}
          </p>
        </div>
      )}
    </div>
  );
};