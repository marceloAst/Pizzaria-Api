import pool from "../../Database/Pool.js";

class CategoriaRepository {

    async create(categoria) {

        const { nome } = categoria;

        const result = await pool.query(
            `
            INSERT INTO categoria
            (nome)
            VALUES
            ($1)
            RETURNING *;
            `,
            [nome]
        );

        return result.rows[0];

    }

    async findAll() {

        const result = await pool.query(
            `
            SELECT *
            FROM categoria
            ORDER BY id;
            `
        );

        return result.rows;

    }

    async findById(id) {

        const result = await pool.query(
            `
            SELECT *
            FROM categoria
            WHERE id = $1;
            `,
            [id]
        );

        return result.rows[0];

    }

    async findByNome(nome) {

        const result = await pool.query(
            `
            SELECT *
            FROM categoria
            WHERE nome = $1;
            `,
            [nome]
        );

        return result.rows[0];

    }

    async update(id, categoria) {

        const result = await pool.query(
            `
            UPDATE categoria
            SET nome = $1
            WHERE id = $2
            RETURNING *;
            `,
            [categoria.nome, id]
        );

        return result.rows[0];

    }

    async possuiProdutos(id) {

        const result = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM produto
            WHERE categoria_id = $1;
            `,
            [id]
        );

        return Number(result.rows[0].total);

    }

    async delete(id) {

        await pool.query(
            `
            DELETE FROM categoria
            WHERE id = $1;
            `,
            [id]
        );

    }

}

export default CategoriaRepository;