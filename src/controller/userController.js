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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = void 0;
const getUserInfo = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (request.session.user) {
            const { email, iduser } = request.session.user;
            return reply.send({ email, iduser });
        }
        else {
            return reply.status(401).send({ error: 'Usuário não está logado.' });
        }
    }
    catch (e) {
        console.error(e);
        return reply.status(500).send({ error: 'Erro no servidor.' });
    }
});
exports.getUserInfo = getUserInfo;
