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
exports.deleteTask = exports.updateTask = exports.createTask = exports.taskId = exports.tasks = void 0;
const TaskModel_1 = require("../models/TaskModel");
const ColumnModel_1 = require("../models/ColumnModel");
const mongoose_1 = __importDefault(require("mongoose"));
const tasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield TaskModel_1.Task.find();
        res.status(200).send(tasks);
    }
    catch (error) {
        console.error('Erro ao buscar tasks:', error);
        res.status(500).send({ message: 'Erro ao buscar tasks', error: error.message });
    }
});
exports.tasks = tasks;
const taskId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).send({ message: 'ID da task é obrigatório' });
            return;
        }
        const task = yield TaskModel_1.Task.findById(id);
        if (!task) {
            res.status(404).send({ message: 'Task não encontrada' });
            return;
        }
        res.status(200).send(task);
    }
    catch (error) {
        console.error('Erro ao buscar task:', error);
        res.status(500).send({ message: 'Erro ao buscar task', error: error.message });
    }
});
exports.taskId = taskId;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, columnId, status } = req.body;
        // Validação: Nome e columnId são obrigatórios
        if (!name || !columnId) {
            res.status(400).send({ message: 'Nome e ID da tarefa são obrigatórios.' });
            return;
        }
        // Verificar se o columnId é válido
        if (!mongoose_1.default.Types.ObjectId.isValid(columnId)) {
            res.status(400).send({ message: 'ID da coluna inválido.' });
            return;
        }
        const column = yield ColumnModel_1.Column.findById(columnId);
        if (!column) {
            res.status(404).send({ message: 'Coluna não encontrada.' });
            return;
        }
        const ownerIduser = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.ownerId;
        console.log('userId da task =================>>>>>>>>>>> :', ownerIduser);
        if (!ownerIduser) {
            res.status(401).send({ message: 'Usuário não autenticado' });
            return;
        }
        const ownerId = new mongoose_1.default.Types.ObjectId(ownerIduser); // Convertendo ownerIduser para ObjectId corretamente
        // Criar nova tarefa com status padrão "pendente" caso não seja fornecido
        const newTask = new TaskModel_1.Task({
            name,
            description: description || '',
            columnId,
            status: status || 'pendente', // Valor padrão "pendente"
            assigneeId: ownerId,
        });
        yield newTask.save();
        const taskIdAtual = newTask._id;
        // Associar a nova tarefa à coluna
        column.taskIds.push(taskIdAtual); // Já é ObjectId
        yield column.save();
        res.status(201).send({
            message: 'Tarefa criada e associada à coluna com sucesso!',
            task: newTask,
        });
    }
    catch (error) {
        console.error('Erro ao criar tarefa:', error);
        res.status(500).send({ message: 'Erro ao criar tarefa', error: error.message });
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, assigneeId, columnId, status } = req.body;
        // Verifica se o ID da Task é válido
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'ID da Task inválido.' });
        }
        const task = yield TaskModel_1.Task.findById(id);
        if (!task) {
            return res.status(404).send({ message: 'Task não encontrada.' });
        }
        // Atualizações opcionais dos campos da tarefa
        if (name)
            task.name = name;
        if (description)
            task.description = description;
        if (assigneeId)
            task.assigneeId = new mongoose_1.default.Schema.Types.ObjectId(assigneeId);
        // Validação do status (se fornecido)
        const validStatuses = ['pendente', 'em execução', 'finalizado'];
        if (status) {
            if (!validStatuses.includes(status)) {
                return res.status(400).send({ message: 'Status inválido. Use: pendente, em execução ou finalizado.' });
            }
            task.status = status;
        }
        // Atualização de coluna, se fornecida
        const taskIdAtual = task._id;
        if (columnId && mongoose_1.default.Types.ObjectId.isValid(columnId)) {
            const oldColumn = yield ColumnModel_1.Column.findOne({ taskIds: taskIdAtual });
            if (oldColumn) {
                oldColumn.taskIds = oldColumn.taskIds.filter((currentTaskId) => {
                    return currentTaskId instanceof mongoose_1.default.Types.ObjectId && !currentTaskId.equals(taskIdAtual);
                });
                yield oldColumn.save();
            }
            task.columnId = new mongoose_1.default.Types.ObjectId(columnId);
            const newColumn = yield ColumnModel_1.Column.findById(columnId);
            if (!newColumn) {
                return res.status(404).send({ message: 'Coluna não encontrada.' });
            }
            newColumn.taskIds.push(taskIdAtual);
            yield newColumn.save();
        }
        else if (columnId) {
            return res.status(400).send({ message: 'ID da Coluna inválido.' });
        }
        // Salva a tarefa com os dados completos
        yield task.save();
        res.status(200).send({
            message: 'Task atualizada com sucesso!',
            task,
        });
    }
    catch (error) {
        console.error('Erro ao atualizar a Task:', error);
        res.status(500).send({ message: 'Erro ao atualizar a Task', error: error.message });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validação do ID
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'ID da tarefa inválido.' });
        }
        // Remover a tarefa de todas as colunas onde ela está presente
        const columns = yield ColumnModel_1.Column.find({ taskIds: id });
        for (const column of columns) {
            column.taskIds = column.taskIds.filter((taskId) => !taskId.equals(id));
            yield column.save();
        }
        // Deletar a tarefa
        const deletedTask = yield TaskModel_1.Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).send({ message: 'Tarefa não encontrada.' });
        }
        res.status(200).send({ message: 'Tarefa deletada com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao deletar a tarefa:', error);
        res.status(500).send({ message: 'Erro ao deletar a tarefa', error: error.message });
    }
});
exports.deleteTask = deleteTask;
