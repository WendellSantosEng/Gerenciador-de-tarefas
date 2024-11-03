import { FastifyRequest, FastifyReply } from 'fastify';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.session.user) {
        return reply.code(401).send({ error: 'Você precisa estar logado.' });
    }
    reply.send({ message: 'Você está autenticado.' });
};
