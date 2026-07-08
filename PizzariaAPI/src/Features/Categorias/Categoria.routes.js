import CategoriaRepository from "./Categoria.repository.js";
import CategoriaService from "./Categoria.service.js";
import CategoriaController from "./Categoria.controller.js";

const categoriaRepository = new CategoriaRepository();

const categoriaService =
    new CategoriaService(categoriaRepository);

const categoriaController =
    new CategoriaController(categoriaService);

async function categoriaRoutes(app) {

    app.post(
        "/categorias",
        {
            schema: {
                tags: ["Categorias"],
                summary: "Criar categoria",
                body: {
                    type: "object",
                    required: ["nome"],
                    properties: {
                        nome: { type: "string" }
                    }
                }
            }
        },
        categoriaController.create.bind(categoriaController)
    );

    app.get(
        "/categorias",
        {
            schema: {
                tags: ["Categorias"],
                summary: "Listar categorias"
            }
        },
        categoriaController.findAll.bind(categoriaController)
    );

    app.get(
        "/categorias/:id",
        {
            schema: {
                tags: ["Categorias"],
                summary: "Buscar categoria por ID",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                }
            }
        },
        categoriaController.findById.bind(categoriaController)
    );

    app.patch(
        "/categorias/:id",
        {
            schema: {
                tags: ["Categorias"],
                summary: "Atualizar categoria",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                },
                body: {
                    type: "object",
                    required: ["nome"],
                    properties: {
                        nome: { type: "string" }
                    }
                }
            }
        },
        categoriaController.update.bind(categoriaController)
    );

    app.delete(
        "/categorias/:id",
        {
            schema: {
                tags: ["Categorias"],
                summary: "Excluir categoria",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                }
            }
        },
        categoriaController.delete.bind(categoriaController)
    );

}

export default categoriaRoutes;
