import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast'; 
import type { Produto } from '@/types/api'; 

interface ProdutoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Ajuste: Aceita qualquer objeto parcial de Produto
  onSubmit: (produto: any) => Promise<void>; 
}

export const ProdutoForm = ({ open, onOpenChange, onSubmit }: ProdutoFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // --- CONVERSÃO CRÍTICA PARA O JAVA ---
    const produtoPayload = {
      nome: formData.get('nome') as string,
      descricao: formData.get('descricao') as string,
      // Java espera int (1, 2, 3), não string "anel"
      tipo: parseInt(formData.get('tipo') as string), 
      // Java espera float/double
      valor: parseFloat((formData.get('valor') as string).replace(',', '.')), 
      quantidadeEstoque: parseInt(formData.get('estoque') as string),
      // Java espera "Material" com M maiúsculo
      Material: formData.get('material') as string, 
      tamanho: parseFloat((formData.get('tamanho') as string) || '0'), 
    };

    try {
      await onSubmit(produtoPayload);
      toast({
        title: "Sucesso!",
        description: "Produto cadastrado no sistema."
      });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Verifique se os valores numéricos estão corretos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>Preencha os dados da jóia.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input id="nome" name="nome" required />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" name="descricao" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select name="tipo" required>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {/* Values devem ser números como string */}
                  <SelectItem value="1">Anel</SelectItem>
                  <SelectItem value="2">Colar</SelectItem>
                  <SelectItem value="3">Brinco</SelectItem>
                  <SelectItem value="4">Pulseira</SelectItem>
                  <SelectItem value="5">Relógio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material *</Label>
              <Input id="material" name="material" placeholder="Ex: Ouro 18k" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Preço (R$) *</Label>
              <Input id="valor" name="valor" type="number" step="0.01" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque">Estoque *</Label>
              <Input id="estoque" name="estoque" type="number" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tamanho">Tamanho</Label>
              <Input id="tamanho" name="tamanho" type="number" step="0.1" defaultValue="0" />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-accent-gold text-white">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};