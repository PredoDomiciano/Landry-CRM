import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { Plus, Trash2, User } from 'lucide-react';
import type { Pedido, StatusPedido } from '@/types/api';

interface PedidoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (pedido: any) => Promise<void>;
  initialData?: Pedido | null;
}

interface ProdutoItem {
  produtoId: number;
  quantidade: number;
  valor: number;
  tamanho: string;
  pedra?: string;
  nomeProduto?: string; // Para exibir na lista visualmente
}

export const PedidoForm = ({ open, onOpenChange, onSubmit, initialData }: PedidoFormProps) => {
  const { toast } = useToast();
  // Adicionei 'clientes' aqui para poder listar no select
  const { produtos, oportunidades, clientes } = useApp(); 
  const [loading, setLoading] = useState(false);
  
  // Estados do Formulário
  const [clienteId, setClienteId] = useState<string>(''); // Filtro de cliente
  const [oportunidadeId, setOportunidadeId] = useState<string>('');
  const [status, setStatus] = useState<StatusPedido>('PENDENTE');
  const [itens, setItens] = useState<ProdutoItem[]>([
    { produtoId: 0, quantidade: 1, valor: 0, tamanho: '' }
  ]);

  // Filtra as oportunidades baseadas no cliente selecionado
  const oportunidadesFiltradas = clienteId 
    ? oportunidades.filter(op => op.cliente?.idCliente?.toString() === clienteId)
    : oportunidades;

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Tenta achar o cliente da oportunidade vinculada ao pedido
        const opVinculada = oportunidades.find(o => o.idOportunidade === initialData.oportunidade?.idOportunidade);
        if (opVinculada?.cliente?.idCliente) {
            setClienteId(opVinculada.cliente.idCliente.toString());
        }

        setOportunidadeId(initialData.oportunidade?.idOportunidade?.toString() || '');
        setStatus(initialData.status);
        
        // Mapeia os itens existentes
        if (initialData.itens && initialData.itens.length > 0) {
            const itensFormatados = initialData.itens.map((item: any) => ({
                produtoId: item.produto?.idProduto || 0,
                quantidade: item.quantidade,
                valor: item.valor,
                tamanho: item.tamanho || '',
                pedra: item.pedra || '',
                nomeProduto: item.produto?.nome // Recupera o nome para não ficar undefined
            }));
            setItens(itensFormatados);
        } else {
            setItens([{ produtoId: 0, quantidade: 1, valor: 0, tamanho: '' }]);
        }
      } else {
        // Limpa para novo
        setClienteId('');
        setOportunidadeId('');
        setStatus('PENDENTE');
        setItens([{ produtoId: 0, quantidade: 1, valor: 0, tamanho: '' }]);
      }
    }
  }, [open, initialData, oportunidades]);

  const addItem = () => {
    setItens([...itens, { produtoId: 0, quantidade: 1, valor: 0, tamanho: '' }]);
  };

  const removeItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ProdutoItem, value: number | string) => {
    const newItens = [...itens];
    newItens[index] = { ...newItens[index], [field]: value };
    
    // Se mudou o produto, preenche valor, tamanho e NOME automaticamente
    if (field === 'produtoId') {
      const produto = produtos.find(p => p.idProduto === value);
      if (produto) {
        newItens[index].valor = produto.valor;
        newItens[index].tamanho = typeof produto.tamanho === 'string' ? produto.tamanho : '';
        newItens[index].nomeProduto = produto.nome; // Salva o nome para exibir no form
      }
    }
    
    setItens(newItens);
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + (item.quantidade * item.valor), 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const itensValidos = itens.filter(item => item.produtoId > 0 && item.quantidade > 0);
    if (itensValidos.length === 0) {
      toast({ title: "Erro", description: "Adicione produtos válidos.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const oportunidade = oportunidadeId 
      ? oportunidades.find(o => o.idOportunidade === parseInt(oportunidadeId)) 
      : undefined;

    // Monta o objeto para salvar
    const pedidoPayload: any = {
      data: initialData ? initialData.data : new Date().toISOString(),
      status: status,
      valorTotal: calcularTotal(),
      oportunidade: oportunidade ? { 
          idOportunidade: oportunidade.idOportunidade,
          // Passamos o cliente junto para garantir integridade no mock
          cliente: oportunidade.cliente 
      } : null,
      itens: itensValidos.map(item => {
        // Busca o produto original para garantir que temos o NOME dele ao salvar
        const prodOriginal = produtos.find(p => p.idProduto === item.produtoId);
        
        return {
            produto: { 
                idProduto: item.produtoId,
                // AQUI ESTÁ A CORREÇÃO PRINCIPAL: Enviamos o nome junto!
                nome: prodOriginal?.nome || 'Produto Sem Nome' 
            }, 
            quantidade: item.quantidade,
            tamanho: item.tamanho || 'U',
            valor: item.valor,
            pedra: item.pedra || ''
        };
      })
    };

    try {
      await onSubmit(pedidoPayload);
      toast({ title: "Sucesso!", description: "Pedido salvo com sucesso." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? `Editar Pedido #${initialData.idPedido}` : 'Novo Pedido'}</DialogTitle>
          <DialogDescription>Registre uma venda e adicione os produtos.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            
            {/* SELEÇÃO DE CLIENTE (Novo Campo) */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="clienteId" className="flex items-center gap-2">
                <User className="w-4 h-4" /> Cliente (Quem fez o pedido?)
              </Label>
              <Select value={clienteId} onValueChange={(val) => { setClienteId(val); setOportunidadeId(''); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o Cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.idCliente} value={c.idCliente?.toString() || ''}>
                      {c.nome} {c.nomeDoComercio ? `(${c.nomeDoComercio})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Oportunidade (Filtrada) */}
            <div className="space-y-2">
              <Label htmlFor="oportunidadeId">Vincular a Oportunidade *</Label>
              <Select value={oportunidadeId} onValueChange={setOportunidadeId} required>
                <SelectTrigger>
                  <SelectValue placeholder={clienteId ? "Selecione a negociação" : "Selecione um cliente primeiro"} />
                </SelectTrigger>
                <SelectContent>
                  {oportunidadesFiltradas.length === 0 ? (
                     <SelectItem value="disabled" disabled>Nenhuma oportunidade para este cliente</SelectItem>
                  ) : (
                    oportunidadesFiltradas.map((op) => (
                        <SelectItem key={op.idOportunidade} value={op.idOportunidade?.toString() || ''}>
                        {op.nomeOportunidade} (R$ {op.valorEstimado})
                        </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status Atual</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as StatusPedido)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                  <SelectItem value="PRODUCAO">Em Produção</SelectItem>
                  <SelectItem value="ENVIADO">Enviado</SelectItem>
                  <SelectItem value="ENTREGUE">Entregue</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Itens do Pedido</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" /> Adicionar Produto
              </Button>
            </div>

            {itens.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 bg-slate-50 rounded-lg border">
                <div className="col-span-4 space-y-1">
                  <Label className="text-xs">Produto</Label>
                  <Select 
                    value={item.produtoId.toString()} 
                    onValueChange={(value) => updateItem(index, 'produtoId', parseInt(value))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Produto..." />
                    </SelectTrigger>
                    <SelectContent>
                      {produtos.map((p) => (
                        <SelectItem key={p.idProduto} value={p.idProduto?.toString() || ''}>
                          {p.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Qtd.</Label>
                  <Input type="number" min="1" className="h-9" value={item.quantidade} onChange={(e) => updateItem(index, 'quantidade', parseInt(e.target.value) || 1)} />
                </div>

                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Tam.</Label>
                  <Input className="h-9" value={item.tamanho} onChange={(e) => updateItem(index, 'tamanho', e.target.value)} />
                </div>

                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Valor (R$)</Label>
                  <Input type="number" step="0.01" className="h-9" value={item.valor} onChange={(e) => updateItem(index, 'valor', parseFloat(e.target.value) || 0)} />
                </div>

                <div className="col-span-1 pb-1">
                  {itens.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => removeItem(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-end items-center pt-2 gap-2">
              <span className="text-muted-foreground text-sm">Total:</span>
              <span className="text-2xl font-bold text-accent-gold">
                {calcularTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
            <Button type="submit" className="bg-accent-gold hover:bg-yellow-600 text-white font-bold" disabled={loading}>
              {loading ? 'Processando...' : 'Finalizar Pedido'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};