# Relatório de Progresso do Projeto -- Pizzaria API

## Etapa 7 -- Criação da Feature Clientes

**Status:** Concluída

Foi implementada a feature completa de Clientes seguindo a arquitetura em camadas:

### Estrutura das Camadas

- **Cliente.routes.js** -- Definição das rotas com schemas de validação (JSON Schema) para body, params e responses, documentação via Swagger (tags, summaries, exemplos de erros).
- **Cliente.controller.js** -- Camada de controle que recebe as requisições e delega ao service, tratando os códigos HTTP (201 na criação, 204 na exclusão, etc.).
- **Cliente.service.js** -- Camada de serviço com as regras de negócio (validação de e-mail duplicado, formatação de dados).
- **Cliente.repository.js** -- Camada de acesso a dados com SQL raw para operações CRUD na tabela `clientes`.

### Endpoints Implementados

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/clientes` | Criar cliente (nome, telefone, email) |
| GET | `/clientes` | Listar todos os clientes |
| GET | `/clientes/:id` | Buscar cliente por ID |
| PATCH | `/clientes/:id` | Atualizar cliente |
| DELETE | `/clientes/:id` | Excluir cliente |

### Validações

- Campos obrigatórios: `nome`, `telefone`, `email`
- E-mail validado com formato `email` (JSON Schema)
- Verificação de e-mail duplicado antes da criação (retorna 409 Conflict)

**Próxima etapa:** Implementar as demais features (Categorias, Produtos, Mesas, Pedidos, Pagamentos).