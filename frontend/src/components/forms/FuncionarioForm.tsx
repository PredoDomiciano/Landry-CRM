import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Funcionario } from '@/data/mockData';

interface FuncionarioFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (funcionario: Omit<Funcionario, 'idFuncionario'>) => void;
}

export const FuncionarioForm = ({ open, onOpenChange, onSubmit }: FuncionarioFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const funcionario: Omit<Funcionario, 'idFuncionario'> = {
      nome: formData.get('nome') as string,
      email: formData.get('email') as string,
      cpf: formData.get('cpf') as string,
      cargo: formData.get('cargo') as string
    };

    try {
      onSubmit(funcionario);
      toast({
        title: "Funcionário adicionado",
        description: `${funcionario.nome} foi adicionado com sucesso.`
      });
      onOpenChange(false);
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o funcionário.",
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
          <DialogTitle>Novo Funcionário</DialogTitle>
          <DialogDescription>
            Adicione um novo funcionário à equipe
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input 
              id="nome" 
              name="nome" 
              placeholder="Ex: João Silva Santos"
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                placeholder="joao@landryjoias.com"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input 
                id="cpf" 
                name="cpf" 
                placeholder="000.000.000-00"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo *</Label>
            <Input 
              id="cargo" 
              name="cargo" 
              placeholder="Ex: Vendedor"
              required 
            />
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
              {loading ? 'Salvando...' : 'Salvar Funcionário'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};