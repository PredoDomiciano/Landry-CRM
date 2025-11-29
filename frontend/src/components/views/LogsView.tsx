import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { Search, Plus, Clock, User, Activity, Phone, Mail, Calendar } from 'lucide-react';

const activityIcons = {
  'Reunião': Calendar,
  'Ligação': Phone,
  'Email': Mail,
  'Atividade': Activity
};

const statusColors = {
  'Concluído': 'success',
  'Pendente retorno': 'warning', 
  'Enviado': 'default',
  'Em andamento': 'secondary',
  'Cancelado': 'destructive'
};

export const LogsView = () => {
  const { logs, addLog, funcionarios } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newLog, setNewLog] = useState({
    tipo_de_atividade: '',
    assunto: '',
    descricao: '',
    status: ''
  });

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = tipoFilter === 'all' || log.tipo_de_atividade === tipoFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getFuncionarioNome = (usuarioId: number) => {
    const funcionario = funcionarios.find(f => f.idFuncionario === usuarioId);
    return funcionario?.nome || 'Sistema';
  };

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const tipoStats = logs.reduce((acc, log) => {
    acc[log.tipo_de_atividade] = (acc[log.tipo_de_atividade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusStats = logs.reduce((acc, log) => {
    acc[log.status] = (acc[log.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedLogs = [...filteredLogs].sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  const handleAddLog = () => {
    if (newLog.tipo_de_atividade && newLog.assunto && newLog.descricao && newLog.status) {
      addLog(newLog);
      setNewLog({ tipo_de_atividade: '', assunto: '', descricao: '', status: '' });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Log de Atividades</h1>
          <p className="text-muted-foreground">Histórico de todas as atividades da equipe</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent-gold text-accent-gold-foreground hover:bg-accent-gold/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Atividade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Atividade</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Tipo de Atividade</Label>
                <Select value={newLog.tipo_de_atividade} onValueChange={(v) => setNewLog({ ...newLog, tipo_de_atividade: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reunião">Reunião</SelectItem>
                    <SelectItem value="Ligação">Ligação</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Atividade">Atividade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assunto</Label>
                <Input 
                  value={newLog.assunto} 
                  onChange={(e) => setNewLog({ ...newLog, assunto: e.target.value })}
                  placeholder="Assunto da atividade"
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea 
                  value={newLog.descricao} 
                  onChange={(e) => setNewLog({ ...newLog, descricao: e.target.value })}
                  placeholder="Descreva a atividade"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={newLog.status} onValueChange={(v) => setNewLog({ ...newLog, status: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                    <SelectItem value="Pendente retorno">Pendente retorno</SelectItem>
                    <SelectItem value="Enviado">Enviado</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddLog} className="w-full bg-accent-gold text-accent-gold-foreground hover:bg-accent-gold/90">
                Adicionar Atividade
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar atividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="Reunião">Reunião</SelectItem>
            <SelectItem value="Ligação">Ligação</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Atividade">Atividade</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="Concluído">Concluído</SelectItem>
            <SelectItem value="Pendente retorno">Pendente retorno</SelectItem>
            <SelectItem value="Enviado">Enviado</SelectItem>
            <SelectItem value="Em andamento">Em andamento</SelectItem>
            <SelectItem value="Cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent-gold/20 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-accent-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{logs.length}</p>
                <p className="text-xs text-muted-foreground">Total Atividades</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusStats['Concluído'] || 0}</p>
                <p className="text-xs text-muted-foreground">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusStats['Pendente retorno'] || 0}</p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(logs.map(log => log.usuarioId)).size}
                </p>
                <p className="text-xs text-muted-foreground">Usuários Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Types Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Atividade</CardTitle>
          <CardDescription>Distribuição das atividades por tipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(tipoStats).map(([tipo, count]) => {
              const Icon = activityIcons[tipo as keyof typeof activityIcons] || Activity;
              return (
                <div key={tipo} className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-accent-gold" />
                  <span className="text-sm font-medium">{tipo}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Timeline de Atividades</h3>
        
        {sortedLogs.map((log) => {
          const { date, time } = formatDateTime(log.data);
          const funcionarioNome = getFuncionarioNome(log.usuarioId);
          const Icon = activityIcons[log.tipo_de_atividade as keyof typeof activityIcons] || Activity;
          
          return (
            <Card key={log.idLog} className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-accent-gold" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-lg">{log.assunto}</h4>
                        <p className="text-muted-foreground text-sm mt-1">{log.descricao}</p>
                      </div>
                      
                      <Badge 
                        variant={statusColors[log.status as keyof typeof statusColors] as any || 'secondary'}
                        className="ml-3"
                      >
                        {log.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {getInitials(funcionarioNome)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{funcionarioNome}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{date} às {time}</span>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {log.tipo_de_atividade}
                      </Badge>
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
