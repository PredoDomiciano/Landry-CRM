import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Funcionario } from '@/types/api'; // Ajuste o import conforme seu projeto

interface FuncionarioFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Aceita qualquer objeto parcial para permitir edição
  onSubmit: (funcionario: any) => Promise<void>;
  initialData?: Funcionario | null; // Adicionado para edição
}

export const FuncionarioForm = ({ open, onOpenChange, onSubmit, initialData }: FuncionarioFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // States para os campos (Edição)
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [cargo, setCargo] = useState('');

  // Preenche os dados quando abre para edição
  useEffect(() => {
    if (open) {
      if (initialData) {
        setNome(initialData.nome || '');
        setEmail(initialData.email || '');
        setCpf(initialData.cpf || '');
        setCargo(initialData.cargo || '');
      } else {
        // Limpa para novo cadastro
        setNome('');
        setEmail('');
        setCpf('');
        setCargo('');
      }
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Cria o objeto payload
    const funcionarioData = {
      nome,
      email,
      cpf,
      cargo
    };

    try {
      await onSubmit(funcionarioData);
      toast({
        title: "Sucesso",
        description: initialData 
          ? "Dados do funcionário atualizados." 
          : "Funcionário adicionado com sucesso."
      });
      // O pai (View) fechará o modal
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o funcionário.",
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
          <DialogTitle>{initialData ? 'Editar Perfil' : 'Novo Funcionário'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Atualize as informações do colaborador.' : 'Adicione um novo funcionário à equipe.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input 
              id="nome" 
              placeholder="Ex: João Silva Santos"
              required 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="joao@landryjoias.com"
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input 
                id="cpf" 
                placeholder="000.000.000-00"
                required 
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo *</Label>
            <Input 
              id="cargo" 
              placeholder="Ex: Vendedor"
              required 
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
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
              className="bg-accent-gold text-white hover:bg-yellow-600"
              disabled={loading}
            >
              {loading ? 'Salvando...' : (initialData ? 'Atualizar' : 'Salvar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};