import Fastify from "fastify";
import dotenv from "dotenv";

import "./database/pool.js";

dotenv.config();

const app = Fastify({
    logger: true,
});


app.get("/", async (request, reply) => {
    return {
        mensagem: "API da Pizzaria funcionando!"
    };
});

const PORT = process.env.PORT || 6767;

const start = async () => {
    try {
        await app.listen({
            port: PORT
        });

        console.log(`Servidor rodando na porta ${PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();