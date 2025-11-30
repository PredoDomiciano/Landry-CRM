import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Target, ChevronRight } from 'lucide-react';
import { OportunidadeForm } from '@/components/forms/OportunidadeForm';
import { useApp } from '@/contexts/AppContext';
import type { Oportunidade } from '@/types/api';
import { ESTAGIO_FUNIL_LABELS } from '@/types/api';

const statusColors: Record<string, string> = {
  'PROSPECCAO': 'text-slate-600 bg-slate-100',
  'QUALIFICACAO': 'text-blue-600 bg-blue-100', 
  'PROPOSTA': 'text-orange-600 bg-orange-100',
  'NEGOCIACAO': 'text-purple-600 bg-purple-100',
  'FECHADA': 'text-green-600 bg-green-100',
  'PERDIDA': 'text-red-600 bg-red-100'
};

export const OportunidadesView = () => {
  const { oportunidades, addOportunidade, updateOportunidadeStatus } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [estagioFilter, setEstagioFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const filteredOportunidades = oportunidades.filter(op => {
    const matchesSearch = op.nomeOportunidade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstagio = estagioFilter === 'all' || op.estagioFunil === estagioFilter;
    return matchesSearch && matchesEstagio;
  });

  const handleAddOportunidade = async (novaOp: Partial<Oportunidade>) => {
    await addOportunidade(novaOp);
    setShowForm(false);
  };

  const handleAvancarStatus = async (id: number, currentStage: string) => {
      const stages = ['PROSPECCAO', 'QUALIFICACAO', 'PROPOSTA', 'NEGOCIACAO', 'FECHADA'];
      const index = stages.indexOf(currentStage);
      if (index >= 0 && index < stages.length - 1) {
          await updateOportunidadeStatus(id, stages[index + 1]);
      }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Oportunidades</h1>
          <p className="text-muted-foreground">Pipeline de vendas e negociações em andamento.</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-accent-gold hover:bg-yellow-600 text-white">
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estágio do Funil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PROSPECCAO">Prospecção</SelectItem>
            <SelectItem value="PROPOSTA">Proposta</SelectItem>
            <SelectItem value="NEGOCIACAO">Negociação</SelectItem>
            <SelectItem value="FECHADA">Fechada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <OportunidadeForm 
        open={showForm} 
        onOpenChange={setShowForm}
        onSubmit={handleAddOportunidade}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOportunidades.map((op) => (
          <Card key={op.idOportunidade} className="group hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                   <h3 className="font-semibold text-lg text-slate-800">{op.nomeOportunidade}</h3>
                   <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {op.cliente ? op.cliente.nomeDoComercio : 'Cliente não vinculado'}
                   </div>
                </div>
                <Badge variant="outline" className={`${statusColors[op.estagioFunil]} border-0 font-medium`}>
                  {ESTAGIO_FUNIL_LABELS[op.estagioFunil] || op.estagioFunil}
                </Badge>
              </div>

              <div className="py-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-800">
                    R$ {op.valorEstimado ? op.valorEstimado.toLocaleString('pt-BR') : '0,00'}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                   Fechamento est: {op.dataDeFechamentoEstimada ? new Date(op.dataDeFechamentoEstimada).toLocaleDateString('pt-BR') : 'N/A'}
                </div>
              </div>

              {/* Progress Bar Visual */}
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-accent-gold h-2 rounded-full transition-all duration-500"
                  style={{ width: 
                           op.estagioFunil === 'PROSPECCAO' ? '20%' :
                           op.estagioFunil === 'QUALIFICACAO' ? '40%' :
                           op.estagioFunil === 'PROPOSTA' ? '60%' :
                           op.estagioFunil === 'NEGOCIACAO' ? '80%' :
                           op.estagioFunil === 'FECHADA' ? '100%' : '0%'
                  }}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Detalhes
                </Button>
                {op.estagioFunil !== 'FECHADA' && op.estagioFunil !== 'PERDIDA' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-accent-gold/10 border-accent-gold/30 text-accent-gold hover:bg-accent-gold/20"
                    onClick={() => op.idOportunidade && handleAvancarStatus(op.idOportunidade, op.estagioFunil)}
                  >
                    <ChevronRight className="w-4 h-4" />
                    Avançar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOportunidades.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma oportunidade encontrada</p>
        </div>
      )}
    </div>
  );
};