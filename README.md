# Inter-CRM - Sistema de Gerenciamento de Clientes

## 🌟 Visão Geral do Projeto

Este projeto é um sistema de Gerenciamento de Relacionamento com o Cliente (CRM) para uma fábrica de joias. O objetivo é fornecer uma solução completa, segura e eficiente para gerir dados de clientes, pedidos e interações, otimizando o fluxo de trabalho da empresa.

## 📁 Estrutura do Repositório

O projeto é uma **monorepo**, ou seja, um único repositório que contém o código-fonte de várias partes da aplicação, organizadas da seguinte forma:

-   **`backend/`**: Contém o projeto **Spring Boot** responsável pela lógica de negócio e pelas APIs REST.
-   **`banco-de-dados/`**: Armazena os scripts e o modelo de dados do banco de dados **SQL Server**.
-   **`frontend/`**: Inclui o projeto de frontend, construído com tecnologias modernas.

---

## 🛠️ Tecnologias Utilizadas

### Backend

Desenvolvido em **Java** com o framework **Spring Boot**, o backend está configurado com as seguintes tecnologias principais:

-   **Linguagem:** Java 17
-   **Framework:** Spring Boot 3
-   **Ferramenta de Construção:** Maven
-   **Dependências:** Spring Data JPA, Spring Security, Spring Web, Lombok e o driver JDBC para SQL Server.

### Banco de Dados

O banco de dados é gerido de forma independente, utilizando **SQL Server**.

### Frontend

O frontend é uma **Single-Page Application (SPA)**, construída com as seguintes tecnologias para uma experiência de utilizador fluida e moderna:

-   **Framework:** React com TypeScript
-   **Ferramenta de Construção:** Vite
-   **Estilização:** Tailwind CSS (configurado com `postcss.config.js`)
-   **Componentes de UI:** Utiliza uma biblioteca de componentes (`shadcn/ui` ou similar, conforme sugerido por `components.json`).
-   **State Management:** Estrutura pronta para usar `hooks` e gerenciar o estado da aplicação.

A estrutura do frontend inclui pastas como `components`, `pages`, `lib` e `hooks`, o que demonstra uma arquitetura organizada e escalável.

---

## 🚀 Como Executar o Projeto

Para configurar e rodar o projeto localmente, siga estes passos para o backend e o frontend separadamente.

### Backend

1.  Navegue para a pasta `backend/landryJoias`.
2.  Configure o banco de dados no arquivo `src/main/resources/application.properties` com as suas credenciais.
3.  Execute a aplicação usando o Maven.

    ```bash
    cd backend/landryJoias
    mvn spring-boot:run
    ```

### Frontend

1.  Navegue para a pasta `frontend/LandryJoias`.
2.  Instale as dependências do projeto. Este projeto usa `bun`, mas também pode ser executado com `npm` ou `yarn`.

    ```bash
    cd frontend/LandryJoias
    bun install  # ou npm install / yarn install
    ```
3.  Inicie o servidor de desenvolvimento.

    ```bash
    bun dev  # ou npm run dev / yarn dev
    ```

O backend estará acessível em `http://localhost:8080` e o frontend em `http://localhost:5173` (porta padrão do Vite).

---

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir `issues` ou `pull requests` com propostas de melhorias, correções de bugs ou novas funcionalidades.

