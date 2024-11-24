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
exports.deleteBoard = exports.updateBoard = exports.createBoard = exports.boardId = exports.boards = void 0;
const BoardModel_1 = require("../models/BoardModel");
const MainProject_1 = require("../models/MainProject");
const mongoose_1 = __importDefault(require("mongoose"));
const boards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boards = yield BoardModel_1.Board.find();
        res.status(200).send(boards);
    }
    catch (error) {
        console.error('Erro ao buscar boards:', error);
        res.status(500).send({ message: 'Erro ao buscar boards', error: error.message });
    }
});
exports.boards = boards;
const boardId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).send({ message: 'ID da board é obrigatório' });
            return;
        }
        const board = yield BoardModel_1.Board.findById(id);
        if (!board) {
            res.status(404).send({ message: 'Board não encontrada' });
            return;
        }
        res.status(200).send(board);
    }
    catch (error) {
        console.error('Erro ao buscar board:', error);
        res.status(500).send({ message: 'Erro ao buscar board', error: error.message });
    }
});
exports.boardId = boardId;
const createBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, mainProjectId, columnIds } = req.body;
        // Validação: Nome da board e mainProjectId são obrigatórios
        if (!name || !mainProjectId) {
            res.status(400).send({ message: 'Nome e ID do projeto principal são obrigatórios' });
            return;
        }
        // Verificar se o mainProjectId é válido e existe
        if (!mongoose_1.default.Types.ObjectId.isValid(mainProjectId)) {
            res.status(400).send({ message: 'mainProjectId inválido' });
            return;
        }
        const mainProject = yield MainProject_1.MainProject.findById(mainProjectId);
        if (!mainProject) {
            res.status(404).send({ message: 'Projeto principal não encontrado' });
            return;
        }
        // Criar a nova Board
        const newBoard = new BoardModel_1.Board({
            name,
            mainProjectId: new mongoose_1.default.Types.ObjectId(mainProjectId),
            columnIds: (columnIds === null || columnIds === void 0 ? void 0 : columnIds.map((id) => new mongoose_1.default.Types.ObjectId(id))) || [],
        });
        yield newBoard.save();
        // Associar a nova Board ao projeto principal
        mainProject.boardIds.push(newBoard._id);
        yield mainProject.save();
        // Responder com sucesso
        res.status(201).send({
            message: 'Board criada e associada ao projeto com sucesso!',
            board: newBoard,
        });
    }
    catch (error) {
        console.error('Erro ao criar board:', error);
        res.status(500).send({ message: 'Erro ao criar board', error: error.message });
    }
});
exports.createBoard = createBoard;
const updateBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, columnIdToRemove } = req.body;
        // Verifica se o ID da board é válido
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'ID da board inválido.' });
        }
        // Busca a board no banco de dados
        const board = yield BoardModel_1.Board.findById(id);
        if (!board) {
            return res.status(404).send({ message: 'Board não encontrada.' });
        }
        // Atualiza os campos se fornecidos
        if (name)
            board.name = name;
        if (columnIdToRemove) {
            if (!mongoose_1.default.Types.ObjectId.isValid(columnIdToRemove)) {
                return res.status(400).send({ message: `columnId inválido: ${columnIdToRemove}` });
            }
            board.columnIds = board.columnIds.filter((colId) => colId.toString() !== columnIdToRemove);
        }
        // Salva a board atualizada
        yield board.save();
        res.status(200).send({
            message: 'Board atualizada com sucesso!',
            board,
        });
    }
    catch (error) {
        console.error('Erro ao atualizar a board:', error);
        res.status(500).send({ message: 'Erro ao atualizar a board', error: error.message });
    }
});
exports.updateBoard = updateBoard;
const deleteBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { mainProjectId } = req.body;
        // Verifica se o ID da board e do projeto são válidos
        if (!mongoose_1.default.Types.ObjectId.isValid(id) || !mongoose_1.default.Types.ObjectId.isValid(mainProjectId)) {
            return res.status(400).send({ message: 'IDs inválidos.' });
        }
        if (!id) {
            return res.status(400).send({ message: 'ID da board é obrigatório' });
        }
        if (!mainProjectId) {
            return res.status(400).send({ message: 'ID do projeto é obrigatório' });
        }
        // Deleta a board
        const deletedBoard = yield BoardModel_1.Board.findByIdAndDelete(id);
        if (!deletedBoard) {
            return res.status(404).send({ message: 'Board não encontrada' });
        }
        // Atualiza o projeto, removendo o ID da board do array
        yield MainProject_1.MainProject.findByIdAndUpdate(mainProjectId, { $pull: { boardIds: id } }, // Remove o ID da board do array 'boards' no projeto
        { new: true } // Retorna o documento atualizado
        );
        res.status(200).send({
            message: 'Board deletada com sucesso!',
            deletedBoard,
        });
    }
    catch (error) {
        console.error('Erro ao deletar Board:', error);
        res.status(500).send({ message: 'Erro ao deletar Board', error: error.message });
    }
});
exports.deleteBoard = deleteBoard;
