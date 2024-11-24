"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const LoginModel_1 = require("../models/LoginModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const updateUser = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request.session.user) === null || _a === void 0 ? void 0 : _a.iduser;
        if (!userId) {
            return reply.status(400).send({ error: 'Você não está logado.' });
        }
        const { email, password, name } = request.body;
        // Verificar se algum dado foi enviado para atualização
        if (!email && !password && !name) {
            return reply.status(400).send({ error: 'Nenhum dado para atualização enviado.' });
        }
        // Buscar o usuário pelo iduser
        const user = yield LoginModel_1.LoginModel.findOne({ iduser: userId });
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
        if (name)
            user.name = name;
        if (password) {
            const hashedPassword = bcryptjs_1.default.hashSync(password, bcryptjs_1.default.genSaltSync());
            user.password = hashedPassword;
        }
        // Salvar as alterações
        yield user.save();
        // Atualizar a sessão com os novos dados do usuário, incluindo o ownerId
        request.session.user = {
            iduser: user.iduser,
            email: user.email,
            name: user.name,
            ownerId: user._id.toString(), // Incluindo o ownerId na sessão
        };
        // Responder com sucesso e com os dados atualizados, incluindo o ownerId
        return reply.send({ success: 'Dados atualizados com sucesso.', user: request.session.user });
    }
    catch (e) {
        console.error(e);
        return reply.status(500).send({ error: 'Erro ao atualizar os dados.' });
    }
});
exports.updateUser = updateUser;
// Função para validar formato de e-mail
const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};
