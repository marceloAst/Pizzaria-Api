import pool from "../../Database/Pool.js";

class ClienteRepository {

    async create(cliente) {

        const { nome, telefone, email } = cliente;

        const result = await pool.query(
            `
            INSERT INTO cliente
            (nome, telefone, email)
            VALUES
            ($1, $2, $3)
            RETURNING *;
            `,
            [nome, telefone, email]
        );

        return result.rows[0];
    }

    async findAll() {

        const result = await pool.query(
            `
            SELECT *
            FROM cliente
            ORDER BY id;
            `
        );

        return result.rows;
    }

    async findById(id) {

        const result = await pool.query(
            `
            SELECT *
            FROM cliente
            WHERE id = $1;
            `,
            [id]
        );

        return result.rows[0];
    }

    async findByEmail(email) {

        const result = await pool.query(
            `
            SELECT *
            FROM cliente
            WHERE email = $1;
            `,
            [email]
        );

        return result.rows[0];
    }

    async update(id, cliente) {

        const { nome, telefone, email } = cliente;

        const result = await pool.query(
            `
            UPDATE cliente
            SET
                nome = $1,
                telefone = $2,
                email = $3
            WHERE id = $4
            RETURNING *;
            `,
            [nome, telefone, email, id]
        );

        return result.rows[0];
    }

    async delete(id) {

        await pool.query(
            `
            DELETE FROM cliente
            WHERE id = $1;
            `,
            [id]
        );

    }

}

export default ClienteRepository;