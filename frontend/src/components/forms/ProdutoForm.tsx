import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Produto } from '@/data/mockData';

interface ProdutoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (produto: Omit<Produto, 'idProduto'>) => void;
}

export const ProdutoForm = ({ open, onOpenChange, onSubmit }: ProdutoFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const produto: Omit<Produto, 'idProduto'> = {
      nome: formData.get('nome') as string,
      descricao: formData.get('descricao') as string,
      tipo: formData.get('tipo') as 'anel' | 'colar' | 'brinco' | 'pulseira' | 'conjunto',
      valor: parseFloat(formData.get('valor') as string),
      estoque: parseInt(formData.get('estoque') as string),
      material: formData.get('material') as string,
      tamanho: formData.get('tamanho') as string
    };

    try {
      onSubmit(produto);
      toast({
        title: "Produto adicionado",
        description: `${produto.nome} foi adicionado com sucesso.`
      });
      onOpenChange(false);
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>
            Adicione um novo produto ao catálogo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Produto *</Label>
            <Input 
              id="nome" 
              name="nome" 
              placeholder="Ex: Anel de Ouro 18k"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea 
              id="descricao" 
              name="descricao" 
              placeholder="Descrição detalhada do produto..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select name="tipo" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anel">Anel</SelectItem>
                  <SelectItem value="colar">Colar</SelectItem>
                  <SelectItem value="brinco">Brinco</SelectItem>
                  <SelectItem value="pulseira">Pulseira</SelectItem>
                  <SelectItem value="conjunto">Conjunto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material *</Label>
              <Input 
                id="material" 
                name="material" 
                placeholder="Ex: Ouro 18k"
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input 
                id="valor" 
                name="valor" 
                type="number"
                step="0.01"
                placeholder="0,00"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque">Estoque *</Label>
              <Input 
                id="estoque" 
                name="estoque" 
                type="number"
                placeholder="0"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tamanho">Tamanho</Label>
              <Input 
                id="tamanho" 
                name="tamanho" 
                placeholder="Ex: P, M, G, 16, 18..."
              />
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
              {loading ? 'Salvando...' : 'Salvar Produto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};