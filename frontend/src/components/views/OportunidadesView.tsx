import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Target, ChevronRight, Trash2, Eye, XCircle, CheckCircle, Pencil } from 'lucide-react';
import { OportunidadeForm } from '@/components/forms/OportunidadeForm';
import { useApp } from '@/contexts/AppContext';
import type { Oportunidade, Pedido } from '@/types/api';
import { ESTAGIO_FUNIL_LABELS } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusColors: Record<string, string> = {
  'PROSPECCAO': 'text-slate-600 bg-slate-100 border-slate-200',
  'QUALIFICACAO': 'text-blue-600 bg-blue-100 border-blue-200', 
  'PROPOSTA': 'text-orange-600 bg-orange-100 border-orange-200',
  'NEGOCIACAO': 'text-purple-600 bg-purple-100 border-purple-200',
  'FECHADA': 'text-green-600 bg-green-100 border-green-200',
  'PERDIDA': 'text-red-600 bg-red-100 border-red-200'
};

export const OportunidadesView = () => {
  const { oportunidades, addOportunidade, updateOportunidade, updateOportunidadeStatus, deleteOportunidade, addPedido, addLog, currentUser } = useApp();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [estagioFilter, setEstagioFilter] = useState('ativos'); 
  
  // Estados de Controle
  const [showForm, setShowForm] = useState(false);
  const [opParaDeletar, setOpParaDeletar] = useState<Oportunidade | null>(null);
  const [opDetalhes, setOpDetalhes] = useState<Oportunidade | null>(null);
  const [opEmEdicao, setOpEmEdicao] = useState<Oportunidade | null>(null);

  const filteredOportunidades = oportunidades.filter(op => {
    const matchesSearch = op.nomeOportunidade.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesEstagio = true;
    if (estagioFilter === 'ativos') {
        matchesEstagio = op.estagioFunil !== 'FECHADA' && op.estagioFunil !== 'PERDIDA';
    } else if (estagioFilter !== 'all') {
        matchesEstagio = op.estagioFunil === estagioFilter;
    }

    return matchesSearch && matchesEstagio;
  });

  const handleSaveOportunidade = async (dados: Partial<Oportunidade>) => {
    try {
        if (opEmEdicao && opEmEdicao.idOportunidade) {
            if (updateOportunidade) {
                await updateOportunidade(opEmEdicao.idOportunidade, dados);
                toast({ title: "Atualizado", description: "Oportunidade editada com sucesso." });
            }
        } else {
            await addOportunidade(dados);
            toast({ title: "Sucesso", description: "Oportunidade criada." });
            await addLog({
                titulo: "Nova Oportunidade",
                descricao: `Oportunidade ${dados.nomeOportunidade} iniciada.`,
                data: new Date().toISOString(),
                tipoDeAtividade: 5,
                usuario: currentUser || undefined
            });
        }
        setShowForm(false);
        setOpEmEdicao(null);
    } catch (error) {
        console.error(error);
        toast({ title: "Erro", description: "Falha ao salvar oportunidade.", variant: "destructive" });
    }
  };

  const handleConfirmDelete = async () => {
    if (!opParaDeletar || !deleteOportunidade || !opParaDeletar.idOportunidade) return;

    try {
        await deleteOportunidade(opParaDeletar.idOportunidade);
        toast({ title: "Removida", description: "Oportunidade excluída com sucesso." });
    } catch (error: any) {
        // CORREÇÃO: Mostra a mensagem exata do erro (ex: vinculo com pedido)
        toast({ 
            title: "Não foi possível excluir", 
            description: error.message || "Verifique se essa oportunidade gerou pedidos ou tem registros vinculados.", 
            variant: "destructive" 
        });
    } finally {
        setOpParaDeletar(null);
    }
  };

  const handleGanharOportunidade = async (op: Oportunidade) => {
    if(!op.idOportunidade) return;

    try {
        await updateOportunidadeStatus(op.idOportunidade, 'FECHADA');

        const hojeFormatado = new Date().toISOString().split('T')[0];

        const novoPedido: Partial<Pedido> = {
            data: hojeFormatado,
            valorTotal: op.valorEstimado,
            status: 'PENDENTE',
            oportunidade: { idOportunidade: op.idOportunidade } as any 
        };

        if(addPedido) {
            await addPedido(novoPedido);
            toast({ 
                title: "Parabéns! Venda Fechada!", 
                description: "Pedido criado na aba Pedidos." 
            });
        }
        
    } catch (error) {
        console.error(error);
        toast({ title: "Erro", description: "Erro ao criar pedido.", variant: "destructive" });
    }
  };

  const handleCancelarOportunidade = async (id: number) => {
      try {
        await updateOportunidadeStatus(id, 'PERDIDA');
        toast({ title: "Oportunidade Cancelada", description: "Status alterado para Perdida." });
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível cancelar.", variant: "destructive" });
      }
  };

  const handleAvancarStatus = async (id: number, currentStage: string) => {
      const stages = ['PROSPECCAO', 'QUALIFICACAO', 'PROPOSTA', 'NEGOCIACAO', 'FECHADA'];
      const index = stages.indexOf(currentStage);
      if (index >= 0 && index < stages.length - 1) {
          const nextStage = stages[index + 1];
          if (nextStage === 'FECHADA') return; 
          
          await updateOportunidadeStatus(id, nextStage);
          toast({ title: "Fase Atualizada", description: `Avançou para ${ESTAGIO_FUNIL_LABELS[nextStage]}` });
      }
  };

  const getNomeCliente = (op: Oportunidade) => {
      return (op.cliente as any)?.nome || (op.cliente as any)?.nomeDoComercio || 'Cliente não vinculado';
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Oportunidades</h1>
          <p className="text-muted-foreground">Pipeline de vendas e negociações.</p>
        </div>
        <Button onClick={() => { setOpEmEdicao(null); setShowForm(true); }} className="bg-accent-gold hover:bg-yellow-600 text-white shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          Nova Oportunidade
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar oportunidade..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={estagioFilter} onValueChange={setEstagioFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por Estágio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ativos">Em Andamento (Padrão)</SelectItem>
            <SelectItem value="all">Mostrar Tudo (Histórico)</SelectItem>
            <SelectItem value="PROSPECCAO">Prospecção</SelectItem>
            <SelectItem value="QUALIFICACAO">Qualificação</SelectItem>
            <SelectItem value="PROPOSTA">Proposta</SelectItem>
            <SelectItem value="NEGOCIACAO">Negociação</SelectItem>
            <SelectItem value="FECHADA">Fechadas (Ganhas)</SelectItem>
            <SelectItem value="PERDIDA">Perdidas (Canceladas)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <OportunidadeForm 
        open={showForm} 
        onOpenChange={(val) => {
            setShowForm(val);
            if(!val) setOpEmEdicao(null);
        }}
        onSubmit={handleSaveOportunidade}
        initialData={opEmEdicao} 
      />

      <AlertDialog open={!!opParaDeletar} onOpenChange={() => setOpParaDeletar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Oportunidade?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso apagará permanentemente a oportunidade <b>{opParaDeletar?.nomeOportunidade}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
                Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!opDetalhes} onOpenChange={() => setOpDetalhes(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Oportunidade</DialogTitle>
          </DialogHeader>
          {opDetalhes && (
            <div className="space-y-4 py-2 text-sm">
               <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Título</span>
                  <p className="text-lg font-bold text-slate-800">{opDetalhes.nomeOportunidade}</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg border">
                      <span className="text-xs font-semibold text-muted-foreground">Valor</span>
                      <p className="font-bold">R$ {opDetalhes.valorEstimado?.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                      <span className="text-xs font-semibold text-muted-foreground">Cliente</span>
                      <p className="font-medium truncate">{getNomeCliente(opDetalhes)}</p>
                  </div>
               </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOportunidades.map((op) => (
          <Card key={op.idOportunidade} className="group hover:shadow-elegant transition-all duration-300 border-l-4 border-l-transparent hover:border-l-accent-gold">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                   <h3 className="font-semibold text-lg text-slate-800 line-clamp-1" title={op.nomeOportunidade}>
                      {op.nomeOportunidade}
                   </h3>
                   <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">
                         {getNomeCliente(op)}
                      </span>
                   </div>
                </div>
                <Badge variant="outline" className={`${statusColors[op.estagioFunil]} border px-2 py-0.5 font-medium text-[10px]`}>
                  {ESTAGIO_FUNIL_LABELS[op.estagioFunil] || op.estagioFunil}
                </Badge>
              </div>

              <div className="py-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-800">
                    R$ {op.valorEstimado ? op.valorEstimado.toLocaleString('pt-BR') : '0,00'}
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                      op.estagioFunil === 'PERDIDA' ? 'bg-red-500' : 
                      op.estagioFunil === 'FECHADA' ? 'bg-green-500' : 'bg-accent-gold'
                  }`}
                  style={{ width: 
                           op.estagioFunil === 'PROSPECCAO' ? '20%' :
                           op.estagioFunil === 'QUALIFICACAO' ? '40%' :
                           op.estagioFunil === 'PROPOSTA' ? '60%' :
                           op.estagioFunil === 'NEGOCIACAO' ? '80%' :
                           op.estagioFunil === 'FECHADA' || op.estagioFunil === 'PERDIDA' ? '100%' : '0%'
                  }}
                />
              </div>

              <div className="flex gap-2 pt-2 items-center">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => setOpDetalhes(op)}>
                  <Eye className="w-4 h-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-accent-gold" 
                    onClick={() => { setOpEmEdicao(op); setShowForm(true); }}>
                  <Pencil className="w-4 h-4" />
                </Button>

                {op.estagioFunil !== 'FECHADA' && op.estagioFunil !== 'PERDIDA' && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" 
                        title="Cancelar Oportunidade"
                        onClick={() => op.idOportunidade && handleCancelarOportunidade(op.idOportunidade)}>
                    <XCircle className="w-4 h-4" />
                    </Button>
                )}

                 <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => setOpParaDeletar(op)}>
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="flex-1"></div>

                {op.estagioFunil !== 'FECHADA' && op.estagioFunil !== 'PERDIDA' && (
                  op.estagioFunil === 'NEGOCIACAO' ? (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white ml-auto"
                        onClick={() => handleGanharOportunidade(op)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Fechar
                      </Button>
                  ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-accent-gold/10 border-accent-gold/30 text-accent-gold hover:bg-accent-gold/20 ml-auto"
                        onClick={() => op.idOportunidade && handleAvancarStatus(op.idOportunidade, op.estagioFunil)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
        
      {filteredOportunidades.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-muted-foreground">
             {estagioFilter === 'ativos' ? "Nenhuma oportunidade em andamento." : "Nenhuma oportunidade encontrada."}
          </p>
        </div>
      )}
    </div>
  );
};