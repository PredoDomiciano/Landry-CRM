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

// --- MÁSCARAS ---

// Formatação exclusiva para CNPJ
const aplicarMascaraCnpj = (valor: string | number | null | undefined) => {
  if (!valor) return '';
  
  let v = String(valor).replace(/\D/g, ''); // Remove tudo o que não é número
  if (v.length > 14) v = v.slice(0, 14); // Limita a 14 dígitos

  // Máscara: 00.000.000/0000-00
  v = v.replace(/^(\d{2})(\d)/, '$1.$2');
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
  v = v.replace(/(\d{4})(\d)/, '$1-$2');
  
  return v;
};

const aplicarMascaraTelefone = (valor: string) => {
  let v = valor.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
  v = v.replace(/(\d)(\d{4})$/, '$1-$2');
  return v;
};

const aplicarMascaraCep = (valor: string) => {
  let v = valor.replace(/\D/g, '');
  if (v.length > 8) v = v.slice(0, 8);
  v = v.replace(/^(\d{5})(\d)/, '$1-$2');
  return v;
};

export const ClienteForm = ({ open, onOpenChange, onSubmit, initialData }: ClienteFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Estados dos campos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cnpj, setCnpj] = useState(''); // Variável específica para CNPJ
  
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
        setTelefone(aplicarMascaraTelefone(dados.telefone || ''));
        
        // Tenta pegar o CNPJ (se tiver CPF, vai tentar formatar, mas o foco agora é CNPJ)
        setCnpj(aplicarMascaraCnpj(dados.cnpj || dados.cpf || ''));
        
        const contato = dados.contato || dados;
        setRua(contato.rua || '');
        setNumeroCasa(contato.numeroCasa || '');
        setBairro(contato.bairro || '');
        setCidade(contato.cidade || '');
        setCep(aplicarMascaraCep(contato.cep || ''));
      } else {
        // Limpar tudo
        setNome('');
        setEmail('');
        setTelefone('');
        setCnpj('');
        setRua('');
        setNumeroCasa('');
        setBairro('');
        setCidade('');
        setCep('');
      }
    }
  }, [open, initialData]);

  // --- HANDLERS ---
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCnpj(aplicarMascaraCnpj(e.target.value));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(aplicarMascaraTelefone(e.target.value));
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCep(aplicarMascaraCep(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const limpaFormatacao = (val: string) => val.replace(/\D/g, '');

    const cnpjLimpo = limpaFormatacao(cnpj);
    const telefoneLimpo = limpaFormatacao(telefone);
    const cepLimpo = limpaFormatacao(cep);

    const clientePayload = {
      nome: nome,
      nomeDoComercio: nome,
      email: email,
      telefone: telefoneLimpo, 
      
      // --- ENVIO CRÍTICO PARA O BANCO ---
      cnpj: cnpjLimpo, // Envia para o campo 'cnpj' (que não aceita null)
      cpf: null,       // Deixa o 'cpf' nulo (se o banco aceitar, senão mandamos string vazia ou repetimos)
      
      rua: rua,
      numeroCasa: numeroCasa,
      bairro: bairro,
      cidade: cidade,
      cep: cepLimpo,
      
      contato: {
        email: email,
        telefone: telefoneLimpo,
        rua: rua,
        numeroCasa: numeroCasa,
        bairro: bairro,
        cidade: cidade,
        cep: cepLimpo
      }
    };

    try {
      await onSubmit(clientePayload);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast({ 
        title: "Erro ao salvar", 
        description: "Falha ao salvar cliente. Verifique o CNPJ.", 
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
          <DialogTitle>{initialData ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          <DialogDescription>
            Preencha os dados da empresa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Dados Empresariais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="nome">Razão Social / Nome Fantasia *</Label>
                <Input id="nome" required value={nome} onChange={e => setNome(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Corporativo *</Label>
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
                {/* CAMPO AGORA É EXCLUSIVO PARA CNPJ */}
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input 
                  id="cnpj" 
                  required
                  value={cnpj} 
                  onChange={handleCnpjChange} 
                  placeholder="00.000.000/0000-00"
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