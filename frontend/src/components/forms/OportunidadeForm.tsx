import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import type { Oportunidade } from '@/types/api';

interface OportunidadeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (op: any) => Promise<void>;
  initialData?: Oportunidade | null;
}

export const OportunidadeForm = ({ open, onOpenChange, onSubmit, initialData }: OportunidadeFormProps) => {
  const { toast } = useToast();
  const { clientes } = useApp();
  const [loading, setLoading] = useState(false);

  // Estados locais
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [estagio, setEstagio] = useState('PROSPECCAO');
  const [dataFechamento, setDataFechamento] = useState('');
  const [clienteId, setClienteId] = useState('');

  // Trava de data (Hoje) para impedir datas passadas no calendário
  const hoje = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Preenche os campos na edição
        setNome(initialData.nomeOportunidade || '');
        setValor(initialData.valorEstimado?.toString() || '');
        setEstagio(initialData.estagioFunil || 'PROSPECCAO');
        
        // Formata a data para YYYY-MM-DD
        if (initialData.dataDeFechamentoEstimada) {
            setDataFechamento(initialData.dataDeFechamentoEstimada.split('T')[0]);
        } else {
            setDataFechamento('');
        }

        // Recupera o ID do cliente se existir
        if (initialData.cliente?.idCliente) {
            setClienteId(initialData.cliente.idCliente.toString());
        }
      } else {
        // Limpa formulário se for nova oportunidade
        setNome('');
        setValor('');
        setEstagio('PROSPECCAO');
        setDataFechamento('');
        setClienteId('');
      }
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validação: Cliente é obrigatório
    if (!clienteId) {
        toast({ title: "Erro", description: "Selecione um cliente.", variant: "destructive" });
        setLoading(false);
        return;
    }

    // Validação: Data não pode ser passada
    if (dataFechamento < hoje) {
        toast({ 
            title: "Data Inválida", 
            description: "A data de fechamento não pode ser no passado.", 
            variant: "destructive" 
        });
        setLoading(false);
        return;
    }

    // --- MONTAGEM DO PAYLOAD (PACOTE DE DADOS) ---
    // Como o Backend usa a Entidade direta (sem DTO), 
    // precisamos enviar a estrutura exata de Objeto.
    const oportunidadePayload = {
      nomeOportunidade: nome,
      valorEstimado: parseFloat(valor),
      estagioFunil: estagio,
      dataDeFechamentoEstimada: dataFechamento,
      
      // IMPORTANTE: Enviamos como objeto aninhado
      // O Java vai ler isso e entender que é o objeto ClienteEntity
      cliente: { 
          idCliente: parseInt(clienteId) 
      }
    };

    try {
      console.log("Enviando Oportunidade:", oportunidadePayload);
      await onSubmit(oportunidadePayload);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro no form:", error);
      toast({ title: "Erro", description: "Verifique os dados.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Helper para mostrar nome do cliente corretamente na lista
  const getClienteNome = (c: any) => c.nome || c.nomeDoComercio || `Cliente #${c.idCliente}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
            <DialogTitle>{initialData ? 'Editar Oportunidade' : 'Nova Oportunidade'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Seleção de Cliente */}
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <Select value={clienteId} onValueChange={setClienteId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map(c => (
                  <SelectItem key={c.idCliente} value={c.idCliente?.toString() || ""}>
                    {getClienteNome(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nome da Oportunidade */}
          <div className="space-y-2">
            <Label>Nome da Oportunidade *</Label>
            <Input 
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: Venda de Anel de Noivado" 
                required 
            />
          </div>

          {/* Valor e Data */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor Est. (R$)</Label>
              <Input 
                value={valor}
                onChange={e => setValor(e.target.value)}
                type="number" 
                step="0.01" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Data Fechamento</Label>
              <Input 
                value={dataFechamento}
                onChange={e => setDataFechamento(e.target.value)}
                type="date"
                min={hoje}
                required 
              />
            </div>
          </div>

          {/* Estágio do Funil */}
          <div className="space-y-2">
            <Label>Estágio *</Label>
            <Select value={estagio} onValueChange={setEstagio}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PROSPECCAO">Prospecção</SelectItem>
                <SelectItem value="QUALIFICACAO">Qualificação</SelectItem>
                <SelectItem value="PROPOSTA">Proposta</SelectItem>
                <SelectItem value="NEGOCIACAO">Negociação</SelectItem>
                <SelectItem value="FECHADA">Fechada</SelectItem>
                <SelectItem value="PERDIDA">Perdida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-accent-gold hover:bg-yellow-600 text-white">
                {loading ? 'Salvando...' : (initialData ? 'Atualizar' : 'Salvar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};