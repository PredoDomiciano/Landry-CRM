import { useState } from 'react';
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
  initialData?: Oportunidade | null; // Adicionado para aceitar dados de edição
}

export const OportunidadeForm = ({ open, onOpenChange, onSubmit, initialData }: OportunidadeFormProps) => {
  const { toast } = useToast();
  const { clientes } = useApp();
  const [loading, setLoading] = useState(false);

  const isEditing = !!initialData;

  // Helper para formatar data (YYYY-MM-DD) para o input
  const formatDataInput = (dataString?: string) => {
    if (!dataString) return '';
    return dataString.split('T')[0];
  };

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
      dataDeFechamentoEstimada: formData.get('data') as string,
      cliente: clienteSelecionado 
    };

    try {
      await onSubmit(oportunidadePayload);
      // O toast de sucesso agora é chamado no componente pai (View), 
      // mas podemos manter um genérico aqui ou remover.
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Helper para mostrar nome do cliente corretamente
  const getClienteNome = (c: any) => c.nome || c.nomeDoComercio || `Cliente #${c.idCliente}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Oportunidade' : 'Nova Oportunidade'}</DialogTitle>
        </DialogHeader>
        
        {/* A Key força o formulário a recarregar se mudarmos de item, limpando os campos ou atualizando os dados */}
        <form key={initialData?.idOportunidade || 'new'} onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <Label>Cliente *</Label>
            {/* Se for edição, tentamos pegar o ID do cliente existente */}
            <Select 
                name="clienteId" 
                required 
                defaultValue={initialData?.cliente?.idCliente?.toString() || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map(c => (
                  <SelectItem key={c.idCliente} value={c.idCliente?.toString() || ""}>
                    {getClienteNome(c)} {c.cnpj ? `(${c.cnpj})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nome da Oportunidade *</Label>
            <Input 
                name="nome" 
                placeholder="Ex: Venda de Anel de Noivado" 
                required 
                defaultValue={initialData?.nomeOportunidade || ''}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor Est. (R$)</Label>
              <Input 
                name="valor" 
                type="number" 
                step="0.01" 
                required 
                defaultValue={initialData?.valorEstimado || ''}
              />
            </div>
            <div className="space-y-2">
              <Label>Data Fechamento</Label>
              <Input 
                name="data" 
                type="date" 
                required 
                defaultValue={formatDataInput(initialData?.dataDeFechamentoEstimada)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estágio *</Label>
            <Select name="estagio" defaultValue={initialData?.estagioFunil || "PROSPECCAO"}>
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
                {isEditing ? 'Atualizar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};