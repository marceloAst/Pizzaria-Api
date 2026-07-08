# Relatório de Progresso do Projeto -- Pizzaria API

## Etapa 8 -- Implementação das Features CRUD

**Status:** Concluída

Foram implementadas todas as 6 features da API com operações CRUD completas, seguindo o padrão Vertical Slice e arquitetura em camadas (Controller → Service → Repository):

### Features Implementadas

#### Categorias (`/categorias`)
- POST, GET (lista), GET (por ID), PATCH, DELETE
- Schema: `{ "nome": "string" }` (obrigatório)
- Banco: tabela `categorias`

#### Clientes (`/clientes`)
- POST, GET (lista), GET (por ID), PATCH, DELETE
- Schema: `{ "nome": "string", "telefone": "string", "email": "string" }` (obrigatórios)
- Validação: e-mail duplicado (409 Conflict), formato de e-mail
- Injeção de dependência manual via construtor

#### Produtos (`/produtos`)
- POST, GET (lista), GET (por ID), PATCH, DELETE
- Schema: `{ "nome": "string", "preco": "number", "categoriaId": "integer" }` (obrigatórios); opcionais: `"descricao"`, `"disponivel"`
- Validação: categoria deve existir (FK)

#### Mesas (`/mesas`)
- POST, GET (lista), GET (por ID), PATCH, DELETE
- Schema: `{ "numero": "integer", "capacidade": "integer" }` (obrigatórios); opcional: `"status"` (Livre, Ocupada, Reservada)
- Status padrão: "Livre"

#### Pedidos (`/pedidos`)
- POST, GET (lista), GET (por ID), PATCH (status), DELETE
- Schema POST: `{ "clienteId": "integer", "mesaId": "integer", "itens": [{ "produtoId": "integer", "quantidade": "integer" }] }`
- PATCH `/pedidos/:id/status` com enum: Aberto, Em preparo, Finalizado, Cancelado
- DELETE bloqueado se pedido não estiver "Aberto"
- GET por ID retorna JOIN completo com cliente, mesa e itens

#### Pagamentos (`/pagamentos`)
- POST, GET (lista), GET (por ID), PATCH, DELETE
- Schema: `{ "pedidoId": "integer", "formaPagamento": "string" (Dinheiro/Pix/Crédito/Débito), "valorPago": "number" }` (obrigatórios)
- Relacionamento 1:1 com Pedido

### Infraestrutura

- **Servidor:** Fastify (porta 6767 ou via variável `PORT`)
- **Banco:** PostgreSQL hospedado no Neon com SSL
- **Pool de conexão:** `src/Database/Pool.js` com teste automático na inicialização
- **Tratamento de erros:** `src/Common/Errors/ErrorHandler.js` com suporte a `AppError` personalizado
- **Documentação:** Swagger/OpenAPI via `@fastify/swagger` e `@fastify/swagger-ui`
- **Logger:** Fastify logger integrado

### Total

- **30 endpoints REST** (5 por feature)
- **24 arquivos de funcionalidades** (4 por feature: routes, controller, service, repository)
- Projeto organizado em `src/Features/{Feature}/{Feature}.{camada}.js`