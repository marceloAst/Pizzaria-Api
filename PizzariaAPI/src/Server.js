import Fastify from "fastify";
import dotenv from "dotenv";

import "./Database/Pool.js";

import clienteRoutes from "./Features/Clientes/ClienteRoutes.js";
import produtoRoutes from "./Features/Produtos/ProdutoRoutes.js";
import categoriaRoutes from "./Features/Categorias/CategoriaRoutes.js";

import errorHandler from "./Common/Errors/ErrorHandler.js";

dotenv.config();

const app = Fastify({
    logger: true,
});

app.setErrorHandler(errorHandler);

app.get("/", async () => {
    return {
        message: "Pizzaria API funcionando!"
    };
});

const PORT = process.env.PORT || 6767;

const start = async () => {

    try {

        await app.register(clienteRoutes);
        await app.register(produtoRoutes);
        await app.register(categoriaRoutes);

        await app.listen({
            port: PORT
        });

        console.log(`Servidor rodando na porta ${PORT}`);

    } catch (erro) {

        app.log.error(erro);
        process.exit(1);

    }

};

start();