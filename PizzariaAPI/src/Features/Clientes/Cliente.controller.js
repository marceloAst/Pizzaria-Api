class ClienteController {
  constructor(clienteService) {
    this.clienteService = clienteService;
  }

  async create(request, reply) {
    const cliente = await this.clienteService.create(request.body || {});
    return reply.status(201).send(cliente);
  }

  async findAll(request, reply) {
    const clientes = await this.clienteService.findAll();
    return reply.send(clientes);
  }

  async findById(request, reply) {
    const { id } = request.params;
    const cliente = await this.clienteService.findById(id);
    return reply.send(cliente);
  }

  async update(request, reply) {
    const { id } = request.params;
    const clienteAtualizado = await this.clienteService.update(
      id,
      request.body || {},
    );
    return reply.send(clienteAtualizado);
  }

  async delete(request, reply) {
    const { id } = request.params;
    await this.clienteService.delete(id);
    return reply.status(204).send();
  }
}

export default ClienteController;
