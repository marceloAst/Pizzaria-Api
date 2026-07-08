import AppError from "../../Common/Errors/AppError.js";

class PagamentoService {

    constructor(pagamentoRepository) {

        this.pagamentoRepository = pagamentoRepository;

    }

    async create(pagamento) {

        const pedido =
            await this.pagamentoRepository.pedidoExiste(pagamento.pedidoId);

        if (!pedido) {

            throw new AppError(
                "Pedido não encontrado.",
                404
            );

        }

        if (pedido.status !== "Finalizado") {

            throw new AppError(
                "Só é possível registrar pagamento para pedidos com status \"Finalizado\".",
                400
            );

        }

        const pagamentoExistente =
            await this.pagamentoRepository.findByPedidoId(pagamento.pedidoId);

        if (pagamentoExistente) {

            throw new AppError(
                "Este pedido já possui um pagamento registrado.",
                409
            );

        }

        if (Number(pagamento.valorPago) !== Number(pedido.valor_total)) {

            throw new AppError(
                `O valor pago (${pagamento.valorPago}) deve ser igual ao valor total do pedido (${pedido.valor_total}).`,
                400
            );

        }

        return await this.pagamentoRepository.create(pagamento);

    }

    async findAll() {

        return await this.pagamentoRepository.findAll();

    }

    async findById(id) {

        const pagamento =
            await this.pagamentoRepository.findById(id);

        if (!pagamento) {

            throw new AppError(
                "Pagamento não encontrado.",
                404
            );

        }

        return pagamento;

    }

    async update(id, pagamento) {

        await this.findById(id);

        return await this.pagamentoRepository.update(id, pagamento);

    }

    async delete(id) {

        await this.findById(id);

        await this.pagamentoRepository.delete(id);

    }

}

export default PagamentoService;
