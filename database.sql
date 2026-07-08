CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    dataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE perfilCliente (
    id SERIAL PRIMARY KEY,
    clienteId INTEGER NOT NULL UNIQUE,
    cpf VARCHAR(14) UNIQUE,
    dataNascimento DATE,

    CONSTRAINT fkClientePerfil
        FOREIGN KEY (clienteId)
        REFERENCES cliente(id)
        ON DELETE CASCADE
);



CREATE TABLE mesa (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL UNIQUE,
    capacidade INTEGER NOT NULL CHECK (capacidade > 0),
    status VARCHAR(20) NOT NULL CHECK (
        status IN ('Livre', 'Ocupada', 'Reservada')
    )
);



CREATE TABLE categoria (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);



CREATE TABLE produto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
    categoriaId INTEGER NOT NULL,
    disponivel BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fkCategoria
        FOREIGN KEY (categoriaId)
        REFERENCES categoria(id)
);



CREATE TABLE pedido (
    id SERIAL PRIMARY KEY,
    clienteId INTEGER NOT NULL,
    mesaId INTEGER NOT NULL,
    dataHora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL CHECK (
        status IN (
            'Aberto',
            'Em preparo',
            'Finalizado',
            'Cancelado'
        )
    ),
    valorTotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT fkClientePedido
        FOREIGN KEY (clienteId)
        REFERENCES cliente(id),

    CONSTRAINT fkMesaPedido
        FOREIGN KEY (mesaId)
        REFERENCES mesa(id)
);



CREATE TABLE pedidoItem (
    pedidoId INTEGER NOT NULL,
    produtoId INTEGER NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    precoUnitario NUMERIC(10,2) NOT NULL CHECK (precoUnitario >= 0),

    PRIMARY KEY (pedidoId, produtoId),

    CONSTRAINT fkPedidoItem
        FOREIGN KEY (pedidoId)
        REFERENCES pedido(id)
        ON DELETE CASCADE,

    CONSTRAINT fkProdutoItem
        FOREIGN KEY (produtoId)
        REFERENCES produto(id)
);


CREATE TABLE pagamento (
    id SERIAL PRIMARY KEY,
    pedidoId INTEGER NOT NULL UNIQUE,
    formaPagamento VARCHAR(30) NOT NULL CHECK (
        formaPagamento IN (
            'Dinheiro',
            'Pix',
            'Crédito',
            'Débito'
        )
    ),
    valorPago NUMERIC(10,2) NOT NULL CHECK (valorPago >= 0),
    dataPagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fkPagamentoPedido
        FOREIGN KEY (pedidoId)
        REFERENCES pedido(id)
);