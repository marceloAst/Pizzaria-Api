import AppError from "../../Common/Errors/AppError.js";

const STATUS_VALIDOS = ["Livre", "Ocupada", "Reservada"];

class MesaService {

    constructor(mesaRepository) {

        this.mesaRepository = mesaRepository;

    }

    async create(mesa) {

        const existente =
            await this.mesaRepository.findByNumero(mesa.numero);

        if (existente) {

            throw new AppError(
                "Já existe uma mesa com este número.",
                409
            );

        }

        if (mesa.status && !STATUS_VALIDOS.includes(mesa.status)) {

            throw new AppError(
                "Status de mesa inválido.",
                400
            );

        }

        return await this.mesaRepository.create(mesa);

    }

    async findAll() {

        return await this.mesaRepository.findAll();

    }

    async findById(id) {

        const mesa =
            await this.mesaRepository.findById(id);

        if (!mesa) {

            throw new AppError(
                "Mesa não encontrada.",
                404
            );

        }

        return mesa;

    }

    async update(id, mesa) {

        await this.findById(id);

        if (mesa.status && !STATUS_VALIDOS.includes(mesa.status)) {

            throw new AppError(
                "Status de mesa inválido.",
                400
            );

        }

        const existente =
            await this.mesaRepository.findByNumero(mesa.numero);

        if (existente && existente.id !== Number(id)) {

            throw new AppError(
                "Já existe uma mesa com este número.",
                409
            );

        }

        return await this.mesaRepository.update(id, mesa);

    }

    async delete(id) {

        await this.findById(id);

        const pedidos =
            await this.mesaRepository.possuiPedidos(id);

        if (pedidos > 0) {

            throw new AppError(
                "Não é possível remover uma mesa que já possui pedidos vinculados.",
                400
            );

        }

        await this.mesaRepository.delete(id);

    }

}

export default MesaService;
