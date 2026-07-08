import Fastify from "fastify";
import dotenv from "dotenv";
import swagger from "@fastify/swagger";

import "./Database/Pool.js";

import clienteRoutes from "./Features/Clientes/Cliente.routes.js";
import produtoRoutes from "./Features/Produtos/Produto.routes.js";
import categoriaRoutes from "./Features/Categorias/Categoria.routes.js";
import mesaRoutes from "./Features/Mesas/Mesa.routes.js";
import pedidoRoutes from "./Features/Pedidos/Pedido.routes.js";
import pagamentoRoutes from "./Features/Pagamentos/Pagamento.routes.js";

import errorHandler from "./Common/Errors/ErrorHandler.js";

dotenv.config();

const app = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      strict: false,
    },
  },
});

app.setErrorHandler(errorHandler);

app.get("/", async () => {
  return {
    message: "API da pizzaria funcionando.",
  };
});

const PORT = process.env.PORT || 6767;

const start = async () => {
  try {
    await app.register(swagger, {
      openapi: {
        openapi: "3.0.0",
        info: {
          title: "Pizzaria API",
          description:
            "API simples para controlar clientes, produtos, mesas, pedidos e pagamentos de uma pizzaria.",
          version: "1.0.0",
        },
        tags: [
          { name: "Clientes" },
          { name: "Categorias" },
          { name: "Produtos" },
          { name: "Mesas" },
          { name: "Pedidos" },
          { name: "Pagamentos" },
        ],
      },
      exposeRoute: true,
    });

    await app.register(clienteRoutes);
    await app.register(produtoRoutes);
    await app.register(categoriaRoutes);
    await app.register(mesaRoutes);
    await app.register(pedidoRoutes);
    await app.register(pagamentoRoutes);

    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação JSON: http://localhost:${PORT}/documentation/json`);
  } catch (erro) {
    app.log.error(erro);
    process.exit(1);
  }
};

start();
