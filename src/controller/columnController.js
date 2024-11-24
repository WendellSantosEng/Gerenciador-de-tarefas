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
exports.deleteColumn = exports.updateColumn = exports.createColumn = exports.columnId = exports.columns = void 0;
const BoardModel_1 = require("../models/BoardModel");
const ColumnModel_1 = require("../models/ColumnModel");
const mongoose_1 = __importStar(require("mongoose"));
const columns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const columns = yield ColumnModel_1.Column.find();
        res.status(200).send(columns);
    }
    catch (error) {
        console.error('Erro ao buscar colunas:', error);
        res.status(500).send({ message: 'Erro ao buscar colunas', error: error.message });
    }
});
exports.columns = columns;
const columnId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).send({ message: 'ID da coluna é obrigatório' });
            return;
        }
        const column = yield ColumnModel_1.Column.findById(id);
        if (!column) {
            res.status(404).send({ message: 'Coluna não encontrada' });
            return;
        }
        res.status(200).send(column);
    }
    catch (error) {
        console.error('Erro ao buscar coluna:', error);
        res.status(500).send({ message: 'Erro ao buscar coluna', error: error.message });
    }
});
exports.columnId = columnId;
const createColumn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, boardId, taskIds } = req.body;
        // Validação: Nome e boardId são obrigatórios
        if (!name || !boardId) {
            res.status(400).send({ message: 'Nome e ID do quadro são obrigatórios.' });
            return;
        }
        // Verificar se o boardId é válido e existe
        if (!mongoose_1.default.Types.ObjectId.isValid(boardId)) {
            res.status(400).send({ message: 'ID do quadro inválido.' });
            return;
        }
        const board = yield BoardModel_1.Board.findById(boardId);
        if (!board) {
            res.status(404).send({ message: 'Quadro não encontrado.' });
            return;
        }
        // Criar a nova coluna
        const newColumn = new ColumnModel_1.Column({
            name,
            boardId: new mongoose_1.Types.ObjectId(boardId),
            taskIds: taskIds ? taskIds.map((id) => new mongoose_1.Types.ObjectId(id)) : [],
        });
        yield newColumn.save();
        // Associar a nova coluna ao quadro
        board.columnIds.push(newColumn._id);
        yield board.save();
        res.status(201).send({
            message: 'Coluna criada e associada ao quadro com sucesso!',
            column: newColumn,
        });
    }
    catch (error) {
        console.error('Erro ao criar coluna:', error);
        res.status(500).send({ message: 'Erro ao criar coluna', error: error.message });
    }
});
exports.createColumn = createColumn;
const updateColumn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, taskIds, boardId, removeTaskId } = req.body;
        // Verifica se o ID da Coluna é válido
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'ID da Coluna inválido.' });
        }
        // Busca a Coluna no banco de dados
        const column = yield ColumnModel_1.Column.findById(id);
        if (!column) {
            return res.status(404).send({ message: 'Coluna não encontrada.' });
        }
        // Garantir que o _id seja tratado corretamente como ObjectId
        const columnId = column._id;
        // Atualiza os campos da coluna
        if (name)
            column.name = name;
        if (Array.isArray(taskIds)) {
            column.taskIds = taskIds.map((taskId) => {
                if (!mongoose_1.default.Types.ObjectId.isValid(taskId)) {
                    throw new Error(`Task ID inválido: ${taskId}`);
                }
                return new mongoose_1.Types.ObjectId(taskId); // Garantindo a tipagem correta
            });
        }
        // Remove uma tarefa específica do array taskIds
        if (removeTaskId) {
            if (!mongoose_1.default.Types.ObjectId.isValid(removeTaskId)) {
                return res.status(400).send({ message: 'ID da tarefa inválido.' });
            }
            column.taskIds = column.taskIds.filter((taskId) => !taskId.equals(removeTaskId));
        }
        let oldBoard = null;
        // Se um boardId for fornecido, mova a coluna para o novo quadro
        if (boardId && mongoose_1.default.Types.ObjectId.isValid(boardId)) {
            // Buscar o board antigo para remover a coluna dele
            oldBoard = yield BoardModel_1.Board.findOne({ columnIds: columnId });
            // Atualizar o boardId da coluna
            column.boardId = new mongoose_1.Types.ObjectId(boardId); // Garantindo que o boardId seja um ObjectId
            // Se havia um board antigo, remover a coluna dele
            if (oldBoard) {
                oldBoard.columnIds = oldBoard.columnIds.filter(colId => !colId.equals(columnId));
                yield oldBoard.save();
            }
            // Adicionar a coluna ao novo board
            const newBoard = yield BoardModel_1.Board.findById(boardId);
            if (!newBoard) {
                return res.status(404).send({ message: 'Board não encontrado.' });
            }
            newBoard.columnIds.push(columnId); // Adiciona a coluna ao novo board
            yield newBoard.save();
        }
        else if (boardId) {
            return res.status(400).send({ message: 'ID do Board inválido.' });
        }
        // Salvar a coluna atualizada
        yield column.save();
        res.status(200).send({
            message: 'Coluna atualizada com sucesso!',
            column,
        });
    }
    catch (error) {
        console.error('Erro ao atualizar a Coluna:', error);
        res.status(500).send({ message: 'Erro ao atualizar a Coluna', error: error.message });
    }
});
exports.updateColumn = updateColumn;
const deleteColumn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).send({ message: 'ID da coluna é obrigatório' });
            return;
        }
        const deletedColumn = yield ColumnModel_1.Column.findByIdAndDelete(id);
        if (!deletedColumn) {
            res.status(404).send({ message: 'Coluna não encontrada' });
            return;
        }
        res.status(200).send({ message: 'Coluna deletada com sucesso' });
    }
    catch (error) {
        console.error('Erro ao deletar coluna:', error);
        res.status(500).send({ message: 'Erro ao deletar coluna', error: error.message });
    }
});
exports.deleteColumn = deleteColumn;
