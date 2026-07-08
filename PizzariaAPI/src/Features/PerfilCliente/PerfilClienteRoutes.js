import ClienteRepository from "../Clientes/ClienteRepository.js";
import ClienteService from "../Clientes/ClienteService.js";
import ClienteController from "../Clientes/ClienteController.js";

const clienteRepository = new ClienteRepository();
const clienteService = new ClienteService(clienteRepository);
const clienteController = new ClienteController(clienteService);

const clienteSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    nome: { type: "string" },
    telefone: { type: "string" },
    email: { type: "string", format: "email" },
  },
};

const clienteInputSchema = {
  type: "object",
  properties: {
    nome: { type: "string" },
    telefone: { type: "string" },
    email: { type: "string", format: "email" },
  },
};

const errorSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

async function perfilClienteRoutes(app) {
  app.get(
    "/perfil-cliente",
    {
      schema: {
        tags: ["PerfilCliente"],
        summary: "Buscar perfil do cliente via query string",
        querystring: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          200: clienteSchema,
          400: errorSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.query;

      if (!id) {
        return reply.status(400).send({
          message: "Informe o id do cliente na query string.",
        });
      }

      return clienteController.findById({ params: { id } }, reply);
    },
  );

  app.get(
    "/perfil-cliente/:id",
    {
      schema: {
        tags: ["PerfilCliente"],
        summary: "Buscar perfil do cliente por ID",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          200: clienteSchema,
          404: errorSchema,
        },
      },
    },
    clienteController.findById.bind(clienteController),
  );

  app.patch(
    "/perfil-cliente/:id",
    {
      schema: {
        tags: ["PerfilCliente"],
        summary: "Atualizar perfil do cliente",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        body: clienteInputSchema,
        response: {
          200: clienteSchema,
          404: errorSchema,
          409: errorSchema,
        },
      },
    },
    clienteController.update.bind(clienteController),
  );
}

export default perfilClienteRoutes;
