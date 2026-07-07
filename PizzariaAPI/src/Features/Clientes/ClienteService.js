import AppError from "../../Common/Errors/AppError.js";

class ClienteService {

    constructor(clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    async create(cliente) {

        const clienteExistente = await this.clienteRepository.findByEmail(cliente.email);

        if (clienteExistente) {
            throw new AppError("Já existe um cliente com este e-mail.", 409);
        }

        return await this.clienteRepository.create(cliente);
    }

    async findAll() {
        return await this.clienteRepository.findAll();
    }

    async findById(id) {

        const cliente = await this.clienteRepository.findById(id);

        if (!cliente) {
            throw new AppError("Cliente não encontrado.", 404);
        }

        return cliente;
    }

    async update(id, cliente) {

        const clienteExistente = await this.clienteRepository.findById(id);

        if (!clienteExistente) {
            throw new AppError("Cliente não encontrado.", 404);
        }

        const emailExistente = await this.clienteRepository.findByEmail(cliente.email);

        if (emailExistente && emailExistente.id !== Number(id)) {
            throw new AppError("Já existe um cliente com este e-mail.", 409);
        }

        return await this.clienteRepository.update(id, cliente);
    }

    async delete(id) {

        const cliente = await this.clienteRepository.findById(id);

        if (!cliente) {
            throw new AppError("Cliente não encontrado.", 404);
        }

        await this.clienteRepository.delete(id);
    }

}

export default ClienteService;