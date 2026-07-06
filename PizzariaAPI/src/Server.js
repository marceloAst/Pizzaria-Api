import Fastify from "fastify";
import dotenv from "dotenv";

import pool from "./Database/Pool.js";

dotenv.config();

const app = Fastify({
    logger: true,
});

app.get("/", async (request, reply) => {
    try {
        const resultado = await pool.query("SELECT NOW()");

        return {
            conectado: true,
            servidor: resultado.rows[0]
        };
    } catch (erro) {
        return reply.status(500).send({
            conectado: false,
            erro: erro.message
        });
    }
});

const PORT = process.env.PORT || 6767;

const start = async () => {
    try {
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