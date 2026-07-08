class PagamentoController {

    constructor(pagamentoService) {

        this.pagamentoService = pagamentoService;

    }

    async create(request, reply) {

        const pagamento =
            await this.pagamentoService.create(request.body);

        return reply
            .status(201)
            .send(pagamento);

    }

    async findAll(request, reply) {

        const pagamentos =
            await this.pagamentoService.findAll();

        return reply.send(pagamentos);

    }

    async findById(request, reply) {

        const { id } = request.params;

        const pagamento =
            await this.pagamentoService.findById(id);

        return reply.send(pagamento);

    }

    async update(request, reply) {

        const { id } = request.params;

        const pagamento =
            await this.pagamentoService.update(
                id,
                request.body
            );

        return reply.send(pagamento);

    }

    async delete(request, reply) {

        const { id } = request.params;

        await this.pagamentoService.delete(id);

        return reply
            .status(204)
            .send();

    }

}

export default PagamentoController;
