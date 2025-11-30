import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ClienteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (cliente: any) => Promise<void>;
}

export const ClienteForm = ({ open, onOpenChange, onSubmit }: ClienteFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const clientePayload = {
      nomeDoComercio: formData.get('nomeDoComercio') as string,
      cnpj: formData.get('cnpj') as string, // Backend espera "CNPJ" ou "cnpj"? O teu entity diz "CNPJ"
      email: formData.get('email') as string,
      // Se tiveres endereço, adiciona aqui
    };

    // Pequeno hack: o Java às vezes é case sensitive no JSON
    // Vamos garantir enviando ambas as chaves se necessário, mas o entity usa "CNPJ"
    const payloadFinal = { 
        ...clientePayload,
        CNPJ: clientePayload.cnpj // Garante compatibilidade
    };

    try {
      await onSubmit(payloadFinal);
      toast({ title: "Sucesso!", description: "Cliente cadastrado." });
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
        <DialogHeader><DialogTitle>Novo Cliente</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nomeDoComercio">Nome do Comércio *</Label>
            <Input id="nomeDoComercio" name="nomeDoComercio" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ *</Label>
            <Input id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" name="email" type="email" required />
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