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
exports.uploadProfilePic = exports.getUserInfo = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const LoginModel_1 = require("../models/LoginModel");
const getUserInfo = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (request.session.user) {
            const { email, iduser, name } = request.session.user;
            return reply.send({ email, iduser, name });
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
const uploadProfilePic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Recebendo arquivo...');
        const data = yield req.file(); // Obtém o arquivo da requisição
        if (!data) {
            console.log('Nenhuma imagem foi enviada.');
            return res.status(400).send('Nenhuma imagem foi enviada.');
        }
        const uploadPath = path_1.default.join(__dirname, '..', 'uploads', `image-${Date.now()}${path_1.default.extname(data.filename)}`);
        console.log('Caminho do upload:', uploadPath);
        // Cria o arquivo de destino
        const writeStream = fs_1.default.createWriteStream(uploadPath);
        data.file.pipe(writeStream);
        writeStream.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
            // Salvar a URL da imagem no banco de dados
            const imageUrl = `/uploads/${path_1.default.basename(uploadPath)}`;
            console.log('URL da imagem:', imageUrl);
            try {
                // Aqui, encontramos ou criamos um usuário com base no e-mail
                const user = yield LoginModel_1.LoginModel.findOneAndUpdate({ email: req.body.email }, // Supondo que o e-mail esteja no corpo da requisição
                { profilePic: imageUrl }, { upsert: true, new: true });
                console.log('Usuário atualizado:', user);
                res.status(200).send({
                    success: true,
                    profilePic: imageUrl,
                    message: 'Imagem de perfil enviada e salva com sucesso!',
                    user
                });
            }
            catch (err) {
                console.error('Erro ao salvar a imagem no banco de dados:', err);
                res.status(500).send('Erro ao salvar a imagem no banco de dados.');
            }
        }));
        writeStream.on('error', (err) => {
            console.error('Erro ao escrever o arquivo:', err);
            res.status(500).send('Erro ao escrever o arquivo.');
        });
    }
    catch (error) {
        console.error('Erro ao processar upload de imagem:', error);
        res.status(500).send({ success: false, message: 'Erro ao processar upload de imagem' });
    }
});
exports.uploadProfilePic = uploadProfilePic;
