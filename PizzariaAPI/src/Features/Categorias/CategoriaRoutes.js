import CategoriaRepository from "./CategoriaRepository.js";
import CategoriaService from "./CategoriaService.js";
import CategoriaController from "./CategoriaController.js";

const categoriaRepository = new CategoriaRepository();

const categoriaService =
    new CategoriaService(categoriaRepository);

const categoriaController =
    new CategoriaController(categoriaService);

async function categoriaRoutes(app) {

    app.post(
        "/categorias",
        categoriaController.create.bind(categoriaController)
    );

    app.get(
        "/categorias",
        categoriaController.findAll.bind(categoriaController)
    );

    app.get(
        "/categorias/:id",
        categoriaController.findById.bind(categoriaController)
    );

    app.patch(
        "/categorias/:id",
        categoriaController.update.bind(categoriaController)
    );

    app.delete(
        "/categorias/:id",
        categoriaController.delete.bind(categoriaController)
    );

}

export default categoriaRoutes;