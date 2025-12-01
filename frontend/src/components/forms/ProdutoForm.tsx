import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast'; 
import { Produto } from '@/types/api'; 
import { TAMANHO_LABELS, MATERIAL_LABELS, PEDRA_LABELS } from '@/types/api';

// --- SEPARAÇÃO DAS CATEGORIAS DE TAMANHO ---
const MATERIAIS_KEYS = ['PRATA_925'];
const PEDRAS_KEYS = ['ZIRCONIA', 'CRISTAL', 'SEM_PEDRA'];

const ANEIS_KEYS = [
  'ARO_12', 'ARO_13', 'ARO_14', 'ARO_15', 'ARO_16', 'ARO_17', 'ARO_18', 'ARO_19', 
  'ARO_20', 'ARO_21', 'ARO_22', 'ARO_23', 'ARO_24', 'ARO_25', 'ARO_26'
];

const COLARES_KEYS = ['CM_40', 'CM_45', 'CM_50', 'CM_60', 'CM_70'];
const ARGOLAS_KEYS = ['MM_8', 'MM_10', 'MM_12']; // Geralmente para brincos
const GERAIS_KEYS = ['UNICO', 'PERSONALIZADO'];

interface ProdutoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (produto: any) => Promise<void>;
  initialData?: Produto | null; 
}

