import Fastify from "fastify";
import dotenv from "dotenv";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import "./Database/Pool.js";

import clienteRoutes from "./Features/Clientes/ClienteRoutes.js";
import produtoRoutes from "./Features/Produtos/ProdutoRoutes.js";
import categoriaRoutes from "./Features/Categorias/CategoriaRoutes.js";
import mesaRoutes from "./Features/Mesas/MesaRoutes.js";
import pedidoRoutes from "./Features/Pedidos/PedidoRoutes.js";
import pagamentoRoutes from "./Features/Pagamentos/PagamentoRoutes.js";
import perfilClienteRoutes from "./Features/PerfilCliente/PerfilClienteRoutes.js";

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
    message: "API da pizzaria funcionando. Veja a documentação em /docs.",
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
          { name: "PerfilCliente" },
          { name: "Categorias" },
          { name: "Produtos" },
          { name: "Mesas" },
          { name: "Pedidos" },
          { name: "Pagamentos" },
        ],
      },
    });

    await app.register(swaggerUi, {
      routePrefix: "/docs",
    });

    await app.register(clienteRoutes);
    await app.register(perfilClienteRoutes);
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
    console.log(`Documentação disponível em http://localhost:${PORT}/docs`);
  } catch (erro) {
    app.log.error(erro);
    process.exit(1);
  }
};

start();
