import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Cliente } from '@/data/mockData';

interface ClienteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (cliente: Omit<Cliente, 'idCliente'>) => void;
}

export const ClienteForm = ({ open, onOpenChange, onSubmit }: ClienteFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const cliente: Omit<Cliente, 'idCliente'> = {
      nome_do_comercio: formData.get('nomeComercio') as string,
      data: new Date().toISOString().split('T')[0],
      contato: {
        idContato: Date.now(),
        email: formData.get('email') as string,
        numero: formData.get('telefone') as string,
        endereco: `${formData.get('rua')}, ${formData.get('numero')} - ${formData.get('bairro')}, ${formData.get('cidade')}/${formData.get('estado')} - CEP: ${formData.get('cep')}`
      },
      oportunidades: []
    };

    try {
      onSubmit(cliente);
      toast({
        title: "Cliente adicionado",
        description: `${cliente.nome_do_comercio} foi adicionado com sucesso.`
      });
      onOpenChange(false);
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cliente.",
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
          <DialogTitle>Novo Cliente</DialogTitle>
          <DialogDescription>
            Adicione um novo cliente ao seu CRM
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="nomeComercio">Nome do Comércio *</Label>
              <Input 
                id="nomeComercio" 
                name="nomeComercio" 
                placeholder="Ex: Joalheria Brilhante"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                placeholder="contato@empresa.com"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input 
                id="telefone" 
                name="telefone" 
                placeholder="(11) 99999-9999"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rua">Rua *</Label>
              <Input 
                id="rua" 
                name="rua" 
                placeholder="Rua das Flores"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número *</Label>
              <Input 
                id="numero" 
                name="numero" 
                type="number"
                placeholder="123"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro *</Label>
              <Input 
                id="bairro" 
                name="bairro" 
                placeholder="Centro"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input 
                id="cidade" 
                name="cidade" 
                placeholder="São Paulo"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select name="estado" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  {/* Add more states as needed */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP *</Label>
              <Input 
                id="cep" 
                name="cep" 
                placeholder="00000-000"
                required 
              />
            </div>
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
              {loading ? 'Salvando...' : 'Salvar Cliente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};