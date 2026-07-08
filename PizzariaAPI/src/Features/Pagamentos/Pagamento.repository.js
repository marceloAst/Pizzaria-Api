import pool from "../../Database/Pool.js";

class PagamentoRepository {

    async pedidoExiste(pedidoId) {

        const result = await pool.query(
            `
            SELECT id, status, valor_total
            FROM pedido
            WHERE id = $1;
            `,
            [pedidoId]
        );

        return result.rows[0];

    }

    async findByPedidoId(pedidoId) {

        const result = await pool.query(
            `
            SELECT *
            FROM pagamento
            WHERE pedido_id = $1;
            `,
            [pedidoId]
        );

        return result.rows[0];

    }

    async create(pagamento) {

        const { pedidoId, formaPagamento, valorPago } = pagamento;

        const result = await pool.query(
            `
            INSERT INTO pagamento
            (pedido_id, forma_pagamento, valor_pago)
            VALUES
            ($1, $2, $3)
            RETURNING *;
            `,
            [pedidoId, formaPagamento, valorPago]
        );

        return result.rows[0];

    }

    async findAll() {

        const result = await pool.query(
            `
            SELECT
                pg.*,
                p.status AS pedido_status,
                p.valor_total AS pedido_valor_total,
                c.nome AS cliente_nome
            FROM pagamento pg
            INNER JOIN pedido p
                ON p.id = pg.pedido_id
            INNER JOIN cliente c
                ON c.id = p.cliente_id
            ORDER BY pg.id;
            `
        );

        return result.rows;

    }

    async findById(id) {

        const result = await pool.query(
            `
            SELECT
                pg.*,
                p.status AS pedido_status,
                p.valor_total AS pedido_valor_total,
                c.nome AS cliente_nome
            FROM pagamento pg
            INNER JOIN pedido p
                ON p.id = pg.pedido_id
            INNER JOIN cliente c
                ON c.id = p.cliente_id
            WHERE pg.id = $1;
            `,
            [id]
        );

        return result.rows[0];

    }

    async update(id, pagamento) {

        const { formaPagamento, valorPago } = pagamento;

        const result = await pool.query(
            `
            UPDATE pagamento
            SET
                forma_pagamento = $1,
                valor_pago = $2
            WHERE id = $3
            RETURNING *;
            `,
            [formaPagamento, valorPago, id]
        );

        return result.rows[0];

    }

    async delete(id) {

        await pool.query(
            `
            DELETE FROM pagamento
            WHERE id = $1;
            `,
            [id]
        );

    }

}

export default PagamentoRepository;
