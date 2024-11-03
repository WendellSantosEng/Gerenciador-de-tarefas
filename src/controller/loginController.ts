import { FastifyRequest, FastifyReply } from 'fastify';
import Login, { LoginModel } from '../models/LoginModel';

interface LoginRequestBody {
    iduser?: string;  // Adicionando 'iduser' como opcional
    email: string;
    password: string;
}

export const index = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (request.session.user) {
        return reply.send({ message: 'Você está na página inicial.' });
    }
    return reply.send({ message: 'Página de login.' });
};

export const register = async (request: FastifyRequest<{ Body: LoginRequestBody }>, reply: FastifyReply): Promise<void> => {
    try {
        if (!request.body || typeof request.body !== 'object' || !request.body.email || !request.body.password) {
            return reply.status(400).send({ error: 'Dados de registro inválidos.' });
        }

        // Gera o ID único
        const uniqueId = await generateUniqueId();

        // Cria o novo usuário com o ID gerado
        const login = new Login({
            iduser: uniqueId,
            email: request.body.email,
            password: request.body.password
        });

        await login.register();

        if (login.errors.length > 0) {
            return reply.code(400).send({ errors: login.errors });
        }

        return reply.send({ success: 'Seu usuário foi criado com sucesso.', id: uniqueId });
    } catch (e) {
        console.error(e);
        return reply.status(500).send({ error: 'Erro no servidor' });
    }
};

export const login = async (request: FastifyRequest<{ Body: LoginRequestBody }>, reply: FastifyReply): Promise<void> => {
    try {
        if (!request.body || typeof request.body !== 'object' || !request.body.email || !request.body.password) {
            return reply.status(400).send({ error: 'Dados de login inválidos.' });
        }

        const login = new Login({
            email: request.body.email,
            password: request.body.password
        });
        await login.login();

        if (login.errors.length > 0) {
            return reply.code(400).send({ errors: login.errors });
        }

        if (login.user) {
            // Armazena o ID e o email na sessão para fácil acesso em outras partes do sistema
            request.session.user = { email: login.user.email, iduser: login.user.iduser }; // Agora iduser é reconhecido
            return reply.send({ success: 'Você entrou no sistema.' });
        } else {
            return reply.code(400).send({ error: 'Falha ao fazer login, usuário não encontrado.' });
        }
    } catch (e) {
        console.error(e);
        return reply.status(500).send({ error: 'Erro no servidor.' });
    }
};

export const logout = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
        if (request.session.user) {
            await request.session.destroy();
            return reply.send({ success: 'Você saiu do sistema.' });
        } else {
            return reply.status(400).send({ error: 'Você não está logado.' });
        }
    } catch (e) {
        console.error(e);
        return reply.status(500).send({ error: 'Erro ao sair do sistema.' });
    }
};

// Função para gerar ID único
const generateUniqueId = async (): Promise<string> => {
    let uniqueId: string;
    let exists: boolean;

    do {
        uniqueId = `#${Math.floor(100000 + Math.random() * 900000)}`; // Gera um número entre 100000 e 999999
        exists = (await LoginModel.findOne({ iduser: uniqueId })) !== null; // Verifica se o ID já existe no banco
    } while (exists);

    return uniqueId;
};