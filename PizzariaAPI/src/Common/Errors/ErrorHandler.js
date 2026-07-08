import AppError from "./AppError.js";

function errorHandler(error, request, reply) {

    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            statusCode: error.statusCode,
            message: error.message
        });
    }

    request.log.error(error);

    return reply.status(500).send({
        statusCode: 500,
        message: "Erro interno do servidor."
    });
}

export default errorHandler;