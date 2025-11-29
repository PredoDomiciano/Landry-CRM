import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const faqData = [
  {
    id: 'sistema',
    categoria: 'Sistema',
    perguntas: [
      {
        pergunta: 'Como adicionar um novo cliente ao sistema?',
        resposta: 'Para adicionar um novo cliente, vá para a aba "Clientes" e clique no botão "Novo Cliente". Preencha todos os campos obrigatórios: nome do comércio, email, telefone e endereço completo. Após preencher, clique em "Salvar Cliente".'
      },
      {
        pergunta: 'Como criar uma nova oportunidade de venda?',
        resposta: 'Na aba "Oportunidades", clique em "Nova Oportunidade". Selecione o cliente, defina o nome da oportunidade, descrição, valor estimado, data de fechamento e status. O sistema irá adicionar automaticamente ao funil de vendas.'
      },
      {
        pergunta: 'Como gerenciar o estoque de produtos?',
        resposta: 'Na aba "Produtos", você pode visualizar todos os produtos cadastrados com seus respectivos estoques. O sistema alertará automaticamente quando o estoque estiver baixo (2 unidades ou menos) com um badge amarelo, e quando estiver zerado com um badge vermelho.'
      }
    ]
  },
  {
    id: 'vendas',
    categoria: 'Vendas',
    perguntas: [
      {
        pergunta: 'Como acompanhar o progresso de uma oportunidade?',
        resposta: 'Cada oportunidade possui uma barra de progresso baseada no status: Prospecção (20%), Qualificação (40%), Proposta (60%), Negociação (80%), Fechada (100%). Você pode atualizar o status a qualquer momento na aba Oportunidades.'
      },
      {
        pergunta: 'Como calcular o valor total do pipeline?',
        resposta: 'O valor total do pipeline é calculado automaticamente somando todas as oportunidades ativas (excluindo as perdidas e fechadas). Este valor é exibido no card de estatísticas da aba Oportunidades.'
      },
      {
        pergunta: 'Qual a diferença entre pedido confirmado e em produção?',
        resposta: 'Pedido "Confirmado" significa que o cliente aceitou a proposta e o pedido foi validado. "Em Produção" indica que as joias estão sendo manufaturadas. A sequência normal é: Pendente → Confirmado → Produção → Enviado → Entregue.'
      }
    ]
  },
  {
    id: 'produtos',
    categoria: 'Produtos',
    perguntas: [
      {
        pergunta: 'Como cadastrar um novo produto?',
        resposta: 'Vá para a aba "Produtos" e clique em "Novo Produto". Preencha: nome, descrição, tipo (anel, colar, brinco, etc.), material, valor unitário, quantidade em estoque e tamanho. Todos os campos são obrigatórios para garantir um catálogo completo.'
      },
      {
        pergunta: 'O que fazer quando um produto está com estoque baixo?',
        resposta: 'Produtos com estoque baixo (2 unidades ou menos) aparecem com um alerta amarelo. Recomenda-se fazer a reposição imediatamente para evitar perda de vendas. Você pode editar o produto para atualizar a quantidade em estoque.'
      },
      {
        pergunta: 'Como organizar produtos por categoria?',
        resposta: 'O sistema já organiza automaticamente por tipo: anel, colar, brinco, pulseira, conjunto. Você pode filtrar por categoria usando o dropdown "Filtrar por tipo" na aba Produtos.'
      }
    ]
  },
  {
    id: 'pedidos',
    categoria: 'Pedidos',
    perguntas: [
      {
        pergunta: 'Como criar um pedido para um cliente?',
        resposta: 'Na aba "Pedidos", clique em "Novo Pedido". Selecione o cliente, adicione os produtos desejados com suas quantidades e preços. O sistema calculará automaticamente o valor total do pedido.'
      },
      {
        pergunta: 'Como acompanhar o status de um pedido?',
        resposta: 'Cada pedido possui um status colorido: Pendente (amarelo), Confirmado (azul), Produção (roxo), Enviado (verde claro), Entregue (verde), Cancelado (vermelho). Você pode atualizar o status conforme o progresso.'
      },
      {
        pergunta: 'Como visualizar todos os produtos de um pedido?',
        resposta: 'Na lista de pedidos, cada card mostra todos os produtos incluídos com quantidade, preço unitário e valor total por item. O valor total do pedido é calculado automaticamente.'
      }
    ]
  },
  {
    id: 'funcionarios',
    categoria: 'Funcionários',
    perguntas: [
      {
        pergunta: 'Como adicionar um novo funcionário?',
        resposta: 'Na aba "Funcionários", clique em "Novo Funcionário". Preencha nome completo, email corporativo, CPF e cargo. O sistema criará automaticamente as iniciais para o avatar.'
      },
      {
        pergunta: 'Como visualizar o desempenho da equipe?',
        resposta: 'A aba Funcionários mostra métricas de vendas mensais e número de clientes atendidos por cada funcionário. Também há uma divisão por função: Gerência, Senior, Designer.'
      },
      {
        pergunta: 'Quais são os tipos de cargo disponíveis?',
        resposta: 'O sistema reconhece automaticamente: Gerentes (responsáveis por gestão e relatórios), Consultores Senior (atendimento e vendas), Designers (criação e desenvolvimento). Cada cargo tem cores e responsabilidades específicas.'
      }
    ]
  }
];

