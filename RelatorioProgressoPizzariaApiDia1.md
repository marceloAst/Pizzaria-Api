# Relatório de Progresso do Projeto -- Pizzaria API

## Etapa 1 -- Definição do Domínio

**Status:** Concluída

Foi definido o domínio da aplicação como uma **Pizzaria sem Delivery**,
voltada para atendimento presencial.

## Etapa 2 -- Modelagem do Banco de Dados

**Status:** Concluída

Foi realizada a modelagem do banco de dados PostgreSQL com as seguintes
entidades:

-   Cliente
-   PerfilCliente
-   Mesa
-   Categoria
-   Produto
-   Pedido
-   PedidoItem
-   Pagamento

### Relacionamentos implementados

-   1:1
    -   Cliente → PerfilCliente
    -   Pedido → Pagamento
-   1:N
    -   Cliente → Pedido
    -   Categoria → Produto
    -   Mesa → Pedido
-   N:N
    -   Pedido ↔ Produto (PedidoItem)

Também foi criado o arquivo `database.sql` contendo a estrutura completa
das tabelas.

## Etapa 3 -- Estrutura Inicial do Projeto

**Status:** Concluída

Foi criada a estrutura inicial da API seguindo o padrão Vertical Slice,
preparando a organização dos módulos e do projeto para o desenvolvimento
das funcionalidades.

## Próximas Etapas

-   Configurar conexão com o PostgreSQL.
-   Implementar o módulo de Clientes.
-   Desenvolver Controllers, Services e Repositories.
-   Implementar tratamento global de erros.
-   Criar documentação com Swagger.
