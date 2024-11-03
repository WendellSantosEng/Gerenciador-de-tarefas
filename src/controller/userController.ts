import { FastifyRequest, FastifyReply } from 'fastify';

export const getUserInfo = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
        if (request.session.user) {
            const { email, iduser } = request.session.user;
            return reply.send({ email, iduser });
        } else {
            return reply.status(401).send({ error: 'Usuário não está logado.' });
        }
    } catch (e) {
        console.error(e);
        return reply.status(500).send({ error: 'Erro no servidor.' });
    }
};