export const FAQView = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFAQ = faqData.map(categoria => ({
    ...categoria,
    perguntas: categoria.perguntas.filter(item =>
      item.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.resposta.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(categoria => categoria.perguntas.length > 0);

  const totalPerguntas = faqData.reduce((sum, cat) => sum + cat.perguntas.length, 0);
  const perguntasEncontradas = filteredFAQ.reduce((sum, cat) => sum + cat.perguntas.length, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">FAQ - Perguntas Frequentes</h1>
          <p className="text-muted-foreground">Tire suas dúvidas sobre o sistema Landry Joias</p>
        </div>
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-accent-gold" />
          <Badge variant="outline" className="text-accent-gold border-accent-gold">
            {totalPerguntas} perguntas
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar nas perguntas frequentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchTerm && (
          <Badge variant="secondary">
            {perguntasEncontradas} resultado(s) encontrado(s)
          </Badge>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {faqData.map((categoria) => (
          <Card key={categoria.id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent-gold/20 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-accent-gold" />
                </div>
                <div>
                  <p className="text-lg font-bold">{categoria.perguntas.length}</p>
                  <p className="text-xs text-muted-foreground">{categoria.categoria}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Content */}
      <div className="space-y-6">
        {filteredFAQ.map((categoria) => (
          <Card key={categoria.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-gold rounded-full"></div>
                {categoria.categoria}
              </CardTitle>
              <CardDescription>
                {categoria.perguntas.length} pergunta(s) frequente(s) sobre {categoria.categoria.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {categoria.perguntas.map((item, index) => (
                  <AccordionItem key={index} value={`${categoria.id}-${index}`}>
                    <AccordionTrigger className="text-left hover:text-accent-gold">
                      {item.pergunta}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.resposta}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFAQ.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-2">Nenhuma pergunta encontrada</p>
          <p className="text-sm text-muted-foreground">
            Tente usar palavras-chave diferentes ou navegue pelas categorias
          </p>
        </div>
      )}

      {/* Help Section */}
      <Card className="bg-gradient-subtle border-accent-gold/20">
        <CardHeader>
          <CardTitle className="text-accent-gold">Precisa de mais ajuda?</CardTitle>
          <CardDescription>
            Não encontrou a resposta que procurava? Entre em contato conosco!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-background/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Suporte Técnico</h4>
              <p className="text-sm text-muted-foreground">
                Para problemas técnicos do sistema
              </p>
              <p className="text-sm font-medium text-accent-gold mt-2">
                suporte@landryjoias.com.br
              </p>
            </div>
            <div className="p-4 bg-background/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Dúvidas Comerciais</h4>
              <p className="text-sm text-muted-foreground">
                Para dúvidas sobre vendas e processos
              </p>
              <p className="text-sm font-medium text-accent-gold mt-2">
                comercial@landryjoias.com.br
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};