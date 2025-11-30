import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Plus, Mail } from 'lucide-react';
import { FuncionarioForm } from '@/components/forms/FuncionarioForm';
import { useApp } from '@/contexts/AppContext';
import type { Funcionario } from '@/types/api';

export const FuncionariosView = () => {
  const { funcionarios, addFuncionario } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredFuncionarios = funcionarios.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFuncionario = async (novoFuncionario: Partial<Funcionario>) => {
    await addFuncionario(novoFuncionario);
    setShowForm(false);
  };

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Equipe</h1>
          <p className="text-muted-foreground">Gerencie os colaboradores da Landry Jóias.</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-accent-gold hover:bg-yellow-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border shadow-sm max-w-md">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <Input
          placeholder="Buscar por nome ou cargo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0"
        />
      </div>

      <FuncionarioForm 
        open={showForm} 
        onOpenChange={setShowForm}
        onSubmit={handleAddFuncionario}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFuncionarios.map((funcionario) => (
          <Card key={funcionario.idFuncionario} className="hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="w-20 h-20 border-4 border-slate-50 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {getInitials(funcionario.nome)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 mb-1">{funcionario.nome}</h3>
              <p className="text-sm text-accent-gold font-medium mb-4 uppercase tracking-wide">{funcionario.cargo}</p>
              
              <div className="w-full space-y-3 mb-4">
                <div className="flex items-center justify-center text-sm text-slate-600 bg-slate-50 py-1.5 px-3 rounded-full">
                  <Mail className="w-3 h-3 mr-2 text-slate-400" />
                  <span className="truncate max-w-[180px]">{funcionario.email}</span>
                </div>
              </div>

              <div className="flex gap-2 w-full mt-auto">
                <Button variant="outline" size="sm" className="flex-1">
                  Perfil
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