import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Plus, Mail, UserCog, Trash2 } from 'lucide-react'; // Adicionei UserCog e Trash2
import { FuncionarioForm } from '@/components/forms/FuncionarioForm';
import { useApp } from '@/contexts/AppContext';
import type { Funcionario } from '@/types/api';
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
} from "@/components/ui/alert-dialog"; // Importante para o aviso de exclusão

export const FuncionariosView = () => {
  // Pegando todas as funções do contexto (incluindo as novas delete/update)
  const { funcionarios, addFuncionario, updateFuncionario, deleteFuncionario } = useApp();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para o Formulário
  const [showForm, setShowForm] = useState(false);
  const [funcionarioEmEdicao, setFuncionarioEmEdicao] = useState<Funcionario | null>(null);
  
  // Estado para confirmação de exclusão (guarda quem será deletado)
  const [funcionarioParaDeletar, setFuncionarioParaDeletar] = useState<Funcionario | null>(null);

  const filteredFuncionarios = funcionarios.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função Inteligente: Salva (Novo) ou Atualiza (Existente)
  const handleSaveFuncionario = async (dados: Partial<Funcionario>) => {
    try {
      if (funcionarioEmEdicao) {
        // MODO EDIÇÃO
        if (updateFuncionario && funcionarioEmEdicao.idFuncionario) {
          await updateFuncionario(funcionarioEmEdicao.idFuncionario, dados);
          toast({ title: "Atualizado", description: "Dados do funcionário alterados." });
        }
      } else {
        // MODO CRIAÇÃO
        await addFuncionario(dados);
        toast({ title: "Criado", description: "Novo funcionário adicionado." });
      }
      setShowForm(false);
      setFuncionarioEmEdicao(null);
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
    }
  };

  // Abre o modal preenchido
  const handleClickPerfil = (funcionario: Funcionario) => {
    setFuncionarioEmEdicao(funcionario);
    setShowForm(true);
  };

  // Executa a exclusão de fato
  const handleConfirmDelete = async () => {
    if (!funcionarioParaDeletar || !deleteFuncionario) return;

    try {
      if (funcionarioParaDeletar.idFuncionario) {
          await deleteFuncionario(funcionarioParaDeletar.idFuncionario);
          toast({ title: "Removido", description: "Funcionário removido com sucesso." });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao remover funcionário.", variant: "destructive" });
    } finally {
      setFuncionarioParaDeletar(null); // Fecha o alerta
    }
  };

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Equipe</h1>
          <p className="text-muted-foreground">Gerencie os colaboradores da Landry Jóias.</p>
        </div>
        <Button 
          onClick={() => { setFuncionarioEmEdicao(null); setShowForm(true); }} 
          className="bg-accent-gold hover:bg-yellow-600 text-white shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      {/* Barra de Busca */}
      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border shadow-sm max-w-md">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <Input
          placeholder="Buscar por nome, cargo ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0"
        />
      </div>

      {/* Formulário (Reutilizável para Criar e Editar) */}
      <FuncionarioForm 
        open={showForm} 
        onOpenChange={(open) => {
            setShowForm(open);
            if (!open) setFuncionarioEmEdicao(null);
        }}
        onSubmit={handleSaveFuncionario}
        initialData={funcionarioEmEdicao}
      />

      {/* Alerta de Confirmação de Exclusão */}
      <AlertDialog open={!!funcionarioParaDeletar} onOpenChange={() => setFuncionarioParaDeletar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação removerá <b>{funcionarioParaDeletar?.nome}</b> do sistema permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
            >
                Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFuncionarios.map((funcionario) => (
          <Card key={funcionario.idFuncionario} className="hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-6 flex flex-col items-center text-center">
              
              {/* Avatar */}
              <div className="relative mb-4">
                <Avatar className="w-20 h-20 border-4 border-slate-50 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {getInitials(funcionario.nome)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              {/* Informações */}
              <h3 className="font-bold text-lg text-slate-900 mb-1">{funcionario.nome}</h3>
              <p className="text-sm text-accent-gold font-medium mb-4 uppercase tracking-wide">{funcionario.cargo}</p>
              
              <div className="w-full space-y-3 mb-4">
                <div className="flex items-center justify-center text-sm text-slate-600 bg-slate-50 py-1.5 px-3 rounded-full">
                  <Mail className="w-3 h-3 mr-2 text-slate-400" />
                  <span className="truncate max-w-[180px]" title={funcionario.email}>{funcionario.email}</span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 w-full mt-auto">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 hover:bg-slate-50 hover:text-primary border-slate-200"
                    onClick={() => handleClickPerfil(funcionario)}
                >
                  <UserCog className="w-4 h-4 mr-2" />
                  Perfil
                </Button>
                
                <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:text-red-700 border-slate-200"
                    onClick={() => setFuncionarioParaDeletar(funcionario)}
                >
                  <Trash2 className="w-4 h-4" />
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