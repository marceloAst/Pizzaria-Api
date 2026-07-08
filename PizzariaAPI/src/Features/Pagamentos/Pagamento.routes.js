import PagamentoRepository from "./Pagamento.repository.js";
import PagamentoService from "./Pagamento.service.js";
import PagamentoController from "./Pagamento.controller.js";

const pagamentoRepository = new PagamentoRepository();

const pagamentoService =
    new PagamentoService(pagamentoRepository);

const pagamentoController =
    new PagamentoController(pagamentoService);

const errorResponseSchema = {
    type: "object",
    properties: {
        statusCode: { type: "integer" },
        message: { type: "string" }
    }
};

const pagamentoResponseSchema = {
    type: "object",
    properties: {
        id: { type: "integer" },
        pedido_id: { type: "integer" },
        forma_pagamento: { type: "string" },
        valor_pago: { type: "number" },
        data_pagamento: { type: "string", format: "date-time" }
    }
};

async function pagamentoRoutes(app) {

    app.post(
        "/pagamentos",
        {
            schema: {
                tags: ["Pagamentos"],
                summary: "Registra o pagamento (1:1) de um pedido finalizado",
                body: {
                    type: "object",
                    required: ["pedidoId", "formaPagamento", "valorPago"],
                    properties: {
                        pedidoId: { type: "integer", example: 1 },
                        formaPagamento: {
                            type: "string",
                            enum: ["Dinheiro", "Pix", "Crédito", "Débito"],
                            example: "Pix"
                        },
                        valorPago: { type: "number", example: 59.8 }
                    }
                },
                response: {
                    201: pagamentoResponseSchema,
                    400: errorResponseSchema,
                    404: errorResponseSchema,
                    409: errorResponseSchema
                }
            }
        },
        pagamentoController.create.bind(pagamentoController)
    );

    app.get(
        "/pagamentos",
        {
            schema: {
                tags: ["Pagamentos"],
                summary: "Lista todos os pagamentos",
                response: {
                    200: { type: "array", items: pagamentoResponseSchema }
                }
            }
        },
        pagamentoController.findAll.bind(pagamentoController)
    );

    app.get(
        "/pagamentos/:id",
        {
            schema: {
                tags: ["Pagamentos"],
                summary: "Busca um pagamento pelo ID",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                },
                response: {
                    200: pagamentoResponseSchema,
                    404: errorResponseSchema
                }
            }
        },
        pagamentoController.findById.bind(pagamentoController)
    );

    app.patch(
        "/pagamentos/:id",
        {
            schema: {
                tags: ["Pagamentos"],
                summary: "Atualiza um pagamento",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                },
                body: {
                    type: "object",
                    properties: {
                        formaPagamento: {
                            type: "string",
                            enum: ["Dinheiro", "Pix", "Crédito", "Débito"]
                        },
                        valorPago: { type: "number" }
                    }
                },
                response: {
                    200: pagamentoResponseSchema,
                    404: errorResponseSchema
                }
            }
        },
        pagamentoController.update.bind(pagamentoController)
    );

    app.delete(
        "/pagamentos/:id",
        {
            schema: {
                tags: ["Pagamentos"],
                summary: "Remove um pagamento",
                params: {
                    type: "object",
                    properties: { id: { type: "integer" } }
                },
                response: {
                    204: { type: "null", description: "Removido com sucesso" },
                    404: errorResponseSchema
                }
            }
        },
        pagamentoController.delete.bind(pagamentoController)
    );

}

export default pagamentoRoutes;
