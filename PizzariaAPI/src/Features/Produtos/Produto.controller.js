class ProdutoController{

    constructor(produtoService){

        this.produtoService = produtoService;

    }

    async create(request, reply){

        const produto =
            await this.produtoService.create(request.body);

        return reply
            .status(201)
            .send(produto);

    }

    async findAll(request, reply){

        const produtos =
            await this.produtoService.findAll();

        return reply.send(produtos);

    }

    async findById(request, reply){

        const { id } = request.params;

        const produto =
            await this.produtoService.findById(id);

        return reply.send(produto);

    }

    async update(request, reply){

        const { id } = request.params;

        const produto =
            await this.produtoService.update(
                id,
                request.body
            );

        return reply.send(produto);

    }

    async delete(request, reply){

        const { id } = request.params;

        await this.produtoService.delete(id);

        return reply
            .status(204)
            .send();

    }

}

export default ProdutoController;