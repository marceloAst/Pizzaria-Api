class MesaController {

    constructor(mesaService) {

        this.mesaService = mesaService;

    }

    async create(request, reply) {

        const mesa =
            await this.mesaService.create(request.body);

        return reply
            .status(201)
            .send(mesa);

    }

    async findAll(request, reply) {

        const mesas =
            await this.mesaService.findAll();

        return reply.send(mesas);

    }

    async findById(request, reply) {

        const { id } = request.params;

        const mesa =
            await this.mesaService.findById(id);

        return reply.send(mesa);

    }

    async update(request, reply) {

        const { id } = request.params;

        const mesa =
            await this.mesaService.update(
                id,
                request.body
            );

        return reply.send(mesa);

    }

    async delete(request, reply) {

        const { id } = request.params;

        await this.mesaService.delete(id);

        return reply
            .status(204)
            .send();

    }

}

export default MesaController;
