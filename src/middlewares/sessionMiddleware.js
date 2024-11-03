"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const session_1 = __importDefault(require("@fastify/session"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const sessionMiddleware = (fastify) => {
    fastify.register(cookie_1.default);
    fastify.register(session_1.default, {
        secret: 'your-secret-key',
        cookie: { secure: false }, // Defina como true em produção
        saveUninitialized: false,
        resave: false
    });
};
exports.sessionMiddleware = sessionMiddleware;
