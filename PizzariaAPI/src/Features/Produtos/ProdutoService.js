import AppError from "../../Common/Errors/AppError.js";

class ProdutoService {
  constructor(produtoRepository) {
    this.produtoRepository = produtoRepository;
  }

  async create(produto) {
    const categoria = await this.produtoRepository.categoriaExiste(
      produto.categoriaId,
    );

    if (!categoria) {
      throw new AppError("Categoria não encontrada.", 404);
    }

    return await this.produtoRepository.create(produto);
  }

  async findAll() {
    return await this.produtoRepository.findAll();
  }

  async findById(id) {
    const produto = await this.produtoRepository.findById(id);

    if (!produto) {
      throw new AppError("Produto não encontrado.", 404);
    }

    return produto;
  }

  async update(id, produto) {
    await this.findById(id);

    const categoria = await this.produtoRepository.categoriaExiste(
      produto.categoriaId,
    );

    if (!categoria) {
      throw new AppError("Categoria não encontrada.", 404);
    }

    return await this.produtoRepository.update(id, produto);
  }

  async delete(id) {
    await this.findById(id);

    await this.produtoRepository.delete(id);
  }
}

export default ProdutoService;
