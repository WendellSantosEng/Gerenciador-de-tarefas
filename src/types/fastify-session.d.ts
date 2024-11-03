import 'fastify';

declare module 'fastify' {
  interface Session {
    user?: { email: string; iduser: string };
  }
}