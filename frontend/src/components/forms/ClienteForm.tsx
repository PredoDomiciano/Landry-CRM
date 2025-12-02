import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Cliente } from '@/types/api';

interface ClienteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (cliente: any) => Promise<void>;
  initialData?: Cliente | null;
}

export const ClienteForm = ({ open, onOpenChange, onSubmit, initialData }: ClienteFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Estados dos campos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  
  // Endereço
  const [rua, setRua] = useState('');
  const [numeroCasa, setNumeroCasa] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [cep, setCep] = useState('');

  useEffect(() => {
    if (open) {
      if (initialData) {
        const dados = initialData as any;
        setNome(dados.nome || dados.nomeDoComercio || '');
        setEmail(dados.email || '');
        setTelefone(dados.telefone || '');
        setCpf(dados.cpf || dados.cnpj || '');
        
        const contato = dados.contato || dados;
        setRua(contato.rua || '');
        setNumeroCasa(contato.numeroCasa || '');
        setBairro(contato.bairro || '');
        setCidade(contato.cidade || '');
        setCep(contato.cep || '');
      } else {
        setNome('');
        setEmail('');
        setTelefone('');
        setCpf('');
        setRua('');
        setNumeroCasa('');
        setBairro('');
        setCidade('');
        setCep('');
      }
    }
  }, [open, initialData]);

  // --- MÁSCARAS DE INPUT ---
  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    if (value.length > 14) value = value.slice(0, 14); // Limita a 14 dígitos (CNPJ)

    if (value.length <= 11) {
      // Máscara CPF: 000.000.000-00
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Máscara CNPJ: 00.000.000/0000-00
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    setCpf(value);
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    // Máscara Telefone: (00) 00000-0000
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    
    setTelefone(value);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    // Máscara CEP: 00000-000
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const limpaFormatacao = (val: string) => val.replace(/\D/g, '');

    const cpfLimpo = limpaFormatacao(cpf);
    const isCnpj = cpfLimpo.length > 11;

    const clientePayload = {
      nome: nome,
      nomeDoComercio: nome,
      email: email,
      telefone: telefone, // Pode mandar formatado ou limpar aqui também se preferir
      
      // Define se vai para o campo CPF ou CNPJ baseado no tamanho
      cpf: !isCnpj ? cpf : '',
      cnpj: isCnpj ? cpf : '',
      
      rua: rua,
      numeroCasa: numeroCasa,
      bairro: bairro,
      cidade: cidade,
      cep: cep,
      
      contato: {
        email: email,
        telefone: telefone,
        rua: rua,
        numeroCasa: numeroCasa,
        bairro: bairro,
        cidade: cidade,
        cep: cep
      }
    };

    try {
      await onSubmit(clientePayload);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          <DialogDescription>
            Preencha os dados para cadastro.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Dados Pessoais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="nome">Nome / Razão Social *</Label>
                <Input id="nome" required value={nome} onChange={e => setNome(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input 
                  id="telefone" 
                  value={telefone} 
                  onChange={handleTelefoneChange} 
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF / CNPJ</Label>
                <Input 
                  id="cpf" 
                  value={cpf} 
                  onChange={handleCpfCnpjChange} 
                  placeholder="000.000.000-00"
                  maxLength={18}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
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
                <Input id="cidade" value={cidade} onChange={e => setCidade(e.target.value)} />
              </div>
              <div className="space-y-2 col-span-6">
                <Label htmlFor="rua">Rua / Logradouro</Label>
                <Input id="rua" value={rua} onChange={e => setRua(e.target.value)} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" value={numeroCasa} onChange={e => setNumeroCasa(e.target.value)} />
              </div>
              <div className="space-y-2 col-span-4">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" value={bairro} onChange={e => setBairro(e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-accent-gold text-white hover:bg-yellow-600">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};