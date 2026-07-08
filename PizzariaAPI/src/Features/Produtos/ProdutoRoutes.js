import ProdutoRepository from "./ProdutoRepository.js";
import ProdutoService from "./ProdutoService.js";
import ProdutoController from "./ProdutoController.js";

const repository = new ProdutoRepository();

const service =
    new ProdutoService(repository);

const controller =
    new ProdutoController(service);

async function produtoRoutes(app){

    app.post(
        "/produtos",
        controller.create.bind(controller)
    );

    app.get(
        "/produtos",
        controller.findAll.bind(controller)
    );

    app.get(
        "/produtos/:id",
        controller.findById.bind(controller)
    );

    app.patch(
        "/produtos/:id",
        controller.update.bind(controller)
    );

    app.delete(
        "/produtos/:id",
        controller.delete.bind(controller)
    );

}

export default produtoRoutes;