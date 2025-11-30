import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Package, Calendar, Eye, ChevronRight } from 'lucide-react';
import { PedidoForm } from '@/components/forms/PedidoForm';
import { useApp } from '@/contexts/AppContext';
import type { Pedido } from '@/types/api';
import { STATUS_PEDIDO_LABELS } from '@/types/api';

const statusColors: Record<string, string> = {
  'PENDENTE': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'CONFIRMADO': 'bg-blue-100 text-blue-700 border-blue-200',
  'PRODUCAO': 'bg-purple-100 text-purple-700 border-purple-200',
  'PAGO': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'ENVIADO': 'bg-pink-100 text-pink-700 border-pink-200',
  'ENTREGUE': 'bg-green-100 text-green-700 border-green-200',
  'CANCELADO': 'bg-red-100 text-red-700 border-red-200'
};

export const PedidosView = () => {
  const { pedidos, addPedido, updatePedidoStatus } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const filteredPedidos = pedidos.filter(pedido => {
    // Busca por ID (converte numero para string) ou valor
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
        pedido.idPedido?.toString().includes(searchLower) ||
        pedido.valorTotal.toString().includes(searchLower);
        
    const matchesStatus = statusFilter === 'all' || pedido.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddPedido = async (novoPedido: Partial<Pedido>) => {
    await addPedido(novoPedido);
    setShowForm(false);
  };

  const handleAvancarStatus = async (id: number, currentStatus: string) => {
    // Fluxo simples de status. Podes ajustar a ordem conforme regra de negócio
    const fluxo = ['PENDENTE', 'CONFIRMADO', 'PAGO', 'PRODUCAO', 'ENVIADO', 'ENTREGUE'];
    const index = fluxo.indexOf(currentStatus);
    
    if (index >= 0 && index < fluxo.length - 1) {
      const nextStatus = fluxo[index + 1];
      await updatePedidoStatus(id, nextStatus);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Pedidos</h1>
          <p className="text-muted-foreground">Acompanhe o fluxo de vendas e entregas.</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-accent-gold hover:bg-yellow-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID do pedido..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PENDENTE">Pendente</SelectItem>
            <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
            <SelectItem value="PRODUCAO">Em Produção</SelectItem>
            <SelectItem value="ENVIADO">Enviado</SelectItem>
            <SelectItem value="ENTREGUE">Entregue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PedidoForm 
        open={showForm} 
        onOpenChange={setShowForm}
        onSubmit={handleAddPedido}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPedidos.map((pedido) => (
          <Card key={pedido.idPedido} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-accent-gold">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Pedido #{pedido.idPedido}</h3>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                       <Calendar className="w-3 h-3" />
                       {new Date(pedido.data).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${statusColors[pedido.status] || 'bg-slate-100'} border px-3 py-1`}
                >
                  {STATUS_PEDIDO_LABELS[pedido.status] || pedido.status}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center">
                   <span className="text-sm text-slate-600">Valor Total</span>
                   <span className="text-lg font-bold text-slate-900">R$ {pedido.valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" /> Detalhes
                  </Button>
                  
                  {pedido.status !== 'ENTREGUE' && pedido.status !== 'CANCELADO' && (
                    <Button 
                      size="sm"
                      className="bg-accent-gold/10 text-accent-gold hover:bg-accent-gold/20 border-accent-gold/20 border"
                      onClick={() => pedido.idPedido && handleAvancarStatus(pedido.idPedido, pedido.status)}
                    >
                      Avançar <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPedidos.length === 0 && (
        <div className="text-center py-12">
           <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum pedido encontrado</p>
        </div>
      )}
    </div>
  );
};