import Fastify from 'fastify';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes/routes';
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors'; // Importa o plugin CORS

dotenv.config();

const fastify = Fastify();
const port = 3000;

// Registre o plugin CORS
fastify.register(fastifyCors, {
    origin: 'http://localhost:3001', // Permita apenas seu frontend
    credentials: true, // Permite cookies
});

// Registra o plugin para cookies
fastify.register(fastifyCookie);

// Registra o plugin para sessões
fastify.register(fastifySession, {
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a variável de ambiente
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Usa secure apenas em produção
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
    }
});

// Registra as rotas
fastify.register(routes);

const dbUri = process.env.DATABASE || '';

// Conecta ao MongoDB
mongoose.connect(dbUri)
  .then(() => {
    console.log('Conectado ao MongoDB');
    fastify.ready().then(() => {
      fastify.listen({ port }, (err, address) => {
        if (err) {
          console.log('Erro ao iniciar o servidor:', err);
          process.exit(1);
        }
        console.log(`Server is running on ${address}`);
      });
    });
  })
  .catch(e => console.log('Erro ao conectar ao MongoDB', e));
