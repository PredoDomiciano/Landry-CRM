import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockFuncionarios, Funcionario } from '@/data/mockData';
import { Search, Plus, Mail, User, Users, Award } from 'lucide-react';
import { FuncionarioForm } from '@/components/forms/FuncionarioForm';

export const FuncionariosView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [funcionarios, setFuncionarios] = useState(mockFuncionarios);
  const [showForm, setShowForm] = useState(false);

  const filteredFuncionarios = funcionarios.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFuncionario = (novoFuncionario: Omit<Funcionario, 'idFuncionario'>) => {
    const funcionario: Funcionario = {
      ...novoFuncionario,
      idFuncionario: Math.max(...funcionarios.map(f => f.idFuncionario)) + 1
    };
    setFuncionarios([...funcionarios, funcionario]);
  };

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getCargoColor = (cargo: string) => {
    if (cargo.toLowerCase().includes('gerente')) return 'text-accent-gold';
    if (cargo.toLowerCase().includes('senior')) return 'text-primary';
    if (cargo.toLowerCase().includes('designer')) return 'text-accent-rose';
    return 'text-muted-foreground';
  };

  const cargoStats = funcionarios.reduce((acc, funcionario) => {
    const categoria = funcionario.cargo.toLowerCase().includes('gerente') ? 'gerencia' :
                     funcionario.cargo.toLowerCase().includes('senior') ? 'senior' :
                     funcionario.cargo.toLowerCase().includes('designer') ? 'designer' : 'outros';
    acc[categoria] = (acc[categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      <FuncionarioForm 
        open={showForm} 
        onOpenChange={setShowForm} 
        onSubmit={handleAddFuncionario} 
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funcionários</h1>
          <p className="text-muted-foreground">Gerencie sua equipe Landry Joias</p>
        </div>
        <Button 
          className="bg-accent-gold text-accent-gold-foreground hover:bg-accent-gold/90"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar funcionários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent-gold/20 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-accent-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{funcionarios.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cargoStats['gerencia'] || 0}</p>
                <p className="text-xs text-muted-foreground">Gerência</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cargoStats['senior'] || 0}</p>
                <p className="text-xs text-muted-foreground">Senior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cargoStats['designer'] || 0}</p>
                <p className="text-xs text-muted-foreground">Designer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Equipe por Função</CardTitle>
          <CardDescription>Distribuição da equipe por área de atuação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-accent-gold" />
              <span className="text-sm font-medium">Gerência</span>
              <Badge variant="secondary">{cargoStats['gerencia'] || 0}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-primary" />
              <span className="text-sm font-medium">Consultores Senior</span>
              <Badge variant="secondary">{cargoStats['senior'] || 0}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-accent-rose" />
              <span className="text-sm font-medium">Designers</span>
              <Badge variant="secondary">{cargoStats['designer'] || 0}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFuncionarios.map((funcionario) => (
          <Card key={funcionario.idFuncionario} className="shadow-elegant hover:shadow-glow transition-smooth">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-accent-gold/20 text-accent-gold font-semibold">
                    {getInitials(funcionario.nome)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{funcionario.nome}</CardTitle>
                  <CardDescription className={`font-medium ${getCargoColor(funcionario.cargo)}`}>
                    {funcionario.cargo}
                  </CardDescription>
                </div>
                <Badge variant="outline">Ativo</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  {funcionario.email}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="w-4 h-4 mr-2" />
                  CPF: {funcionario.cpf}
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-2 bg-surface-variant rounded-lg">
                    <p className="text-xs text-muted-foreground">Vendas Mês</p>
                    <p className="text-sm font-bold text-accent-gold">R$ 45.2k</p>
                  </div>
                  <div className="p-2 bg-surface-variant rounded-lg">
                    <p className="text-xs text-muted-foreground">Clientes</p>
                    <p className="text-sm font-bold">12</p>
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Responsabilidades</p>
                <div className="flex flex-wrap gap-1">
                  {funcionario.cargo.toLowerCase().includes('gerente') && (
                    <>
                      <Badge variant="secondary" className="text-xs">Gestão Equipe</Badge>
                      <Badge variant="secondary" className="text-xs">Relatórios</Badge>
                    </>
                  )}
                  {funcionario.cargo.toLowerCase().includes('consultor') && (
                    <>
                      <Badge variant="secondary" className="text-xs">Atendimento</Badge>
                      <Badge variant="secondary" className="text-xs">Vendas</Badge>
                    </>
                  )}
                  {funcionario.cargo.toLowerCase().includes('designer') && (
                    <>
                      <Badge variant="secondary" className="text-xs">Criação</Badge>
                      <Badge variant="secondary" className="text-xs">Desenvolvimento</Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Perfil
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFuncionarios.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum funcionário encontrado</p>
        </div>
      )}
    </div>
  );
};