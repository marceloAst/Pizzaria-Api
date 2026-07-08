# Pizzaria API

API RESTful para gerenciamento de uma pizzaria com atendimento presencial. Desenvolvida como Trabalho Prático da disciplina de Arquitetura de Software, aplicando **Vertical Slice**, **Orientação a Objetos**, **Injeção de Dependência**, **Padrão Controller/Service/Repository** e **modelagem relacional PostgreSQL**.

## Domínio

O sistema gerencia:

- **Clientes** — cadastro de clientes com nome, telefone e e-mail
- **Mesas** — controle de mesas com número, capacidade e status (Livre, Ocupada, Reservada)
- **Categorias** — categorias de produtos (ex: Pizzas Salgadas, Bebidas)
- **Produtos** — itens do cardápio vinculados a uma categoria
- **Pedidos** — pedidos realizados por clientes em mesas, com múltiplos itens
- **Pagamentos** — registro de pagamento 1:1 para pedidos finalizados

## Modelagem do Banco de Dados

| Relacionamento | Tabelas | Descrição |
|---|---|---|
| **1:N** | categoria → produto | Uma categoria possui vários produtos |
| **1:N** | cliente → pedido | Um cliente pode fazer vários pedidos |
| **1:N** | mesa → pedido | Uma mesa pode ter vários pedidos ao longo do tempo |
| **N:N** | pedido ↔ produto | Através da tabela associativa `pedido_item` |
| **1:1** | pedido → pagamento | Um pedido finalizado possui no máximo um pagamento (FK com UNIQUE) |

## Tecnologias

- **Runtime:** Node.js
- **Framework:** Fastify 5.x
- **Banco:** PostgreSQL 8.x (driver `pg`)
- **Documentação:** Swagger/OpenAPI via `@fastify/swagger`
- **Arquitetura:** Vertical Slices com injeção de dependência (Repository → Service → Controller)

## Pré-requisitos

- Node.js 18+
- PostgreSQL (local ou remoto, ex: Neon, Supabase, etc.)

## Instalação e execução

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/pizzaria-api.git
cd pizzaria-api/PizzariaAPI

# 2. Instale as dependências
npm install

# 3. Configure o banco de dados
#    Execute o arquivo database.sql no seu PostgreSQL:
#    psql -h localhost -U seu_usuario -d sua_base -f ../database.sql

# 4. Configure a variável de ambiente
#    Crie um arquivo .env na pasta PizzariaAPI com:
#    PORT=3333
#    DATABASE_URL=postgresql://usuario:senha@host:5432/nome_do_banco?sslmode=require

# 5. Inicie o servidor
npm run dev
```

Acesse o JSON da documentação em: `http://localhost:3333/documentation/json`

## Estrutura do Projeto

```
PizzariaAPI/
  src/
    Server.js                          # Bootstrap do servidor Fastify
    Common/
      Errors/
        AppError.js                    # Classe customizada de erro
        ErrorHandler.js                # Error handler global
    Database/
      Pool.js                          # Singleton do Pool PostgreSQL
    Features/
      Clientes/
        Cliente.controller.js
        Cliente.repository.js
        Cliente.service.js
        Cliente.routes.js
      Categorias/
        Categoria.controller.js
        Categoria.repository.js
        Categoria.service.js
        Categoria.routes.js
      Produtos/
        Produto.controller.js
        Produto.repository.js
        Produto.service.js
        Produto.routes.js
      Mesas/
        Mesa.controller.js
        Mesa.repository.js
        Mesa.service.js
        Mesa.routes.js
      Pedidos/
        Pedido.controller.js
        Pedido.repository.js
        Pedido.service.js
        Pedido.routes.js
      Pagamentos/
        Pagamento.controller.js
        Pagamento.repository.js
        Pagamento.service.js
        Pagamento.routes.js
```

## Endpoints

### Clientes
| Método | Rota | Descrição |
|---|---|---|
| POST | `/clientes` | Criar cliente |
| GET | `/clientes` | Listar todos |
| GET | `/clientes/:id` | Buscar por ID |
| PATCH | `/clientes/:id` | Atualizar |
| DELETE | `/clientes/:id` | Excluir |

### Categorias
| Método | Rota | Descrição |
|---|---|---|
| POST | `/categorias` | Criar categoria |
| GET | `/categorias` | Listar todas |
| GET | `/categorias/:id` | Buscar por ID |
| PATCH | `/categorias/:id` | Atualizar |
| DELETE | `/categorias/:id` | Excluir |

### Produtos
| Método | Rota | Descrição |
|---|---|---|
| POST | `/produtos` | Criar produto |
| GET | `/produtos` | Listar todos (com JOIN para nome da categoria) |
| GET | `/produtos/:id` | Buscar por ID |
| PATCH | `/produtos/:id` | Atualizar |
| DELETE | `/produtos/:id` | Excluir |

### Mesas
| Método | Rota | Descrição |
|---|---|---|
| POST | `/mesas` | Criar mesa |
| GET | `/mesas` | Listar todas |
| GET | `/mesas/:id` | Buscar por ID |
| PATCH | `/mesas/:id` | Atualizar |
| DELETE | `/mesas/:id` | Excluir |

### Pedidos
| Método | Rota | Descrição |
|---|---|---|
| POST | `/pedidos` | Criar pedido com itens |
| GET | `/pedidos` | Listar todos (com JOIN cliente e mesa) |
| GET | `/pedidos/:id` | Buscar por ID (com JOIN completo + itens) |
| PATCH | `/pedidos/:id/status` | Atualizar status |
| DELETE | `/pedidos/:id` | Excluir (apenas se "Aberto") |

### Pagamentos
| Método | Rota | Descrição |
|---|---|---|
| POST | `/pagamentos` | Registrar pagamento |
| GET | `/pagamentos` | Listar todos (com JOIN pedido e cliente) |
| GET | `/pagamentos/:id` | Buscar por ID |
| PATCH | `/pagamentos/:id` | Atualizar |
| DELETE | `/pagamentos/:id` | Excluir |

## Regras de Negócio

1. **E-mail único:** Não é possível cadastrar dois clientes com o mesmo e-mail
2. **Mesa única:** Não é possível cadastrar duas mesas com o mesmo número
3. **Categoria com produtos:** Não é possível excluir uma categoria que possui produtos vinculados
4. **Mesa ocupada:** Não é possível abrir um pedido em uma mesa já ocupada
5. **Transição de status:** O status do pedido segue uma máquina de estados: `Aberto → Em preparo → Finalizado/Cancelado`. Transições inválidas são rejeitadas
6. **Pagamento 1:1:** Um pedido só pode ter um pagamento registrado, e apenas se estiver com status "Finalizado"
7. **Valor do pagamento:** O valor pago deve ser exatamente igual ao valor total do pedido
8. **Exclusão de pedido:** Só é possível remover pedidos com status "Aberto" e sem pagamento registrado

## Tratamento de Erros

A API utiliza uma classe customizada `AppError` com `statusCode` e `message`. Os erros são capturados por um **Error Handler Global** que retorna respostas padronizadas:

```json
{
  "statusCode": 400,
  "message": "Descrição do erro"
}
```

## Documentação (Swagger)
Para visualizar a documentação Swagger no VS Code, instale a extensão **Swagger Viewer**, clique botão direito no arquivo Swagger.json e depois clique Preview Swagger para visualizar a nossa documentação.
