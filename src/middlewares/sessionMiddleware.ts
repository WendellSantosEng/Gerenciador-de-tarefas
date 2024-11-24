import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import dotenv from 'dotenv';

export const sessionMiddleware = (fastify: any) => {
    fastify.register(fastifyCookie);
    fastify.register(fastifySession, {
        secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a variável de ambiente
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Usa secure apenas em produção
            maxAge: 1000 * 60 * 60 * 24 // 1 dia
        }
    });
};