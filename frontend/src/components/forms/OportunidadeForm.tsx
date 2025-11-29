import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Oportunidade, mockClientes } from '@/data/mockData';

interface OportunidadeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (oportunidade: Omit<Oportunidade, 'idOportunidade'>) => void;
}

export const OportunidadeForm = ({ open, onOpenChange, onSubmit }: OportunidadeFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const oportunidade: Omit<Oportunidade, 'idOportunidade'> = {
      clienteId: parseInt(formData.get('clienteId') as string),
      nome_da_oportunidade: formData.get('nomeOportunidade') as string,
      versao_do_funil: formData.get('descricao') as string,
      valor_estimado: parseFloat(formData.get('valorEstimado') as string),
      data_de_fechamento_estimada: formData.get('dataFechamento') as string,
      status: formData.get('status') as 'prospecção' | 'qualificação' | 'proposta' | 'negociação' | 'fechada' | 'perdida'
    };

    try {
      onSubmit(oportunidade);
      toast({
        title: "Oportunidade adicionada",
        description: `${oportunidade.nome_da_oportunidade} foi adicionada com sucesso.`
      });
      onOpenChange(false);
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a oportunidade.",
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
          <DialogTitle>Nova Oportunidade</DialogTitle>
          <DialogDescription>
            Adicione uma nova oportunidade de venda
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clienteId">Cliente *</Label>
            <Select name="clienteId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {mockClientes.map((cliente) => (
                  <SelectItem key={cliente.idCliente} value={cliente.idCliente.toString()}>
                    {cliente.nome_do_comercio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomeOportunidade">Nome da Oportunidade *</Label>
            <Input 
              id="nomeOportunidade" 
              name="nomeOportunidade" 
              placeholder="Ex: Conjunto de alianças"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea 
              id="descricao" 
              name="descricao" 
              placeholder="Detalhes sobre a oportunidade..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorEstimado">Valor Estimado (R$) *</Label>
              <Input 
                id="valorEstimado" 
                name="valorEstimado" 
                type="number"
                step="0.01"
                placeholder="0,00"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFechamento">Data Est. Fechamento *</Label>
              <Input 
                id="dataFechamento" 
                name="dataFechamento" 
                type="date"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select name="status" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prospecção">Prospecção</SelectItem>
                <SelectItem value="qualificação">Qualificação</SelectItem>
                <SelectItem value="proposta">Proposta</SelectItem>
                <SelectItem value="negociação">Negociação</SelectItem>
                <SelectItem value="fechada">Fechada</SelectItem>
                <SelectItem value="perdida">Perdida</SelectItem>
              </SelectContent>
            </Select>
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
              {loading ? 'Salvando...' : 'Salvar Oportunidade'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};