import { FastifyInstance } from 'fastify';
import { index, register, login, logout } from '../controller/loginController';
import { getUserInfo } from '../controller/userController';

const routes = async (fastify: FastifyInstance) => {
    fastify.get('/', index);
    fastify.post('/login', login);
    fastify.post('/register', register);
    fastify.post('/logout', logout);
    fastify.get('/user', getUserInfo);

    fastify.get('/session', async (request, reply) => {
        const user = request.session.user; 
        if (user) {
            return { user }; 
        } else {
            return reply.status(401).send({ message: 'Usuário não está logado' });
        }
    });
};

export default routes;      

