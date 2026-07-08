class PedidoController {

    constructor(pedidoService) {

        this.pedidoService = pedidoService;

    }

    async create(request, reply) {

        const pedido =
            await this.pedidoService.create(request.body);

        return reply
            .status(201)
            .send(pedido);

    }

    async findAll(request, reply) {

        const pedidos =
            await this.pedidoService.findAll();

        return reply.send(pedidos);

    }

    async findById(request, reply) {

        const { id } = request.params;

        const pedido =
            await this.pedidoService.findById(id);

        return reply.send(pedido);

    }

    async atualizarStatus(request, reply) {

        const { id } = request.params;
        const { status } = request.body;

        const pedido =
            await this.pedidoService.atualizarStatus(id, status);

        return reply.send(pedido);

    }

    async delete(request, reply) {

        const { id } = request.params;

        await this.pedidoService.delete(id);

        return reply
            .status(204)
            .send();

    }

}

export default PedidoController;
