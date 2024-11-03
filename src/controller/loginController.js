"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = exports.index = void 0;
const LoginModel_1 = __importStar(require("../models/LoginModel"));
const index = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    if (request.session.user) {
        return reply.send({ message: 'Você está na página inicial.' });
    }
    return reply.send({ message: 'Página de login.' });
});
exports.index = index;
const register = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!request.body || typeof request.body !== 'object' || !request.body.email || !request.body.password) {
            return reply.status(400).send({ error: 'Dados de registro inválidos.' });
        }
        // Gera o ID único
        const uniqueId = yield generateUniqueId();
        // Cria o novo usuário com o ID gerado
        const login = new LoginModel_1.default({
            iduser: uniqueId,
            email: request.body.email,
            password: request.body.password
        });
        yield login.register();
        if (login.errors.length > 0) {
            return reply.code(400).send({ errors: login.errors });
        }
        return reply.send({ success: 'Seu usuário foi criado com sucesso.', id: uniqueId });
    }
    catch (e) {
        console.error(e);
        return reply.status(500).send({ error: 'Erro no servidor' });
    }
});
exports.register = register;
const login = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!request.body || typeof request.body !== 'object' || !request.body.email || !request.body.password) {
            return reply.status(400).send({ error: 'Dados de login inválidos.' });
        }
        const login = new LoginModel_1.default({
            email: request.body.email,
            password: request.body.password
        });
        yield login.login();
        if (login.errors.length > 0) {
            return reply.code(400).send({ errors: login.errors });
        }
        if (login.user) {
            // Armazena o ID e o email na sessão para fácil acesso em outras partes do sistema
            request.session.user = { email: login.user.email, iduser: login.user.iduser }; // Agora iduser é reconhecido
            return reply.send({ success: 'Você entrou no sistema.' });
        }
        else {
            return reply.code(400).send({ error: 'Falha ao fazer login, usuário não encontrado.' });
        }
    }
    catch (e) {
        console.error(e);
        return reply.status(500).send({ error: 'Erro no servidor.' });
    }
});
exports.login = login;
const logout = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (request.session.user) {
            yield request.session.destroy();
            return reply.send({ success: 'Você saiu do sistema.' });
        }
        else {
            return reply.status(400).send({ error: 'Você não está logado.' });
        }
    }
    catch (e) {
        console.error(e);
        return reply.status(500).send({ error: 'Erro ao sair do sistema.' });
    }
});
exports.logout = logout;
// Função para gerar ID único
const generateUniqueId = () => __awaiter(void 0, void 0, void 0, function* () {
    let uniqueId;
    let exists;
    do {
        uniqueId = `#${Math.floor(100000 + Math.random() * 900000)}`; // Gera um número entre 100000 e 999999
        exists = (yield LoginModel_1.LoginModel.findOne({ iduser: uniqueId })) !== null; // Verifica se o ID já existe no banco
    } while (exists);
    return uniqueId;
});
