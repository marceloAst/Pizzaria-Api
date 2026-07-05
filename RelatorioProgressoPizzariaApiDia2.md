# Relatório de Progresso do Projeto -- Pizzaria API
## Etapa 4 Estrutura Inicial da Aplicação

Foi definida a arquitetura do projeto seguindo o padrão Vertical Slice, organizando os arquivos por funcionalidades em vez de separá-los por tipo técnico.

Foram criadas as seguintes estruturas:

common
database
clientes
categorias
produtos
mesas
pedidos
pagamentos

Essa organização facilitará a manutenção e a escalabilidade da aplicação.

## Etapa 5 Preparação do Ambiente 

Foram realizadas as configurações iniciais do BD criado ontem:

configuração do arquivo .env;
criação da conexão inicial com PostgreSQL através do Pool;
desenvolvimento inicial do arquivo responsável pela inicialização do servidor.(sever.js)

Durante o desenvolvimento foram pesquisados conteúdos referentes aos seguintes temas:

REST API;
Node.js;
Fastify;
PostgreSQL;
SQL JOIN;
Repository Pattern;
Injeção de Dependência;
Swagger/OpenAPI.

Próximas(Etapa 6) etapa, para amanhã implementar a Feature de Clientes;
