import { FastifyRequest, FastifyReply } from 'fastify';
import { LoginModel, ILogin } from '../models/LoginModel';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongoose';

interface UpdateUserRequestBody {
    email?: string;
    password?: string;
    name?: string;
}

export const updateUser = async (request: FastifyRequest<{ Body: UpdateUserRequestBody }>, reply: FastifyReply): Promise<void> => {
    try {
        const userId = request.session.user?.iduser;

        if (!userId) {
            return reply.status(400).send({ error: 'Você não está logado.' });
        }

        const { email, password, name } = request.body;

        // Verificar se algum dado foi enviado para atualização
        if (!email && !password && !name) {
            return reply.status(400).send({ error: 'Nenhum dado para atualização enviado.' });
        }

        // Buscar o usuário pelo iduser
        const user = await LoginModel.findOne({ iduser: userId }) as ILogin & { _id: ObjectId };

        if (!user) {
            return reply.status(404).send({ error: 'Usuário não encontrado.' });
        }

        // Atualizar os campos que foram enviados
        if (email) {
            // Validação de formato de email
            if (!validateEmail(email)) {
                return reply.status(400).send({ error: 'Formato de e-mail inválido.' });
            }
            user.email = email;
        }
        if (name) user.name = name;
        if (password) {
            const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
            user.password = hashedPassword;
        }

        // Salvar as alterações
        await user.save();

        // Atualizar a sessão com os novos dados do usuário, incluindo o ownerId
        request.session.user = {
            iduser: user.iduser,
            email: user.email,
            name: user.name,
            ownerId: user._id.toString(),  // Incluindo o ownerId na sessão
        };

        // Responder com sucesso e com os dados atualizados, incluindo o ownerId
        return reply.send({ success: 'Dados atualizados com sucesso.', user: request.session.user });
    } catch (e) {
        console.error(e);
        return reply.status(500).send({ error: 'Erro ao atualizar os dados.' });
    }
};

// Função para validar formato de e-mail
const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};