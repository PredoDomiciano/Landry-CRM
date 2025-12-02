import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Mail, Building, MapPin, Pencil, Trash2, Eye, Phone } from 'lucide-react';
import { ClienteForm } from '@/components/forms/ClienteForm';
import { useApp } from '@/contexts/AppContext';
import type { Cliente } from '@/types/api';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export const ClientesView = () => {
  // Casting para garantir acesso a todas as funções do contexto
  const { clientes, oportunidades, addCliente, deleteCliente, updateCliente } = useApp() as any; 
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para CRUD
  const [showForm, setShowForm] = useState(false);
  const [clienteEmEdicao, setClienteEmEdicao] = useState<Cliente | null>(null);
  const [clienteParaDeletar, setClienteParaDeletar] = useState<Cliente | null>(null);
  
  // Estado para Detalhes
  const [clienteDetalhes, setClienteDetalhes] = useState<Cliente | null>(null);

  const filteredClientes = clientes.filter((cliente: any) =>
    (cliente.nomeDoComercio || cliente.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cnpj?.includes(searchTerm)
  );

  const handleSaveCliente = async (dados: Partial<Cliente>) => {
    try {
      if (clienteEmEdicao && clienteEmEdicao.idCliente) {
        // EDIÇÃO
        await updateCliente(clienteEmEdicao.idCliente, dados);
        toast({ title: "Sucesso", description: "Cliente atualizado com sucesso." });
      } else {
        // CRIAÇÃO
        await addCliente(dados);
        toast({ title: "Sucesso", description: "Cliente cadastrado com sucesso." });
      }
      setShowForm(false);
      setClienteEmEdicao(null);
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Falha ao salvar cliente.", variant: "destructive" });
    }
  };

  const handleConfirmDelete = async () => {
    if (!clienteParaDeletar || !clienteParaDeletar.idCliente) return;

    try {
      await deleteCliente(clienteParaDeletar.idCliente);
      toast({ title: "Removido", description: `Cliente excluído com sucesso.` });
    } catch (error: any) {
      console.error("Erro ao excluir:", error);
      // CORREÇÃO AQUI: Mostra a mensagem real do backend (ex: erro de foreign key)
      toast({ 
        title: "Erro ao excluir", 
        description: error.message || "O banco de dados impediu a exclusão (verifique vínculos).", 
        variant: "destructive" 
      });
    } finally {
      setClienteParaDeletar(null);
    }
  };

  const handleEditClick = (cliente: Cliente) => {
    setClienteEmEdicao(cliente);
    setShowForm(true);
  };

  const handleOpenChange = (open: boolean) => {
    setShowForm(open);
    if (!open) setClienteEmEdicao(null);
  };

  // Helper para buscar oportunidades ligadas a este cliente
  const getClienteOportunidades = (clienteId: number | undefined) => {
    if (!clienteId) return [];
    return oportunidades.filter((op: any) => (op.cliente as any)?.idCliente === clienteId);
  };

  // Helper ATUALIZADO para pegar o endereço completo (incluindo Número)
  const getEnderecoCompleto = (cliente: Cliente) => {
    // Tenta pegar do objeto aninhado 'contato' (novo padrão) ou da raiz (antigo)
    const contato = (cliente.contato as any) || (cliente as any);
    
    const rua = contato.rua || '';
    const numero = contato.numeroCasa ? `, Nº ${contato.numeroCasa}` : '';
    const bairro = contato.bairro ? ` - ${contato.bairro}` : '';
    const cidade = contato.cidade ? ` - ${contato.cidade}` : '';
    const cep = contato.cep ? ` (${contato.cep})` : '';
    
    if (!rua && !cidade) return 'Endereço não informado';

    return `${rua}${numero}${bairro}${cidade}${cep}`;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Clientes</h1>
          <p className="text-muted-foreground">Gerencie sua carteira de clientes e relacionamentos.</p>
        </div>
        <Button 
          onClick={() => { setClienteEmEdicao(null); setShowForm(true); }}
          className="bg-accent-gold hover:bg-yellow-600 text-white shadow-md transition-all hover:shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border shadow-sm max-w-md">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <Input
          placeholder="Buscar por nome, email ou CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0"
        />
      </div>

      <ClienteForm 
        open={showForm} 
        onOpenChange={handleOpenChange}
        onSubmit={handleSaveCliente}
        initialData={clienteEmEdicao}
      />

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={!!clienteParaDeletar} onOpenChange={() => setClienteParaDeletar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação removerá <b>{clienteParaDeletar?.nomeDoComercio || clienteParaDeletar?.nome}</b> e todos os dados relacionados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
            >
                Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Detalhes */}
      <Dialog open={!!clienteDetalhes} onOpenChange={(open) => !open && setClienteDetalhes(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{clienteDetalhes?.nomeDoComercio || clienteDetalhes?.nome}</DialogTitle>
            <DialogDescription>Ficha completa do cliente.</DialogDescription>
          </DialogHeader>
          
          {clienteDetalhes && (
            <div className="space-y-4 py-2 text-sm">
               <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                    <Building className="w-3 h-3" /> CNPJ / CPF
                  </span>
                  <p className="font-medium text-slate-700">{clienteDetalhes.cnpj || clienteDetalhes.cpf || 'Não informado'}</p>
               </div>

               <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Contato
                  </span>
                  <p className="font-medium text-slate-700">{clienteDetalhes.email}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                     <Phone className="w-3 h-3" /> {(clienteDetalhes as any).telefone || 'Telefone não informado'}
                  </p>
               </div>

               <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Endereço Completo
                  </span>
                  <p className="font-medium text-slate-700 leading-snug">
                    {getEnderecoCompleto(clienteDetalhes)}
                  </p>
               </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setClienteDetalhes(null)}>Fechar</Button>
            <Button 
                className="bg-accent-gold text-white" 
                onClick={() => {
                  const cliente = clienteDetalhes;
                  setClienteDetalhes(null);
                  if(cliente) handleEditClick(cliente);
                }}
            >
                <Pencil className="w-4 h-4 mr-2" /> Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClientes.map((cliente: any) => {
          const clienteOportunidades = getClienteOportunidades(cliente.idCliente);
          
          return (
            <Card key={cliente.idCliente} className="group hover:shadow-elegant transition-all duration-300 border-slate-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                      {cliente.nomeDoComercio?.substring(0, 2).toUpperCase() || cliente.nome?.substring(0, 2).toUpperCase() || '?'}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-semibold text-lg leading-tight text-slate-800 truncate" title={cliente.nomeDoComercio || cliente.nome}>
                        {cliente.nomeDoComercio || cliente.nome}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1 truncate">
                        <Building className="w-3 h-3 shrink-0" />
                        {cliente.cnpj || cliente.cpf || 'Doc. pendente'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-slate-50 text-slate-600 shrink-0">
                    {clienteOportunidades.length} negócios
                  </Badge>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center text-sm text-slate-600 truncate">
                    <Mail className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span className="truncate" title={cliente.email}>{cliente.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span className="truncate" title={getEnderecoCompleto(cliente)}>
                        {/* Exibe cidade/estado ou parte do endereço no card */}
                        {((cliente.contato as any)?.cidade || (cliente as any).cidade) || 'Endereço não inf.'}
                    </span>
                  </div>
                </div>

                {clienteOportunidades.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Últimas Oportunidades:</p>
                    <div className="space-y-1">
                      {clienteOportunidades.slice(0, 2).map((op: any) => (
                        <div key={op.idOportunidade} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded">
                          <span className="truncate flex-1 mr-2 text-slate-700">{op.nomeOportunidade}</span>
                          <Badge variant="secondary" className="text-[10px] h-5 shrink-0">
                            {ESTAGIO_FUNIL_LABELS[op.estagioFunil] || op.estagioFunil}
                          </Badge>
                        </div>
                      ))}
                      {clienteOportunidades.length > 2 && (
                        <p className="text-xs text-center text-muted-foreground">
                          +{clienteOportunidades.length - 2} outras
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2 mt-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-slate-200 hover:bg-slate-50"
                    onClick={() => setClienteDetalhes(cliente)}
                  >
                    <Eye className="w-4 h-4 mr-2" /> Detalhes
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => setClienteParaDeletar(cliente)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-accent-gold hover:bg-yellow-50"
                    onClick={() => handleEditClick(cliente)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredClientes.length === 0 && (
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Nenhum cliente encontrado</h3>
          <p className="text-muted-foreground mt-1">
            Não encontramos resultados para "{searchTerm}". Tente outro termo ou adicione um novo cliente.
          </p>
        </div>
      )}
    </div>
  );
};