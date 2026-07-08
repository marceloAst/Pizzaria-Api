import MesaRepository from "./MesaRepository.js";
import MesaService from "./MesaService.js";
import MesaController from "./MesaController.js";

const mesaRepository = new MesaRepository();

const mesaService =
    new MesaService(mesaRepository);

const mesaController =
    new MesaController(mesaService);

const mesaResponseSchema = {
    type: "object",
    properties: {
        id: { type: "integer" },
        numero: { type: "integer" },
        capacidade: { type: "integer" },
        status: { type: "string", enum: ["Livre", "Ocupada", "Reservada"] }
    }
};

const errorResponseSchema = {
    type: "object",
    properties: {
        statusCode: { type: "integer" },
        message: { type: "string" }
    }
};

async function mesaRoutes(app) {

    app.post(
        "/mesas",
        {
            schema: {
                tags: ["Mesas"],
                summary: "Cadastra uma nova mesa",
                body: {
                    type: "object",
                    required: ["numero", "capacidade"],
                    properties: {
                        numero: { type: "integer", example: 10 },
                        capacidade: { type: "integer", example: 4 },
                        status: { type: "string", enum: ["Livre", "Ocupada", "Reservada"], example: "Livre" }
                    }
                },
                response: {
                    201: mesaResponseSchema,
                    409: errorResponseSchema
                }
            }
        },
        mesaController.create.bind(mesaController)
    );

    app.get(
        "/mesas",
        {
            schema: {
                tags: ["Mesas"],
                summary: "Lista todas as mesas",
                response: {
                    200: { type: "array", items: mesaResponseSchema }
                }
            }
        },
        mesaController.findAll.bind(mesaController)
    );

    app.get(
        "/mesas/:id",
        {
            schema: {
                tags: ["Mesas"],
                summary: "Busca uma mesa pelo ID",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                },
                response: {
                    200: mesaResponseSchema,
                    404: errorResponseSchema
                }
            }
        },
        mesaController.findById.bind(mesaController)
    );

    app.patch(
        "/mesas/:id",
        {
            schema: {
                tags: ["Mesas"],
                summary: "Atualiza uma mesa",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                },
                body: {
                    type: "object",
                    properties: {
                        numero: { type: "integer", example: 10 },
                        capacidade: { type: "integer", example: 4 },
                        status: { type: "string", enum: ["Livre", "Ocupada", "Reservada"] }
                    }
                },
                response: {
                    200: mesaResponseSchema,
                    404: errorResponseSchema
                }
            }
        },
        mesaController.update.bind(mesaController)
    );

    app.delete(
        "/mesas/:id",
        {
            schema: {
                tags: ["Mesas"],
                summary: "Remove uma mesa",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                },
                response: {
                    204: { type: "null", description: "Removida com sucesso" },
                    400: errorResponseSchema,
                    404: errorResponseSchema
                }
            }
        },
        mesaController.delete.bind(mesaController)
    );

}

export default mesaRoutes;
