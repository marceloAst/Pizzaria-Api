import AppError from "../../Common/Errors/AppError.js";

class ClienteService {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  validarDados(cliente) {
    const nome = cliente?.nome?.toString().trim();
    const telefone = cliente?.telefone?.toString().trim();
    const email = cliente?.email?.toString().trim();

    if (!nome || !telefone || !email) {
      throw new AppError("Nome, telefone e e-mail são obrigatórios.", 400);
    }

    return {
      nome,
      telefone,
      email,
    };
  }

  async create(cliente) {
    const dadosCliente = this.validarDados(cliente);

    const clienteExistente = await this.clienteRepository.findByEmail(
      dadosCliente.email,
    );

    if (clienteExistente) {
      throw new AppError("Já existe um cliente com este e-mail.", 409);
    }

    return await this.clienteRepository.create(dadosCliente);
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

    const campos = Object.fromEntries(
      Object.entries(cliente || {}).filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      ),
    );

    if (Object.keys(campos).length === 0) {
      throw new AppError("Informe pelo menos um campo para atualizar.", 400);
    }

    const dadosCliente = {
      ...clienteExistente,
      ...campos,
    };

    const dadosValidos = this.validarDados({
      nome: dadosCliente.nome,
      telefone: dadosCliente.telefone,
      email: dadosCliente.email,
    });

    const emailExistente = await this.clienteRepository.findByEmail(
      dadosValidos.email,
    );

    if (emailExistente && emailExistente.id !== Number(id)) {
      throw new AppError("Já existe um cliente com este e-mail.", 409);
    }

    return await this.clienteRepository.update(id, dadosValidos);
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
