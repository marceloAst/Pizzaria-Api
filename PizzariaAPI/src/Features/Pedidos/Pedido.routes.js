import PedidoRepository from "./Pedido.repository.js";
import PedidoService from "./Pedido.service.js";
import PedidoController from "./Pedido.controller.js";

const pedidoRepository = new PedidoRepository();

const pedidoService =
    new PedidoService(pedidoRepository);

const pedidoController =
    new PedidoController(pedidoService);

const errorResponseSchema = {
    type: "object",
    properties: {
        statusCode: { type: "integer" },
        message: { type: "string" }
    }
};

const pedidoResumoSchema = {
    type: "object",
    properties: {
        id: { type: "integer" },
        cliente_id: { type: "integer" },
        mesa_id: { type: "integer" },
        data_hora: { type: "string", format: "date-time" },
        status: { type: "string" },
        valor_total: { type: "number" },
        cliente_nome: { type: "string" },
        mesa_numero: { type: "integer" }
    }
};

const pedidoDetalhadoSchema = {
    type: "object",
    properties: {
        id: { type: "integer" },
        data_hora: { type: "string", format: "date-time" },
        status: { type: "string" },
        valor_total: { type: "number" },
        cliente_id: { type: "integer" },
        cliente_nome: { type: "string" },
        cliente_telefone: { type: "string" },
        cliente_email: { type: "string" },
        mesa_id: { type: "integer" },
        mesa_numero: { type: "integer" },
        mesa_capacidade: { type: "integer" },
        itens: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    produto_id: { type: "integer" },
                    produto_nome: { type: "string" },
                    quantidade: { type: "integer" },
                    preco_unitario: { type: "number" },
                    subtotal: { type: "number" }
                }
            }
        }
    }
};

async function pedidoRoutes(app) {

    app.post(
        "/pedidos",
        {
            schema: {
                tags: ["Pedidos"],
                summary: "Cria um novo pedido com seus itens (produtos)",
                body: {
                    type: "object",
                    required: ["clienteId", "mesaId", "itens"],
                    properties: {
                        clienteId: { type: "integer", example: 1 },
                        mesaId: { type: "integer", example: 1 },
                        itens: {
                            type: "array",
                            example: [{ produtoId: 1, quantidade: 2 }],
                            items: {
                                type: "object",
                                required: ["produtoId", "quantidade"],
                                properties: {
                                    produtoId: { type: "integer" },
                                    quantidade: { type: "integer" }
                                }
                            }
                        }
                    }
                },
                response: {
                    201: pedidoResumoSchema,
                    400: errorResponseSchema,
                    404: errorResponseSchema
                }
            }
        },
        pedidoController.create.bind(pedidoController)
    );

    app.get(
        "/pedidos",
        {
            schema: {
                tags: ["Pedidos"],
                summary: "Lista todos os pedidos",
                response: {
                    200: { type: "array", items: pedidoResumoSchema }
                }
            }
        },
        pedidoController.findAll.bind(pedidoController)
    );

    app.get(
        "/pedidos/:id",
        {
            schema: {
                tags: ["Pedidos"],
                summary: "Busca um pedido pelo ID, com cliente, mesa e itens (JOIN)",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                },
                response: {
                    200: pedidoDetalhadoSchema,
                    404: errorResponseSchema
                }
            }
        },
        pedidoController.findById.bind(pedidoController)
    );

    app.patch(
        "/pedidos/:id/status",
        {
            schema: {
                tags: ["Pedidos"],
                summary: "Atualiza o status de um pedido (Aberto, Em preparo, Finalizado, Cancelado)",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                },
                body: {
                    type: "object",
                    required: ["status"],
                    properties: {
                        status: {
                            type: "string",
                            enum: ["Aberto", "Em preparo", "Finalizado", "Cancelado"],
                            example: "Em preparo"
                        }
                    }
                },
                response: {
                    200: pedidoResumoSchema,
                    400: errorResponseSchema,
                    404: errorResponseSchema
                }
            }
        },
        pedidoController.atualizarStatus.bind(pedidoController)
    );

    app.delete(
        "/pedidos/:id",
        {
            schema: {
                tags: ["Pedidos"],
                summary: "Remove um pedido (somente se ainda estiver 'Aberto')",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                },
                response: {
                    204: { type: "null", description: "Removido com sucesso" },
                    400: errorResponseSchema,
                    404: errorResponseSchema
                }
            }
        },
        pedidoController.delete.bind(pedidoController)
    );

}

export default pedidoRoutes;
