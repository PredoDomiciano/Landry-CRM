import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Pedido, mockClientes, mockProdutos } from '@/data/mockData';
import { Plus, Trash2 } from 'lucide-react';

interface PedidoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (pedido: Omit<Pedido, 'idPedidos'>) => void;
}

interface ProdutoPedido {
  produtoId: number;
  quantidade: number;
  preco_unitario: number;
}

export const PedidoForm = ({ open, onOpenChange, onSubmit }: PedidoFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState<ProdutoPedido[]>([
    { produtoId: 0, quantidade: 1, preco_unitario: 0 }
  ]);

  const addProduto = () => {
    setProdutos([...produtos, { produtoId: 0, quantidade: 1, preco_unitario: 0 }]);
  };

  const removeProduto = (index: number) => {
    setProdutos(produtos.filter((_, i) => i !== index));
  };

  const updateProduto = (index: number, field: keyof ProdutoPedido, value: number) => {
    const newProdutos = [...produtos];
    newProdutos[index] = { ...newProdutos[index], [field]: value };
    
    // Auto-fill price when product is selected
    if (field === 'produtoId') {
      const produto = mockProdutos.find(p => p.idProduto === value);
      if (produto) {
        newProdutos[index].preco_unitario = produto.valor;
      }
    }
    
    setProdutos(newProdutos);
  };

  const calcularTotal = () => {
    return produtos.reduce((total, produto) => total + (produto.quantidade * produto.preco_unitario), 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Validate produtos
    const produtosValidos = produtos.filter(p => p.produtoId > 0 && p.quantidade > 0);
    if (produtosValidos.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um produto ao pedido.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    const pedido: Omit<Pedido, 'idPedidos'> = {
      numero: `PED-${Date.now()}`,
      data: new Date().toISOString().split('T')[0],
      status: formData.get('status') as 'pendente' | 'confirmado' | 'produção' | 'enviado' | 'entregue' | 'cancelado',
      valorTotal: calcularTotal(),
      clienteId: parseInt(formData.get('clienteId') as string),
      produtos: produtosValidos.map((produto, index) => ({
        idProdutos: produto.produtoId,
        idPedido: Date.now(),
        quantidade: produto.quantidade,
        preco: produto.preco_unitario,
        valorPedido: produto.quantidade * produto.preco_unitario
      }))
    };

    try {
      onSubmit(pedido);
      toast({
        title: "Pedido adicionado",
        description: "Pedido foi adicionado com sucesso."
      });
      onOpenChange(false);
      setProdutos([{ produtoId: 0, quantidade: 1, preco_unitario: 0 }]);
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o pedido.",
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
            Crie um novo pedido para um cliente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clienteId">Cliente *</Label>
              <Select name="clienteId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {mockClientes.map((cliente) => (
                    <SelectItem key={cliente.idCliente} value={cliente.idCliente.toString()}>
                      {cliente.nome_do_comercio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select name="status" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="produção">Produção</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Produtos *</Label>
              <Button type="button" variant="outline" onClick={addProduto}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>

            {produtos.map((produto, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                <div className="col-span-5 space-y-2">
                  <Label>Produto</Label>
                  <Select 
                    value={produto.produtoId.toString()} 
                    onValueChange={(value) => updateProduto(index, 'produtoId', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProdutos.map((p) => (
                        <SelectItem key={p.idProduto} value={p.idProduto.toString()}>
                          {p.nome} - R$ {p.valor.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Qtd</Label>
                  <Input 
                    type="number"
                    min="1"
                    value={produto.quantidade}
                    onChange={(e) => updateProduto(index, 'quantidade', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="col-span-3 space-y-2">
                  <Label>Preço Unit.</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={produto.preco_unitario}
                    onChange={(e) => updateProduto(index, 'preco_unitario', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="col-span-1 space-y-2">
                  <Label>Total</Label>
                  <div className="text-sm font-medium py-2">
                    R$ {(produto.quantidade * produto.preco_unitario).toFixed(2)}
                  </div>
                </div>

                <div className="col-span-1">
                  {produtos.length > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeProduto(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="text-right">
              <p className="text-lg font-semibold">
                Total do Pedido: R$ {calcularTotal().toFixed(2)}
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
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
              className="bg-accent-gold text-accent-gold-foreground hover:bg-accent-gold/90"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Pedido'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};