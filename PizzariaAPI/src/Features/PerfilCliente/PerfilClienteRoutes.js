import ClienteRepository from "../Clientes/ClienteRepository.js";
import ClienteService from "../Clientes/ClienteService.js";
import ClienteController from "../Clientes/ClienteController.js";

const clienteRepository = new ClienteRepository();
const clienteService = new ClienteService(clienteRepository);
const clienteController = new ClienteController(clienteService);

async function perfilClienteRoutes(app) {
  app.get("/perfil-cliente", async (request, reply) => {
    const { id } = request.query;

    if (!id) {
      return reply.status(400).send({
        message: "Informe o id do cliente na query string.",
      });
    }

    return clienteController.findById({ params: { id } }, reply);
  });

  app.get(
    "/perfil-cliente/:id",
    clienteController.findById.bind(clienteController),
  );

  app.patch(
    "/perfil-cliente/:id",
    clienteController.update.bind(clienteController),
  );
}

export default perfilClienteRoutes;
