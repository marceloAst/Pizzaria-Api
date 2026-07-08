class CategoriaController {

    constructor(categoriaService) {

        this.categoriaService = categoriaService;

    }

    async create(request, reply) {

        const categoria =
            await this.categoriaService.create(request.body);

        return reply
            .status(201)
            .send(categoria);

    }

    async findAll(request, reply) {

        const categorias =
            await this.categoriaService.findAll();

        return reply.send(categorias);

    }

    async findById(request, reply) {

        const { id } = request.params;

        const categoria =
            await this.categoriaService.findById(id);

        return reply.send(categoria);

    }

    async update(request, reply) {

        const { id } = request.params;

        const categoria =
            await this.categoriaService.update(
                id,
                request.body
            );

        return reply.send(categoria);

    }

    async delete(request, reply) {

        const { id } = request.params;

        await this.categoriaService.delete(id);

        return reply
            .status(204)
            .send();

    }

}

export default CategoriaController;