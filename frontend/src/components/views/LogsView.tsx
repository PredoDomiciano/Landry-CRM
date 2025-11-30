import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useApp } from '@/contexts/AppContext';
import { Search, Clock, Activity, Phone, Mail, Calendar, AlertCircle } from 'lucide-react';

// Definição local para garantir que não quebre a importação
const TIPO_ATIVIDADE_LABELS: Record<number, string> = {
  1: 'Reunião',
  2: 'Ligação',
  3: 'Email',
  4: 'Sistema',
  5: 'Outro'
};

const activityIcons: Record<number, React.ElementType> = {
  1: Calendar, // Reunião
  2: Phone,    // Ligação
  3: Mail,     // Email
  4: Activity, // Sistema
  5: Activity, // Outro
};

export const LogsView = () => {
  const { logs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Debug: Verifique no console do navegador se os logs estão chegando
  // console.log("Logs carregados:", logs);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Proteção contra campos nulos/undefined
      const titulo = log.titulo || '';
      const descricao = log.descricao || '';
      const usuarioEmail = log.usuario?.email || '';

      return (
        titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuarioEmail.includes(searchTerm)
      );
    });
  }, [logs, searchTerm]);

  // Ordenar logs por data (mais recente primeiro) com proteção de data inválida
  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort((a, b) => {
      const dateA = new Date(a.data).getTime() || 0;
      const dateB = new Date(b.data).getTime() || 0;
      return dateB - dateA;
    });
  }, [filteredLogs]);

  const getInitials = (nome: string) => {
    return nome ? nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
  };

  // Função auxiliar para formatar data com segurança
  const formatDate = (dateString: string | Date) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return { date: 'Data Inválida', time: '--:--' };
        
        return {
            date: date.toLocaleDateString('pt-BR'),
            time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
    } catch (e) {
        return { date: 'Erro', time: '--:--' };
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Log de Atividades</h1>
          <p className="text-muted-foreground">Histórico de ações e eventos do sistema.</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border shadow-sm max-w-md">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <Input
          placeholder="Buscar nos logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="space-y-4">
        {sortedLogs.map((log) => {
          const Icon = activityIcons[log.tipoDeAtividade] || Activity;
          const { date, time } = formatDate(log.data);
          // Fallback seguro se usuario for null
          const userName = log.usuario?.email || 'Sistema';
          const labelAtividade = TIPO_ATIVIDADE_LABELS[log.tipoDeAtividade] || 'Geral';

          return (
            <Card key={log.idLog || Math.random()} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-100 p-2 rounded-full mt-1">
                    <Icon className="w-5 h-5 text-slate-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-900">{log.titulo || 'Sem título'}</h4>
                        <p className="text-slate-600 text-sm mt-1">{log.descricao || 'Sem descrição'}</p>
                      </div>
                      
                      <Badge variant="secondary" className="ml-3 whitespace-nowrap">
                        {labelAtividade}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                            {getInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate max-w-[150px]" title={userName}>{userName}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-4 h-4" />
                        <span>{date} às {time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedLogs.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Nenhuma atividade encontrada</h3>
          <p className="text-muted-foreground mt-1">
             Verifique se o backend está retornando dados ou tente outra busca.
          </p>
        </div>
      )}
    </div>
  );
};