import AppError from "../../Common/Errors/AppError.js";

const STATUS_VALIDOS = ["Aberto", "Em preparo", "Finalizado", "Cancelado"];

const TRANSICOES_PERMITIDAS = {
    "Aberto": ["Em preparo", "Cancelado"],
    "Em preparo": ["Finalizado", "Cancelado"],
    "Finalizado": [],
    "Cancelado": []
};

class PedidoService {

    constructor(pedidoRepository) {

        this.pedidoRepository = pedidoRepository;

    }

    async create(pedido) {

        const { clienteId, mesaId, itens } = pedido;

        const cliente =
            await this.pedidoRepository.clienteExiste(clienteId);

        if (!cliente) {

            throw new AppError(
                "Cliente não encontrado.",
                404
            );

        }

        const mesa =
            await this.pedidoRepository.mesaExiste(mesaId);

        if (!mesa) {

            throw new AppError(
                "Mesa não encontrada.",
                404
            );

        }

        if (mesa.status === "Ocupada") {

            throw new AppError(
                "Não é possível abrir um pedido em uma mesa que já está ocupada.",
                400
            );

        }

        if (!itens || itens.length === 0) {

            throw new AppError(
                "O pedido deve conter ao menos um item.",
                400
            );

        }

        const itensComPreco = [];

        for (const item of itens) {

            if (!item.quantidade || item.quantidade <= 0) {

                throw new AppError(
                    "A quantidade de cada item deve ser maior que zero.",
                    400
                );

            }

            const produto =
                await this.pedidoRepository.buscarProduto(item.produtoId);

            if (!produto) {

                throw new AppError(
                    `Produto de id ${item.produtoId} não encontrado.`,
                    404
                );

            }

            if (!produto.disponivel) {

                throw new AppError(
                    `O produto "${produto.nome}" não está disponível no momento.`,
                    400
                );

            }

            itensComPreco.push({
                produtoId: produto.id,
                quantidade: item.quantidade,
                precoUnitario: Number(produto.preco)
            });

        }

        return await this.pedidoRepository.create(pedido, itensComPreco);

    }

    async findAll() {

        return await this.pedidoRepository.findAll();

    }

    async findById(id) {

        const pedido =
            await this.pedidoRepository.findById(id);

        if (!pedido) {

            throw new AppError(
                "Pedido não encontrado.",
                404
            );

        }

        return pedido;

    }

    async atualizarStatus(id, novoStatus) {

        const pedido = await this.findById(id);

        if (!STATUS_VALIDOS.includes(novoStatus)) {

            throw new AppError(
                "Status de pedido inválido.",
                400
            );

        }

        const transicoesPermitidas = TRANSICOES_PERMITIDAS[pedido.status];

        if (!transicoesPermitidas.includes(novoStatus)) {

            throw new AppError(
                `Não é possível mudar o status de "${pedido.status}" para "${novoStatus}".`,
                400
            );

        }

        const pedidoAtualizado =
            await this.pedidoRepository.atualizarStatus(id, novoStatus);

        if (novoStatus === "Finalizado" || novoStatus === "Cancelado") {

            await this.pedidoRepository.liberarMesa(pedido.mesa_id);

        }

        return pedidoAtualizado;

    }

    async delete(id) {

        const pedido = await this.findById(id);

        if (pedido.status !== "Aberto") {

            throw new AppError(
                "Só é possível remover pedidos que ainda estão com status \"Aberto\".",
                400
            );

        }

        const pagamento =
            await this.pedidoRepository.possuiPagamento(id);

        if (pagamento) {

            throw new AppError(
                "Não é possível remover um pedido que já possui pagamento registrado.",
                400
            );

        }

        await this.pedidoRepository.delete(id);

    }

}

export default PedidoService;