export const ProdutoForm = ({ open, onOpenChange, onSubmit, initialData }: ProdutoFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // States
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState(''); 
  const [valor, setValor] = useState('');
  const [estoque, setEstoque] = useState('');
  const [material, setMaterial] = useState('PRATA_925');
  const [pedra, setPedra] = useState('SEM_PEDRA');
  const [tamanho, setTamanho] = useState('UNICO');
  const [tamanhoPersonalizado, setTamanhoPersonalizado] = useState('');

  // Lógica para filtrar tamanhos baseado no Tipo
  const getTamanhosDisponiveis = () => {
      switch(tipo) {
          case '1': // Anel
              return [...ANEIS_KEYS, ...GERAIS_KEYS];
          case '2': // Colar
              return [...COLARES_KEYS, ...GERAIS_KEYS];
          case '3': // Brinco (pode ter tamanho de argola ou ser único)
              return [...ARGOLAS_KEYS, ...GERAIS_KEYS];
          default: // Pulseira (4), Relógio (5) ou outros
              return GERAIS_KEYS; // Apenas Único ou Personalizado
      }
  };

  const tamanhosDisponiveis = getTamanhosDisponiveis();

  // Resetar o tamanho se mudar o tipo (para evitar inconsistências, ex: Colar com Aro 12)
  useEffect(() => {
     if (open && !initialData) {
         setTamanho('UNICO'); 
     }
     // Se estivermos editando, não resetamos imediatamente para não perder o valor original
     // A menos que o usuário mude o tipo manualmente.
  }, [tipo]);

  // Carregar dados na Edição
  useEffect(() => {
    if (open) {
      if (initialData) {
        setNome(initialData.nome || '');
        setDescricao(initialData.descricao || '');
        setTipo(initialData.tipo ? initialData.tipo.toString() : '');
        setValor(initialData.valor !== undefined ? initialData.valor.toString() : '');
        setEstoque(initialData.quantidadeEstoque !== undefined ? initialData.quantidadeEstoque.toString() : '');
        setMaterial(typeof initialData.material === 'string' ? initialData.material : 'PRATA_925');
        setPedra(typeof initialData.tipoPedra === 'string' ? initialData.tipoPedra : 'SEM_PEDRA');
        
        const tam = typeof initialData.tamanho === 'string' ? initialData.tamanho : 'UNICO';
        
        // Verifica se o tamanho salvo pertence à lista (se não, joga para personalizado)
        const todasAsChaves = [...ANEIS_KEYS, ...COLARES_KEYS, ...ARGOLAS_KEYS, ...GERAIS_KEYS];
        
        if (todasAsChaves.includes(tam)) {
            setTamanho(tam);
            setTamanhoPersonalizado('');
        } else {
            setTamanho('PERSONALIZADO');
            setTamanhoPersonalizado(tam);
        }
        
        if (initialData.tamanhoPersonalizado) {
            setTamanho('PERSONALIZADO');
            setTamanhoPersonalizado(initialData.tamanhoPersonalizado);
        }

      } else {
        // Limpa formulário
        setNome('');
        setDescricao('');
        setTipo(''); 
        setValor('');
        setEstoque('');
        setMaterial('PRATA_925');
        setPedra('SEM_PEDRA');
        setTamanho('UNICO');
        setTamanhoPersonalizado('');
      }
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const tamanhoFinal = tamanho === 'PERSONALIZADO' ? 'PERSONALIZADO' : tamanho;

    const produtoPayload = {
      nome,
      descricao,
      tipo: parseInt(tipo), 
      valor: parseFloat(valor.replace(',', '.')), 
      quantidadeEstoque: parseInt(estoque),
      material, 
      tipoPedra: pedra,
      tamanho: tamanhoFinal,
      tamanhoPersonalizado: tamanho === 'PERSONALIZADO' ? tamanhoPersonalizado : null
    };

    try {
      await onSubmit(produtoPayload);
      // Não fecha o modal aqui, o pai controla isso
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Verifique os dados.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          <DialogDescription>{initialData ? 'Altere os dados da jóia.' : 'Preencha os dados da jóia.'}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" required value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            </div>

            {/* CATEGORIA - Removido "Outros" implícito, apenas opções válidas */}
            <div className="space-y-2">
              <Label htmlFor="tipo">Categoria *</Label>
              <Select name="tipo" required value={tipo} onValueChange={setTipo}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Anel</SelectItem>
                  <SelectItem value="2">Colar</SelectItem>
                  <SelectItem value="3">Brinco</SelectItem>
                  <SelectItem value="4">Pulseira</SelectItem>
                  <SelectItem value="5">Relógio</SelectItem>
                  {/* Removido Conjunto/Outros para forçar especificidade */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material *</Label>
              <Select value={material} onValueChange={setMaterial}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {MATERIAIS_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>{MATERIAL_LABELS[key] || key}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pedra">Pedra *</Label>
              <Select value={pedra} onValueChange={setPedra}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {PEDRAS_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>{PEDRA_LABELS[key] || key}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* TAMANHO - Lista Dinâmica baseada no Tipo */}
            <div className="space-y-2">
              <Label htmlFor="tamanho">Tamanho *</Label>
              <Select value={tamanho} onValueChange={setTamanho} disabled={!tipo}>
                <SelectTrigger>
                    <SelectValue placeholder={!tipo ? "Selecione a Categoria primeiro" : "Selecione o tamanho"} />
                </SelectTrigger>
                <SelectContent>
                  {tamanhosDisponiveis.map((key) => (
                    <SelectItem key={key} value={key}>
                      {TAMANHO_LABELS[key] || key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {tamanho === 'PERSONALIZADO' && (
               <div className="space-y-2 col-span-2 animate-fade-in">
                 <Label htmlFor="tamPersonalizado">Especifique o Tamanho</Label>
                 <Input 
                   id="tamPersonalizado" 
                   value={tamanhoPersonalizado} 
                   onChange={(e) => setTamanhoPersonalizado(e.target.value)} 
                   placeholder="Ex: 18cm com extensor"
                   required
                 />
               </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="valor">Preço (R$) *</Label>
              <Input id="valor" type="number" step="0.01" required value={valor} onChange={(e) => setValor(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque">Estoque *</Label>
              <Input id="estoque" type="number" required value={estoque} onChange={(e) => setEstoque(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-accent-gold text-white hover:bg-yellow-600">
              {loading ? 'Salvando...' : (initialData ? 'Atualizar' : 'Salvar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};