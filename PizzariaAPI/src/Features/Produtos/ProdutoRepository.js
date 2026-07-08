import pool from "../../Database/Pool.js";

class ProdutoRepository {
  async create(produto) {
    const { nome, descricao, preco, categoriaId, disponivel } = produto;

    const result = await pool.query(
      `
            INSERT INTO produto
            (nome, descricao, preco, categoria_id, disponivel)
            VALUES
            ($1, $2, $3, $4, $5)
            RETURNING *;
            `,
      [nome, descricao, preco, categoriaId, disponivel],
    );

    return result.rows[0];
  }

  async findAll() {
    const result = await pool.query(
      `
            SELECT
                p.*,
                c.nome AS categoria
            FROM produto p
            INNER JOIN categoria c
                ON c.id = p.categoria_id
            ORDER BY p.id;
            `,
    );

    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      `
            SELECT *
            FROM produto
            WHERE id = $1;
            `,
      [id],
    );

    return result.rows[0];
  }

  async update(id, produto) {
    const { nome, descricao, preco, categoriaId, disponivel } = produto;

    const result = await pool.query(
      `
            UPDATE produto
            SET
                nome = $1,
                descricao = $2,
                preco = $3,
                categoria_id = $4,
                disponivel = $5
            WHERE id = $6
            RETURNING *;
            `,
      [nome, descricao, preco, categoriaId, disponivel, id],
    );

    return result.rows[0];
  }

  async delete(id) {
    await pool.query(
      `
            DELETE FROM produto
            WHERE id = $1;
            `,
      [id],
    );
  }

  async categoriaExiste(id) {
    const result = await pool.query(
      `
            SELECT id
            FROM categoria
            WHERE id = $1;
            `,
      [id],
    );

    return result.rows[0];
  }
}

export default ProdutoRepository;
