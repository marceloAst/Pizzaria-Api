import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Teste de conexão
pool.query("SELECT NOW()")
    .then(() => {
        console.log("Banco conectado com sucesso!");
    })
    .catch((err) => {
        console.error("Erro ao conectar com o banco:");
        console.error(err);
    });

export default pool;