Aqui está um **README.md** completo e profissional, estruturado com base em todo o trabalho que fizemos juntos. Ele cobre desde a arquitetura até aos scripts de configuração do banco de dados para o primeiro acesso.

Podes criar um arquivo chamado `README.md` na raiz do teu projeto e colar este conteúdo.

-----

# 💎 Landry Joias CRM

Sistema de Gestão de Relacionamento com o Cliente (CRM) desenvolvido sob medida para joalherias. O projeto integra um Backend robusto em **Java Spring Boot** com um Frontend moderno em **React (Vite) + TypeScript**.

## 🚀 Tecnologias Utilizadas

### Backend (API)

  * **Java 17**
  * **Spring Boot 3.2.0**
  * **Spring Security + JWT** (Autenticação Stateless)
  * **Spring Data JPA / Hibernate** (ORM)
  * **SQL Server** (Banco de Dados)
  * **Maven** (Gerenciador de Dependências)

### Frontend (Interface)

  * **React 18**
  * **Vite** (Build Tool)
  * **TypeScript**
  * **Tailwind CSS** (Estilização)
  * **Shadcn/UI** (Componentes Visuais)
  * **React Router DOM** (Navegação)
  * **Context API** (Gerenciamento de Estado Global)

-----

## ⚙️ Funcionalidades

  * **Dashboard Gerencial:** Visão geral de vendas, estoque crítico e funil de vendas.
  * **Autenticação Segura:** Login via Token JWT com controle de sessão.
  * **Gestão de Clientes:** Cadastro completo com validação de CNPJ/Email.
  * **Controle de Estoque (Produtos):** Cadastro de joias com tipos (Anel, Colar, etc.), materiais e controle de quantidade.
  * **Funil de Vendas (Oportunidades):** Acompanhamento visual desde a prospecção até o fechamento.
  * **Gestão de Pedidos:** Criação de pedidos vinculados a oportunidades e produtos, com atualização de status (Pendente -\> Confirmado -\> Produção -\> Entregue).
  * **Logs de Atividade:** Registro de ações dos funcionários no sistema.

-----

## 🛠️ Pré-requisitos

  * **Java JDK 17** instalado.
  * **Node.js** (v18 ou superior) instalado.
  * **SQL Server** instalado e rodando.
  * **Maven** (opcional se usar wrapper).

-----

## 📦 Como Rodar o Projeto

### 1\. Configuração do Banco de Dados

Certifique-se de que o SQL Server está rodando e que o arquivo `application.properties` no Backend aponta para o banco correto.

**Importante:** O sistema possui segurança ativada. Para o primeiro acesso, você deve criar um usuário administrador diretamente no banco de dados executando o seguinte script SQL:

```sql
USE LandryJoias; -- Ou o nome do seu banco

-- Inserir Usuário Admin (Senha: 123456)
INSERT INTO Usuarios (email, senha, nivel_acesso) 
VALUES ('admin@landryjoias.com', '123456', 'ADMINISTRADOR');

-- Inserir Funcionário vinculado
INSERT INTO Funcionarios (nome, cpf, cargo, email, id_usuario)
VALUES ('Administrador', '000.000.000-00', 'Gerente', 'admin@landryjoias.com', 1);
```

### 2\. Rodar o Backend (API)

1.  Navegue até a pasta `crm` (Backend).
2.  Execute o projeto via Maven ou pela sua IDE (IntelliJ/Eclipse).

<!-- end list -->

```bash
cd crm
./mvnw spring-boot:run
```

*O servidor iniciará na porta **8080**.*

### 3\. Rodar o Frontend (Interface)

1.  Navegue até a pasta `src` (Frontend) ou a raiz onde está o `package.json`.
2.  Instale as dependências e inicie o servidor.

<!-- end list -->

```bash
npm install
npm run dev
```

*O frontend iniciará na porta **5173** (http://localhost:5173).*

> **Nota:** A porta 5173 é obrigatória pois o CORS do Backend (`WebConfig.java`) está configurado para aceitar apenas esta origem.

-----

## 🔧 Estrutura do Projeto

### Backend (`/crm`)

  * `controller`: Endpoints REST (Ex: `ClienteController`, `PedidosController`).
  * `entity`: Modelos do Banco de Dados (Ex: `ProdutosEntity`, `PedidosEntity`). *Atenção: Utilizamos construtores padrão para compatibilidade com Hibernate.*
  * `security`: Configuração de JWT, Filtros e CORS.
  * `service`: Regras de negócio.

### Frontend (`/src`)

  * `components/forms`: Formulários de cadastro (com conversão de tipos para o Java).
  * `components/layout`: Sidebar e estrutura principal.
  * `contexts`: `AppContext.tsx` (Gerencia estado global e comunicação com API).
  * `services`: `api.ts` (Configuração do Axios/Fetch com Interceptor de Token).
  * `views`: Telas principais (Dashboard, Clientes, Produtos, etc.).
  * `types`: Interfaces TypeScript espelhando as Entidades Java.

-----

## 🐛 Solução de Problemas Comuns

1.  **Erro `Material is null` ao salvar produto:**

      * Certifique-se de que o backend e frontend estão atualizados. Padronizamos o campo para `material` (minúsculo) em ambos os lados.

2.  **Erro `403 Forbidden` ou `Sessão Expirada`:**

      * Limpe o "Local Storage" do navegador (F12 -\> Application -\> Local Storage).
      * Faça login novamente para gerar um novo Token JWT.

3.  **Erro ao salvar Pedido (Check Constraint):**

      * Se você alterou os Status no código Java, pode ser necessário dropar e recriar a tabela `Pedidos` para que o banco atualize as regras aceitas.

-----

## 📝 Licença

Desenvolvido para fins acadêmicos/comerciais para a Landry Joias.
