import ClienteRepository from "./ClienteRepository.js";
import ClienteService from "./ClienteService.js";
import ClienteController from "./ClienteController.js";

const clienteRepository = new ClienteRepository();

const clienteService = new ClienteService(
    clienteRepository
);

const clienteController = new ClienteController(
    clienteService
);

async function clienteRoutes(app) {

    app.post(
        "/clientes",
        clienteController.create.bind(clienteController)
    );

    app.get(
        "/clientes",
        clienteController.findAll.bind(clienteController)
    );

    app.get(
        "/clientes/:id",
        clienteController.findById.bind(clienteController)
    );

    app.patch(
        "/clientes/:id",
        clienteController.update.bind(clienteController)
    );

    app.delete(
        "/clientes/:id",
        clienteController.delete.bind(clienteController)
    );

}

export default clienteRoutes;