import pool from "../../Database/Pool.js";

class PedidoRepository {

    async clienteExiste(clienteId) {

        const result = await pool.query(
            `
            SELECT id
            FROM cliente
            WHERE id = $1;
            `,
            [clienteId]
        );

        return result.rows[0];

    }

    async mesaExiste(mesaId) {

        const result = await pool.query(
            `
            SELECT id, status
            FROM mesa
            WHERE id = $1;
            `,
            [mesaId]
        );

        return result.rows[0];

    }

    async buscarProduto(produtoId) {

        const result = await pool.query(
            `
            SELECT id, nome, preco, disponivel
            FROM produto
            WHERE id = $1;
            `,
            [produtoId]
        );

        return result.rows[0];

    }

    async create(pedido, itensComPreco) {

        const client = await pool.connect();

        try {

            await client.query("BEGIN");

            const valorTotal = itensComPreco.reduce(
                (total, item) => total + (item.quantidade * item.precoUnitario),
                0
            );

            const pedidoResult = await client.query(
                `
                INSERT INTO pedido
                (cliente_id, mesa_id, status, valor_total)
                VALUES
                ($1, $2, $3, $4)
                RETURNING *;
                `,
                [pedido.clienteId, pedido.mesaId, "Aberto", valorTotal]
            );

            const novoPedido = pedidoResult.rows[0];

            for (const item of itensComPreco) {

                await client.query(
                    `
                    INSERT INTO pedido_item
                    (pedido_id, produto_id, quantidade, preco_unitario)
                    VALUES
                    ($1, $2, $3, $4);
                    `,
                    [novoPedido.id, item.produtoId, item.quantidade, item.precoUnitario]
                );

            }

            await client.query(
                `
                UPDATE mesa
                SET status = 'Ocupada'
                WHERE id = $1;
                `,
                [pedido.mesaId]
            );

            await client.query("COMMIT");

            return novoPedido;

        } catch (erro) {

            await client.query("ROLLBACK");
            throw erro;

        } finally {

            client.release();

        }

    }

    async findAll() {

        const result = await pool.query(
            `
            SELECT
                p.*,
                c.nome AS cliente_nome,
                m.numero AS mesa_numero
            FROM pedido p
            INNER JOIN cliente c
                ON c.id = p.cliente_id
            INNER JOIN mesa m
                ON m.id = p.mesa_id
            ORDER BY p.id;
            `
        );

        return result.rows;

    }

    async findById(id) {

        const pedidoResult = await pool.query(
            `
            SELECT
                p.id,
                p.data_hora,
                p.status,
                p.valor_total,
                c.id AS cliente_id,
                c.nome AS cliente_nome,
                c.telefone AS cliente_telefone,
                c.email AS cliente_email,
                m.id AS mesa_id,
                m.numero AS mesa_numero,
                m.capacidade AS mesa_capacidade
            FROM pedido p
            INNER JOIN cliente c
                ON c.id = p.cliente_id
            INNER JOIN mesa m
                ON m.id = p.mesa_id
            WHERE p.id = $1;
            `,
            [id]
        );

        const pedido = pedidoResult.rows[0];

        if (!pedido) {

            return null;

        }

        const itensResult = await pool.query(
            `
            SELECT
                pi.produto_id,
                pr.nome AS produto_nome,
                pi.quantidade,
                pi.preco_unitario,
                (pi.quantidade * pi.preco_unitario) AS subtotal
            FROM pedido_item pi
            INNER JOIN produto pr
                ON pr.id = pi.produto_id
            WHERE pi.pedido_id = $1
            ORDER BY pr.nome;
            `,
            [id]
        );

        return {
            ...pedido,
            itens: itensResult.rows
        };

    }

    async atualizarStatus(id, status) {

        const result = await pool.query(
            `
            UPDATE pedido
            SET status = $1
            WHERE id = $2
            RETURNING *;
            `,
            [status, id]
        );

        return result.rows[0];

    }

    async liberarMesa(mesaId) {

        await pool.query(
            `
            UPDATE mesa
            SET status = 'Livre'
            WHERE id = $1;
            `,
            [mesaId]
        );

    }

    async possuiPagamento(id) {

        const result = await pool.query(
            `
            SELECT id
            FROM pagamento
            WHERE pedido_id = $1;
            `,
            [id]
        );

        return result.rows[0];

    }

    async delete(id) {

        await pool.query(
            `
            DELETE FROM pedido
            WHERE id = $1;
            `,
            [id]
        );

    }

}

export default PedidoRepository;
