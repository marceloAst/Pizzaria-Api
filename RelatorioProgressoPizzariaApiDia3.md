# Relatório de Progresso do Projeto -- Pizzaria API

## Etapa 6 Configuração da Conexão com o Banco de Dados web pelo Neon

## Migração para o Banco em Nuvem (Neon)

A aplicação deixou de utilizar exclusivamente o banco PostgreSQL local e passou a utilizar uma instância hospedada na plataforma Neon.

Para isso foram realizadas as seguintes etapas:

* criação da conexão utilizando a `DATABASE_URL`;
* configuração do arquivo `.env`;
* adaptação do `pool.js` para utilizar a string de conexão do Neon;
* validação da conexão utilizando SSL.

## Estrutura da Conexão

Foi desenvolvido o arquivo responsável pela conexão com o banco de dados (`pool.js`), centralizando toda a comunicação com o PostgreSQL em um único ponto da aplicação.

Também foi implementado um teste automático de conexão durante a inicialização do servidor, permitindo identificar rapidamente problemas de configuração.

## Configuração do Servidor

Foi realizada a implementação inicial do arquivo `server.js`, responsável por:

* criar a instância do Fastify;
* carregar as variáveis de ambiente;
* importar a conexão com o banco;
* iniciar o servidor na porta configurada;
* registrar uma rota temporária para validação da comunicação com o banco de dados.

## Testes de Funcionamento

Durante os testes foram identificados e corrigidos diversos problemas, incluindo:

* importação incorreta do objeto `pool`;
* ausência da função responsável pela inicialização do servidor (`start`);
* configuração da porta da aplicação;
* ajustes na estrutura de importação dos módulos;
* validação da conexão com o banco hospedado no Neon.

Após as correções, a aplicação passou a iniciar corretamente e estabeleceu conexão com o banco de dados.