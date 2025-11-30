import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useApp } from '@/contexts/AppContext';
import { Search, Plus, Clock, Activity, Phone, Mail, Calendar } from 'lucide-react';
import { TIPO_ATIVIDADE_LABELS } from '@/types/api';

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

  const filteredLogs = logs.filter(log =>
    log.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.usuario?.email.includes(searchTerm)
  );

  // Ordenar logs por data (mais recente primeiro)
  const sortedLogs = [...filteredLogs].sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  const getInitials = (nome: string) => {
    return nome ? nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
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
          const logDate = new Date(log.data);
          const dateStr = logDate.toLocaleDateString('pt-BR');
          const timeStr = logDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          const userName = log.usuario?.email || 'Sistema';

          return (
            <Card key={log.idLog} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-100 p-2 rounded-full mt-1">
                    <Icon className="w-5 h-5 text-slate-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-900">{log.titulo}</h4>
                        <p className="text-slate-600 text-sm mt-1">{log.descricao}</p>
                      </div>
                      
                      <Badge variant="secondary" className="ml-3">
                        {TIPO_ATIVIDADE_LABELS[log.tipoDeAtividade] || 'Outro'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {getInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{userName}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{dateStr} às {timeStr}</span>
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
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma atividade encontrada</p>
        </div>
      )}
    </div>
  );
};