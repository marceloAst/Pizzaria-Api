import ClienteRepository from "./ClienteRepository.js";
import ClienteService from "./ClienteService.js";
import ClienteController from "./ClienteController.js";

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
  required: ["nome", "telefone", "email"],
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

async function clienteRoutes(app) {
  app.post(
    "/clientes",
    {
      schema: {
        tags: ["Clientes"],
        summary: "Criar cliente",
        body: clienteInputSchema,
        response: {
          201: clienteSchema,
          409: errorSchema,
        },
      },
    },
    clienteController.create.bind(clienteController),
  );

  app.get(
    "/clientes",
    {
      schema: {
        tags: ["Clientes"],
        summary: "Listar clientes",
        response: {
          200: { type: "array", items: clienteSchema },
        },
      },
    },
    clienteController.findAll.bind(clienteController),
  );

  app.get(
    "/clientes/:id",
    {
      schema: {
        tags: ["Clientes"],
        summary: "Buscar cliente por ID",
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
    "/clientes/:id",
    {
      schema: {
        tags: ["Clientes"],
        summary: "Atualizar cliente",
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

  app.delete(
    "/clientes/:id",
    {
      schema: {
        tags: ["Clientes"],
        summary: "Excluir cliente",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          204: { type: "null" },
          404: errorSchema,
        },
      },
    },
    clienteController.delete.bind(clienteController),
  );
}

export default clienteRoutes;
