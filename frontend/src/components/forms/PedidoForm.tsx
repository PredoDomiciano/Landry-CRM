import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { Plus, Trash2 } from 'lucide-react';
import type { Pedido, StatusPedido } from '@/types/api';

interface PedidoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (pedido: Omit<Pedido, 'idPedido'>) => Promise<void>;
}

interface ProdutoItem {
  produtoId: number;
  quantidade: number;
  valor: number;
  tamanho: string;
  pedra?: string;
}

export const PedidoForm = ({ open, onOpenChange, onSubmit }: PedidoFormProps) => {
  const { toast } = useToast();
  const { produtos, oportunidades } = useApp();
  const [loading, setLoading] = useState(false);
  
  // Estado para a lista de itens dinâmica
  const [itens, setItens] = useState<ProdutoItem[]>([
    { produtoId: 0, quantidade: 1, valor: 0, tamanho: '' }
  ]);

  const addItem = () => {
    setItens([...itens, { produtoId: 0, quantidade: 1, valor: 0, tamanho: '' }]);
  };

  const removeItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ProdutoItem, value: number | string) => {
    const newItens = [...itens];
    // Atualiza o campo específico
    newItens[index] = { ...newItens[index], [field]: value };
    
    // Se mudou o produto, preenche automaticamente o preço e tamanho
    if (field === 'produtoId') {
      const produto = produtos.find(p => p.idProduto === value);
      if (produto) {
        newItens[index].valor = produto.valor;
        // Converte o tamanho para string, e protege contra null/undefined
        newItens[index].tamanho = produto.tamanho ? produto.tamanho.toString() : '';
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

    const formData = new FormData(e.currentTarget);
    
    // 1. Validação básica
    const itensValidos = itens.filter(item => item.produtoId > 0 && item.quantidade > 0);
    if (itensValidos.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um produto válido ao pedido.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // 2. Busca a Oportunidade (se selecionada)
    const oportunidadeIdStr = formData.get('oportunidadeId') as string;
    const oportunidade = oportunidadeIdStr 
      ? oportunidades.find(o => o.idOportunidade === parseInt(oportunidadeIdStr)) 
      : undefined;

    // 3. Monta o Payload para o Java
    // AQUI ESTÁ A CORREÇÃO PRINCIPAL: Enviamos apenas o ID do produto dentro do objeto
    const pedidoPayload: any = {
      data: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      status: formData.get('status') as StatusPedido,
      valorTotal: calcularTotal(),
      oportunidade: oportunidade ? { idOportunidade: oportunidade.idOportunidade } : null,
      itens: itensValidos.map(item => ({
        // Enviamos apenas o ID, o Java busca o resto no banco e evita o erro do @Nonnull Material
        produto: { idProduto: item.produtoId }, 
        quantidade: item.quantidade,
        tamanho: item.tamanho || 'U', // Valor padrão caso vazio
        valor: item.valor,
        pedra: item.pedra || ''
      }))
    };

    try {
      await onSubmit(pedidoPayload);
      toast({
        title: "Sucesso!",
        description: "Pedido criado com sucesso."
      });
      
      // Resetar form
      onOpenChange(false);
      setItens([{ produtoId: 0, quantidade: 1, valor: 0, tamanho: '' }]);
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar",
        description: "Verifique a conexão ou os dados preenchidos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Pedido</DialogTitle>
          <DialogDescription>
            Registre uma venda e adicione os produtos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Oportunidade */}
            <div className="space-y-2">
              <Label htmlFor="oportunidadeId">Vincular a Oportunidade</Label>
              <Select name="oportunidadeId">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione (Opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {oportunidades.map((op) => (
                    <SelectItem key={op.idOportunidade} value={op.idOportunidade?.toString() || ''}>
                      {op.nomeOportunidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status Atual *</Label>
              <Select name="status" required defaultValue="PENDENTE">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
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
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>

            {/* Lista Dinâmica de Itens */}
            {itens.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 bg-slate-50 rounded-lg border">
                
                {/* Seleção de Produto */}
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

                {/* Quantidade */}
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Qtd.</Label>
                  <Input 
                    type="number"
                    min="1"
                    className="h-9"
                    value={item.quantidade}
                    onChange={(e) => updateItem(index, 'quantidade', parseInt(e.target.value) || 1)}
                  />
                </div>

                {/* Tamanho */}
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Tam.</Label>
                  <Input 
                    className="h-9"
                    value={item.tamanho}
                    placeholder="Único"
                    onChange={(e) => updateItem(index, 'tamanho', e.target.value)}
                  />
                </div>

                {/* Valor */}
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Valor (R$)</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    className="h-9"
                    value={item.valor}
                    onChange={(e) => updateItem(index, 'valor', parseFloat(e.target.value) || 0)}
                  />
                </div>

                {/* Valor Total da Linha (Visual) */}
                <div className="col-span-1 text-center pb-2 text-xs font-bold text-slate-600">
                   {(item.quantidade * item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>

                {/* Botão Remover */}
                <div className="col-span-1 pb-1">
                  {itens.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-end items-center pt-2 gap-2">
              <span className="text-muted-foreground text-sm">Total do Pedido:</span>
              <span className="text-2xl font-bold text-accent-gold">
                {calcularTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-accent-gold hover:bg-yellow-600 text-white font-bold"
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Finalizar Pedido'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};