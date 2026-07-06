import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then((client) => {
        console.log("Banco conectado com sucesso!");
        client.release();
    })
    .catch((err) => {
        console.error("Erro ao conectar com o banco:");
        console.error(err);
    });

export default pool;