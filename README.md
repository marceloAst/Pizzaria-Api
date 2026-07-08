# 🍕 Pizzaria API

API RESTful desenvolvida para gerenciamento de uma pizzaria com atendimento presencial (sem delivery). O projeto foi desenvolvido como Trabalho Prático da disciplina de Arquitetura de Software, aplicando os conceitos de Arquitetura Vertical Slice, Orientação a Objetos, Injeção de Dependência e modelagem de banco de dados relacional utilizando PostgreSQL.

## 📚 Domínio escolhido

O sistema simula o atendimento de uma pizzaria em salão (sem delivery): o cliente senta em uma **mesa**, faz um **pedido** com um ou mais **produtos** (organizados em **categorias**), e ao final o pedido é fechado com um **pagamento**. Cada cliente pode opcionalmente ter um **perfil** com dados complementares (CPF, data de nascimento).

Principais funcionalidades:

* Cadastro de clientes e de seus perfis complementares;
* Cadastro de categorias e produtos (pizzas, bebidas e sobremesas);
* Cadastro e controle de status das mesas;
* Abertura, acompanhamento e fechamento de pedidos (com múltiplos itens);
* Registro de pagamentos.

## 🗃️ Modelagem do banco de dados

O script completo está em [`database.sql`](./database.sql), na raiz do projeto. Resumo das entidades e relacionamentos:

| Tabela            | Relacionamento                                          |
|-------------------|----------------------------------------------------------|
| `cliente`         | 1:1 com `perfil_cliente`, 1:N com `pedido`                |
| `perfil_cliente`  | 1:1 com `cliente` (FK `cliente_id UNIQUE`)                |
| `mesa`            | 1:N com `pedido`                                          |
| `categoria`       | 1:N com `produto`                                         |
| `produto`         | N:N com `pedido` através de `pedido_item`                 |
| `pedido`          | 1:1 com `pagamento` (FK `pedido_id UNIQUE`), 1:N com `pedido_item` |
| `pedido_item`     | tabela associativa entre `pedido` e `produto`             |
| `pagamento`       | 1:1 com `pedido`                                          |

## 🛠 Tecnologias utilizadas

* Node.js + Fastify
* PostgreSQL (`pg`)
* dotenv
* Swagger / OpenAPI (`@fastify/swagger` + `@fastify/swagger-ui`)
* JavaScript (ES Modules)

## 🏗️ Arquitetura

O código em `PizzariaAPI/src` está organizado por **Vertical Slice** (`Features/<Entidade>`), com cada slice contendo `Controller`, `Service`, `Repository` e `Routes` como classes, seguindo injeção de dependência manual feita nos arquivos `*Routes.js`:

```
src/
  Common/Errors/        -> AppError e ErrorHandler globais
  Database/Pool.js      -> Pool de conexão com o Postgres
  Features/
    Clientes/
    PerfilCliente/
    Categorias/
    Produtos/
    Mesas/
    Pedidos/
    Pagamentos/
  Server.js              -> monta as dependências e registra rotas/Swagger
```

## 🚀 Como rodar o projeto localmente

### Pré-requisitos

* Node.js 18+
* Uma instância PostgreSQL acessível (local ou serviço como Neon/Supabase/Render)

### 1. Clonar o repositório

```bash
git clone <url-do-seu-repositorio>
cd Pizzaria-Api/PizzariaAPI
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Copie o arquivo de exemplo e preencha com os seus dados:

```bash
cp .env.example .env
```

```env
PORT=6767
DATABASE_URL=postgresql://usuario:senha@host:5432/nome_do_banco?sslmode=require
```

> ⚠️ **Nunca commite o arquivo `.env`** com credenciais reais. Ele já está listado no `.gitignore`.

### 4. Criar as tabelas no banco

Execute o script `database.sql` (na raiz do projeto) no seu banco PostgreSQL, por exemplo:

```bash
psql "$DATABASE_URL" -f ../database.sql
```

ou cole o conteúdo do arquivo em uma ferramenta como DBeaver, pgAdmin ou o SQL editor do seu provedor (Neon, Supabase etc.).

### 5. Rodar o servidor

```bash
npm run dev    # com nodemon, recarrega automaticamente
# ou
npm start
```

O servidor sobe em `http://localhost:6767` (ou na porta definida em `PORT`).

### 6. Acessar a documentação Swagger

Com o servidor rodando, acesse:

```
http://localhost:6767/docs
```

Lá é possível ver todos os endpoints, os formatos de body esperados, os parâmetros de rota e testar as requisições diretamente pelo navegador.

## Principais endpoints

| Método | Rota                          | Descrição                                             |
|--------|-------------------------------|--------------------------------------------------------|
| POST   | `/clientes`                   | Cria cliente                                            |
| GET    | `/clientes/:id/perfil`        | Busca o perfil (1:1) de um cliente                      |
| POST   | `/categorias`                 | Cria categoria                                           |
| POST   | `/produtos`                   | Cria produto (vinculado a uma categoria)                 |
| POST   | `/mesas`                      | Cria mesa                                                |
| POST   | `/pedidos`                    | Abre um pedido com itens (produtos + quantidade)         |
| GET    | `/pedidos/:id`                | Busca um pedido com JOIN: cliente, mesa e itens/produtos |
| PATCH  | `/pedidos/:id/status`         | Avança o status do pedido (Aberto → Em preparo → ...)    |
| POST   | `/pagamentos`                 | Registra o pagamento (1:1) de um pedido finalizado       |

Todas as rotas de CRUD completo (POST, GET, GET por ID, PATCH, DELETE) existem para `clientes`, `categorias`, `produtos`, `mesas`, `pedidos` e `pagamentos`.

## Regras de negócio implementadas

* Não é possível cadastrar cliente com e-mail já existente;
* Não é possível remover categoria vinculada a produtos;
* Não é possível remover produto vinculado a um pedido em andamento (`Aberto`/`Em preparo`);
* Não é possível remover mesa que já possui pedidos vinculados;
* Não é possível abrir pedido em mesa já `Ocupada`, nem com itens indisponíveis;
* Mudanças de status do pedido seguem uma máquina de estados (`Aberto → Em preparo → Finalizado`, ou `Cancelado`);
* Pagamento só pode ser registrado para pedido `Finalizado` e precisa bater com o valor total do pedido;
* Cliente só pode ter um perfil (1:1).

## Tratamento de erros

Toda regra de negócio violada ou recurso não encontrado lança `new AppError(mensagem, statusCode)` na camada de `Service`. Um Error Handler Global (`Common/Errors/ErrorHandler.js`), registrado via `app.setErrorHandler`, captura esses erros e padroniza a resposta em JSON:

```json
{
  "statusCode": 404,
  "message": "Cliente não encontrado."
}
```
