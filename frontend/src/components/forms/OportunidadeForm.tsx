import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';

interface OportunidadeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (op: any) => Promise<void>;
}

export const OportunidadeForm = ({ open, onOpenChange, onSubmit }: OportunidadeFormProps) => {
  const { toast } = useToast();
  const { clientes } = useApp(); // Precisamos da lista para buscar o objeto completo
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // 1. Achar o objeto cliente real baseado no ID selecionado
    const clienteId = parseInt(formData.get('clienteId') as string);
    const clienteSelecionado = clientes.find(c => c.idCliente === clienteId);

    // 2. Montar o payload
    const oportunidadePayload = {
      nomeOportunidade: formData.get('nome') as string,
      valorEstimado: parseFloat(formData.get('valor') as string),
      estagioFunil: formData.get('estagio') as string,
      dataDeFechamentoEstimada: formData.get('data') as string, // Formato YYYY-MM-DD
      // Envia o objeto completo, não só o ID
      cliente: clienteSelecionado 
    };

    try {
      await onSubmit(oportunidadePayload);
      toast({ title: "Sucesso!", description: "Oportunidade criada." });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Nova Oportunidade</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <Select name="clienteId" required>
              <SelectTrigger><SelectValue placeholder="Selecione o Cliente" /></SelectTrigger>
              <SelectContent>
                {clientes.map(c => (
                  <SelectItem key={c.idCliente} value={c.idCliente?.toString() || ""}>
                    {c.nomeDoComercio} ({c.cnpj})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nome da Oportunidade *</Label>
            <Input name="nome" placeholder="Ex: Venda de Anel de Noivado" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor Est. (R$)</Label>
              <Input name="valor" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label>Data Fechamento</Label>
              <Input name="data" type="date" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estágio *</Label>
            <Select name="estagio" defaultValue="PROSPECCAO">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PROSPECCAO">Prospecção</SelectItem>
                <SelectItem value="QUALIFICACAO">Qualificação</SelectItem>
                <SelectItem value="PROPOSTA">Proposta</SelectItem>
                <SelectItem value="NEGOCIACAO">Negociação</SelectItem>
                <SelectItem value="FECHADA">Fechada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-accent-gold text-white">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};