import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Funcionario } from '@/types/api';
import { CARGO_LABELS } from '@/types/api'; 

const CARGOS_KEYS = [
  'SETOR_COMERCIAL', 'MODELAGEM', 'INJECAO_DE_CERA', 'CRAVACAO', 'POLIMENTO', 
  'ACABAMENTO', 'FUNDICAO', 'SOLDAGEM', 'BANHO', 'CONTROLE_DE_QUALIDADE', 'ADMINISTRADOR'
];

interface FuncionarioFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (funcionario: any) => Promise<void>;
  initialData?: Funcionario | null;
}

export const FuncionarioForm = ({ open, onOpenChange, onSubmit, initialData }: FuncionarioFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // States Pessoais
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [cargo, setCargo] = useState('');

  // States Endereço
  const [rua, setRua] = useState('');
  const [numeroCasa, setNumeroCasa] = useState(''); 
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [cep, setCep] = useState('');

  useEffect(() => {
    if (open) {
      if (initialData) {
        setNome(initialData.nome || '');
        setEmail(initialData.email || '');
        setCpf(initialData.cpf || '');
        setCargo(initialData.cargo || '');

        const contato = (initialData as any).contato || initialData;
        setRua(contato.rua || '');
        setNumeroCasa(contato.numeroCasa || ''); 
        setBairro(contato.bairro || '');
        setCidade(contato.cidade || '');
        setCep(contato.cep || '');
      } else {
        setNome('');
        setEmail('');
        setCpf('');
        setCargo('');
        setRua('');
        setNumeroCasa('');
        setBairro('');
        setCidade('');
        setCep('');
      }
    }
  }, [open, initialData]);

  // --- MÁSCARAS ---
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Apenas números
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 (CPF)

    // Formata 000.000.000-00
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    setCpf(value);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const funcionarioPayload = {
      nome,
      email,
      cpf, // Envia formatado ou limpe com cpf.replace(/\D/g, '') se o banco preferir apenas números
      cargo,
      
      rua,
      numeroCasa, 
      bairro,
      cidade,
      cep,
      
      contato: {
        rua,
        numeroCasa, 
        bairro,
        cidade,
        cep,
        email 
      }
    };

    try {
      await onSubmit(funcionarioPayload);
      toast({
        title: "Sucesso",
        description: initialData ? "Funcionário atualizado." : "Funcionário adicionado."
      });
      onOpenChange(false); // Fecha o modal após sucesso
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Perfil' : 'Novo Funcionário'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Atualize as informações.' : 'Adicione um novo membro.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Profissional */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">Dados Profissionais</h3>
            
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input 
                    id="cpf" 
                    required 
                    value={cpf} 
                    onChange={handleCpfChange} 
                    placeholder="000.000.000-00"
                    maxLength={14}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo *</Label>
              <Select value={cargo} onValueChange={setCargo} required>
                <SelectTrigger><SelectValue placeholder="Selecione o cargo" /></SelectTrigger>
                <SelectContent>
                  {CARGOS_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>{CARGO_LABELS[key] || key}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">Endereço Residencial</h3>
            
            <div className="grid grid-cols-6 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="cep">CEP</Label>
                <Input 
                    id="cep" 
                    value={cep} 
                    onChange={handleCepChange} 
                    placeholder="00000-000" 
                    maxLength={9}
                />
              </div>
              <div className="space-y-2 col-span-4">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
              </div>
              
              <div className="space-y-2 col-span-6">
                <Label htmlFor="rua">Rua / Logradouro</Label>
                <Input id="rua" value={rua} onChange={(e) => setRua(e.target.value)} />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" value={numeroCasa} onChange={(e) => setNumeroCasa(e.target.value)} placeholder="Nº" />
              </div>

              <div className="space-y-2 col-span-4">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-accent-gold text-white hover:bg-yellow-600" disabled={loading}>
              {loading ? 'Salvando...' : (initialData ? 'Atualizar' : 'Salvar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};