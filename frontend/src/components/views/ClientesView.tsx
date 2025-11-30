import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Mail, Building, MapPin } from 'lucide-react';
import { ClienteForm } from '@/components/forms/ClienteForm';
import { useApp } from '@/contexts/AppContext';
import type { Cliente } from '@/types/api';
import { ESTAGIO_FUNIL_LABELS } from '@/types/api';

export const ClientesView = () => {
  // CONEXÃO COM O BACKEND: Usamos os dados globais
  const { clientes, oportunidades, addCliente } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Filtragem local usando os campos do Java (nomeDoComercio, cnpj, email)
  const filteredClientes = clientes.filter(cliente =>
    cliente.nomeDoComercio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cnpj.includes(searchTerm)
  );

  const handleAddCliente = async (novoCliente: Partial<Cliente>) => {
    // A função addCliente do contexto já faz o refresh dos dados
    await addCliente(novoCliente);
    setShowForm(false);
  };

  // Helper para buscar oportunidades ligadas a este cliente
  const getClienteOportunidades = (clienteId: number | undefined) => {
    if (!clienteId) return [];
    return oportunidades.filter(op => op.cliente?.idCliente === clienteId);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Clientes</h1>
          <p className="text-muted-foreground">Gerencie sua carteira de clientes e relacionamentos.</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-accent-gold hover:bg-yellow-600 text-white shadow-md transition-all hover:shadow-lg">
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
        onOpenChange={setShowForm}
        onSubmit={handleAddCliente}
      />

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClientes.map((cliente) => {
          const clienteOportunidades = getClienteOportunidades(cliente.idCliente);
          
          return (
            <Card key={cliente.idCliente} className="group hover:shadow-elegant transition-all duration-300 border-slate-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {/* Pegamos as duas primeiras letras do Nome do Comércio */}
                      {cliente.nomeDoComercio.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg leading-tight text-slate-800">{cliente.nomeDoComercio}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Building className="w-3 h-3" />
                        CNPJ: {cliente.cnpj}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-slate-50 text-slate-600">
                    {clienteOportunidades.length} negócios
                  </Badge>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail className="w-4 h-4 mr-2 text-slate-400" />
                    {cliente.email}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    Brasil
                  </div>
                </div>

                {clienteOportunidades.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Últimas Oportunidades:</p>
                    <div className="space-y-1">
                      {clienteOportunidades.slice(0, 2).map((op) => (
                        <div key={op.idOportunidade} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded">
                          <span className="truncate flex-1 mr-2 text-slate-700">{op.nomeOportunidade}</span>
                          <Badge variant="secondary" className="text-[10px] h-5">
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
                  <Button variant="outline" size="sm" className="flex-1 border-slate-200 hover:bg-slate-50">
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm" className="px-3">
                    <Mail className="w-4 h-4" />
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