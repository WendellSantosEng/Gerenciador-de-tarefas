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
const loginController_1 = require("../controller/loginController");
const userController_1 = require("../controller/userController");
const routes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get('/', loginController_1.index);
    fastify.post('/login', loginController_1.login);
    fastify.post('/register', loginController_1.register);
    fastify.post('/logout', loginController_1.logout);
    fastify.get('/user', userController_1.getUserInfo);
    fastify.get('/session', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const user = request.session.user;
        if (user) {
            return { user };
        }
        else {
            return reply.status(401).send({ message: 'Usuário não está logado' });
        }
    }));
});
exports.default = routes;
