import ProdutoRepository from "./Produto.repository.js";
import ProdutoService from "./Produto.service.js";
import ProdutoController from "./Produto.controller.js";

const repository = new ProdutoRepository();

const service =
    new ProdutoService(repository);

const controller =
    new ProdutoController(service);

async function produtoRoutes(app) {

    app.post(
        "/produtos",
        {
            schema: {
                tags: ["Produtos"],
                summary: "Criar produto",
                body: {
                    type: "object",
                    required: ["nome", "preco", "categoriaId"],
                    properties: {
                        nome: { type: "string" },
                        descricao: { type: "string" },
                        preco: { type: "number" },
                        categoriaId: { type: "integer" },
                        disponivel: { type: "boolean" }
                    }
                }
            }
        },
        controller.create.bind(controller)
    );

    app.get(
        "/produtos",
        {
            schema: {
                tags: ["Produtos"],
                summary: "Listar produtos"
            }
        },
        controller.findAll.bind(controller)
    );

    app.get(
        "/produtos/:id",
        {
            schema: {
                tags: ["Produtos"],
                summary: "Buscar produto por ID",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                }
            }
        },
        controller.findById.bind(controller)
    );

    app.patch(
        "/produtos/:id",
        {
            schema: {
                tags: ["Produtos"],
                summary: "Atualizar produto",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                },
                body: {
                    type: "object",
                    properties: {
                        nome: { type: "string" },
                        descricao: { type: "string" },
                        preco: { type: "number" },
                        categoriaId: { type: "integer" },
                        disponivel: { type: "boolean" }
                    }
                }
            }
        },
        controller.update.bind(controller)
    );

    app.delete(
        "/produtos/:id",
        {
            schema: {
                tags: ["Produtos"],
                summary: "Excluir produto",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                }
            }
        },
        controller.delete.bind(controller)
    );

}

export default produtoRoutes;
