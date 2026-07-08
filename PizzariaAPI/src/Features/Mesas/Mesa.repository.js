import pool from "../../Database/Pool.js";

class MesaRepository {

    async create(mesa) {

        const { numero, capacidade, status } = mesa;

        const result = await pool.query(
            `
            INSERT INTO mesa
            (numero, capacidade, status)
            VALUES
            ($1, $2, $3)
            RETURNING *;
            `,
            [numero, capacidade, status || "Livre"]
        );

        return result.rows[0];

    }

    async findAll() {

        const result = await pool.query(
            `
            SELECT *
            FROM mesa
            ORDER BY numero;
            `
        );

        return result.rows;

    }

    async findById(id) {

        const result = await pool.query(
            `
            SELECT *
            FROM mesa
            WHERE id = $1;
            `,
            [id]
        );

        return result.rows[0];

    }

    async findByNumero(numero) {

        const result = await pool.query(
            `
            SELECT *
            FROM mesa
            WHERE numero = $1;
            `,
            [numero]
        );

        return result.rows[0];

    }

    async update(id, mesa) {

        const { numero, capacidade, status } = mesa;

        const result = await pool.query(
            `
            UPDATE mesa
            SET
                numero = $1,
                capacidade = $2,
                status = $3
            WHERE id = $4
            RETURNING *;
            `,
            [numero, capacidade, status, id]
        );

        return result.rows[0];

    }

    async updateStatus(id, status) {

        const result = await pool.query(
            `
            UPDATE mesa
            SET status = $1
            WHERE id = $2
            RETURNING *;
            `,
            [status, id]
        );

        return result.rows[0];

    }

    async possuiPedidos(id) {

        const result = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM pedido
            WHERE mesa_id = $1;
            `,
            [id]
        );

        return Number(result.rows[0].total);

    }

    async delete(id) {

        await pool.query(
            `
            DELETE FROM mesa
            WHERE id = $1;
            `,
            [id]
        );

    }

}

export default MesaRepository;
