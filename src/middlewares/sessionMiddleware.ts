import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';

export const sessionMiddleware = (fastify: any) => {
    fastify.register(fastifyCookie);
    fastify.register(fastifySession, {
        secret: 'your-secret-key',
        cookie: { secure: false }, // Defina como true em produção
        saveUninitialized: false,
        resave: false
    });
};