# Inter-CRM - Sistema de Gerenciamento de Clientes

## 🌟 Visão Geral do Projeto

Este projeto é um sistema de Gerenciamento de Relacionamento com o Cliente (**CRM**) focado na gestão de clientes para uma fábrica de joias. O objetivo é fornecer uma solução robusta e segura para gerir informações de clientes, pedidos e interações, otimizando o fluxo de trabalho da empresa.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias no **backend**:

- **Linguagem:** Java 17
- **Framework:** Spring Boot 3
- **Banco de Dados:** SQL Server
- **Dependências Chave:**
    - `spring-boot-starter-data-jpa`: Para persistência de dados e interação com o banco usando **JPA** e **Hibernate**.
    - `spring-boot-starter-security`: Para garantir a segurança das APIs, autenticação e autorização.
    - `spring-boot-starter-web`: Para construir a aplicação **web** e as **APIs REST**.
    - `mssql-jdbc`: O driver JDBC para conectar a aplicação ao **SQL Server**.
    - `lombok`: Para reduzir o código repetitivo (`getters`, `setters`, `construtores`, etc.).

### Frontend

O frontend inicial do projeto é construído com as seguintes tecnologias, mas a arquitetura foi projetada para ser flexível e permitir a substituição do frontend no futuro:

- **HTML**
- **CSS**
- **JavaScript**

---

## 🚀 Como Executar o Projeto

Para configurar e rodar o projeto localmente, siga os passos abaixo:

### Pré-requisitos

Certifique-se de que tens as seguintes ferramentas instaladas na tua máquina:

- **JDK 17** ou superior
- **Maven**
- **SQL Server**
- Uma IDE como **IntelliJ IDEA** ou **VS Code**

### Configuração do Banco de Dados

1.  Cria uma base de dados no teu **SQL Server**.
2.  Atualiza o arquivo `src/main/resources/application.properties` (ou `application.yml`) com as tuas credenciais de banco de dados, URL e nome da base de dados.

   ```properties
   spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=NOME_DO_TEU_BD
   spring.datasource.username=TEU_USUARIO
   spring.datasource.password=TUA_SENHA
   spring.jpa.hibernate.ddl-auto=update
