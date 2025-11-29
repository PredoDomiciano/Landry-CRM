import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cliente } from '@/data/mockData';
import { Search, Plus, Mail, Phone, MapPin, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { ClienteForm } from '@/components/forms/ClienteForm';
import { useApp } from '@/contexts/AppContext';

export const ClientesView = () => {
  const { clientes, oportunidades, addCliente } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome_do_comercio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.contato.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCliente = (novoCliente: Omit<Cliente, 'idCliente'>) => {
    addCliente(novoCliente);
    setShowForm(false);
  };

  const getClienteOportunidades = (clienteId: number) => {
    return oportunidades.filter(op => op.clienteId === clienteId);
  };

  return (
    <div className="p-6 space-y-6">
      <ClienteForm 
        open={showForm} 
        onOpenChange={setShowForm} 
        onSubmit={handleAddCliente} 
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie sua carteira de clientes</p>
        </div>
        <Button 
          className="bg-accent-gold text-accent-gold-foreground hover:bg-accent-gold/90"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent-gold/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-accent-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clientes.length}</p>
                <p className="text-xs text-muted-foreground">Total de Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{oportunidades.length}</p>
                <p className="text-xs text-muted-foreground">Oportunidades Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">R$ {oportunidades.reduce((sum, op) => sum + op.valor_estimado, 0).toLocaleString('pt-BR')}</p>
                <p className="text-xs text-muted-foreground">Pipeline Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClientes.map((cliente) => {
          const clienteOportunidades = getClienteOportunidades(cliente.idCliente);
          const valorTotal = clienteOportunidades.reduce((sum, op) => sum + op.valor_estimado, 0);

          return (
            <Card key={cliente.idCliente} className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{cliente.nome_do_comercio}</CardTitle>
                    <CardDescription>
                      Cliente desde {new Date(cliente.data).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{clienteOportunidades.length} oportunidades</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contato */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {cliente.contato.email}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    {cliente.contato.numero}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {cliente.contato.endereco}
                  </div>
                </div>

                {/* Oportunidades */}
                {clienteOportunidades.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Pipeline</p>
                      <p className="text-sm font-bold text-accent-gold">
                        R$ {valorTotal.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="space-y-1">
                      {clienteOportunidades.slice(0, 2).map((op) => (
                        <div key={op.idOportunidade} className="flex items-center justify-between text-xs">
                          <span className="truncate flex-1 mr-2">{op.nome_da_oportunidade}</span>
                          <Badge variant="outline" className="text-xs">
                            {op.status}
                          </Badge>
                        </div>
                      ))}
                      {clienteOportunidades.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{clienteOportunidades.length - 2} mais oportunidades
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredClientes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum cliente encontrado</p>
        </div>
      )}
    </div>
  );
};
