import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast'; 

interface ProdutoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Ajuste: Aceita qualquer objeto parcial de Produto
  onSubmit: (produto: any) => Promise<void>;
  initialData?: any; // Adicionado para edição
}

export const ProdutoForm = ({ open, onOpenChange, onSubmit, initialData }: ProdutoFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // States para controlar os inputs (necessário para edição)
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [material, setMaterial] = useState('');
  const [valor, setValor] = useState('');
  const [estoque, setEstoque] = useState('');
  const [tamanho, setTamanho] = useState('0');

  // Preenche o formulário quando initialData mudar ou o modal abrir
  useEffect(() => {
    if (open) {
      if (initialData) {
        setNome(initialData.nome || '');
        setDescricao(initialData.descricao || '');
        setTipo(initialData.tipo ? initialData.tipo.toString() : '');
        setMaterial(initialData.material || '');
        setValor(initialData.valor !== undefined ? initialData.valor.toString() : '');
        setEstoque(initialData.quantidadeEstoque !== undefined ? initialData.quantidadeEstoque.toString() : '');
        setTamanho(initialData.tamanho !== undefined ? initialData.tamanho.toString() : '0');
      } else {
        // Limpa o formulário para cadastro novo
        setNome('');
        setDescricao('');
        setTipo('');
        setMaterial('');
        setValor('');
        setEstoque('');
        setTamanho('0');
      }
    }
  }, [initialData, open]);

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
      material: formData.get('material') as string, 
      tamanho: parseFloat((formData.get('tamanho') as string) || '0'), 
    };

    try {
      await onSubmit(produtoPayload);
      toast({
        title: "Sucesso!",
        description: initialData ? "Produto atualizado." : "Produto cadastrado no sistema."
      });
      // Apenas fechamos se o pai não fechar, mas geralmente o pai fecha no onSubmit
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
          <DialogTitle>{initialData ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          <DialogDescription>{initialData ? 'Altere os dados da jóia.' : 'Preencha os dados da jóia.'}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input 
                id="nome" 
                name="nome" 
                required 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea 
                id="descricao" 
                name="descricao" 
                required 
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select name="tipo" required value={tipo} onValueChange={setTipo}>
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
              <Input 
                id="material" 
                name="material" 
                placeholder="Ex: Ouro 18k" 
                required 
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Preço (R$) *</Label>
              <Input 
                id="valor" 
                name="valor" 
                type="number" 
                step="0.01" 
                required 
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque">Estoque *</Label>
              <Input 
                id="estoque" 
                name="estoque" 
                type="number" 
                required 
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tamanho">Tamanho</Label>
              <Input 
                id="tamanho" 
                name="tamanho" 
                type="number" 
                step="0.1" 
                value={tamanho}
                onChange={(e) => setTamanho(e.target.value)}
              />
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