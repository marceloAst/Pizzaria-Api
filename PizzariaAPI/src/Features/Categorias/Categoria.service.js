import AppError from "../../Common/Errors/AppError.js";

class CategoriaService {

    constructor(categoriaRepository) {

        this.categoriaRepository = categoriaRepository;

    }

    async create(categoria) {

        const existe =
            await this.categoriaRepository.findByNome(categoria.nome);

        if (existe) {

            throw new AppError(
                "Categoria já cadastrada.",
                409
            );

        }

        return await this.categoriaRepository.create(categoria);

    }

    async findAll() {

        return await this.categoriaRepository.findAll();

    }

    async findById(id) {

        const categoria =
            await this.categoriaRepository.findById(id);

        if (!categoria) {

            throw new AppError(
                "Categoria não encontrada.",
                404
            );

        }

        return categoria;

    }

    async update(id, categoria) {

        await this.findById(id);

        const existe =
            await this.categoriaRepository.findByNome(categoria.nome);

        if (existe && existe.id !== Number(id)) {

            throw new AppError(
                "Categoria já cadastrada.",
                409
            );

        }

        return await this.categoriaRepository.update(id, categoria);

    }

    async delete(id) {

        await this.findById(id);

        const produtos =
            await this.categoriaRepository.possuiProdutos(id);

        if (produtos > 0) {

            throw new AppError(
                "Categoria possui produtos cadastrados.",
                400
            );

        }

        await this.categoriaRepository.delete(id);

    }

}

export default CategoriaService;