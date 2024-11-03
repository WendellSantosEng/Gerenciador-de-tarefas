"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes/routes"));
const session_1 = __importDefault(require("@fastify/session"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const cors_1 = __importDefault(require("@fastify/cors")); // Importa o plugin CORS
dotenv_1.default.config();
const fastify = (0, fastify_1.default)();
const port = 3000;
// Registre o plugin CORS
fastify.register(cors_1.default, {
    origin: 'http://localhost:3001', // Permita apenas seu frontend
    credentials: true, // Permite cookies
});
// Registra o plugin para cookies
fastify.register(cookie_1.default);
// Registra o plugin para sessões
fastify.register(session_1.default, {
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a variável de ambiente
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Usa secure apenas em produção
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
    }
});
// Registra as rotas
fastify.register(routes_1.default);
const dbUri = process.env.DATABASE || '';
// Conecta ao MongoDB
mongoose_1.default.connect(dbUri)
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
