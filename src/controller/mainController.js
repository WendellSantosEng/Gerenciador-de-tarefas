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
exports.deleteMainProject = exports.updateMainProject = exports.createMainProject = exports.mainProjectId = exports.mainProjects = void 0;
const MainProject_1 = require("../models/MainProject");
const mongoose_1 = __importDefault(require("mongoose"));
const mainProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mainProjects = yield MainProject_1.MainProject.find();
        res.status(200).send(mainProjects);
    }
    catch (error) {
        res.status(500).send({ message: 'Erro ao buscar projetos principais', error: error.message });
    }
});
exports.mainProjects = mainProjects;
const mainProjectId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const mainProject = yield MainProject_1.MainProject.findById(id);
        if (!mainProject) {
            res.status(404).send({ message: 'Projeto não encontrado' });
            return;
        }
        res.status(200).send(mainProject);
    }
    catch (error) {
        res.status(500).send({ message: 'Erro ao buscar projeto principal', error: error.message });
    }
});
exports.mainProjectId = mainProjectId;
const createMainProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { name, description, boardIds } = req.body;
        // Valida campos obrigatórios
        if (!name) {
            res.status(400).send({ message: 'Nome do projeto é obrigatório' });
            return;
        }
        const ownerIduser = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.ownerId;
        console.log('userId =================>>>>>>>>>>> :', ownerIduser);
        if (!ownerIduser) {
            res.status(401).send({ message: 'Usuário não autenticado' });
            return;
        }
        const ownerId = new mongoose_1.default.Types.ObjectId(ownerIduser);
        const boardObjectIds = boardIds === null || boardIds === void 0 ? void 0 : boardIds.map((id) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error(`boardId inválido: ${id}`);
            }
            return new mongoose_1.default.Types.ObjectId(id);
        });
        // Cria o documento do projeto
        const newProject = new MainProject_1.MainProject({
            name,
            description,
            ownerId: ownerId, // Agora ownerId é um ObjectId válido
            boardIds: boardObjectIds || [], // Garante que boardIds seja um array de ObjectId
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        // Salva o projeto
        yield newProject.save();
        // Responde com sucesso
        res.status(201).send({
            message: 'Projeto criado com sucesso!',
            project: newProject,
        });
    }
    catch (error) {
        if ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes('boardId inválido')) {
            res.status(400).send({ message: error.message });
        }
        else {
            res.status(500).send({
                message: 'Erro ao criar projeto principal',
                error: error.message,
            });
        }
        console.error('Erro ao criar projeto:', error);
    }
});
exports.createMainProject = createMainProject;
const updateMainProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, boardIds } = req.body;
        if (!id) {
            res.status(400).send({ message: 'ID do projeto é obrigatório' });
            return;
        }
        const project = yield MainProject_1.MainProject.findById(id);
        if (!project) {
            res.status(404).send({ message: 'Projeto não encontrado' });
            return;
        }
        if (name != undefined)
            project.name = name;
        if (description != undefined)
            project.description = description;
        if (Array.isArray(boardIds)) {
            project.boardIds = boardIds.map((id) => new mongoose_1.default.Types.ObjectId(id));
        }
        project.updatedAt = new Date();
        yield project.save();
        res.status(200).send({
            message: 'Projeto atualizado com sucesso!',
            project
        });
    }
    catch (error) {
        console.error('Erro ao atualizar projeto principal:', error);
        res.status(500).send({ message: 'Erro ao atualizar projeto principal', error: error.message });
    }
});
exports.updateMainProject = updateMainProject;
const deleteMainProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'ID inválido.' });
        }
        if (!id) {
            res.status(400).send({ message: 'ID do projeto é obrigatório' });
            return;
        }
        const deletedProject = yield MainProject_1.MainProject.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            res.status(404).send({ message: 'Projeto não encontrado' });
            return;
        }
        res.status(200).send({ message: 'Projeto deletado com sucesso!', project: deletedProject, });
    }
    catch (error) {
        console.error('Erro ao deletar projeto principal:', error);
        res.status(500).send({ message: 'Erro ao deletar projeto principal', error: error.message });
    }
});
exports.deleteMainProject = deleteMainProject;
