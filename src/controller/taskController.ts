import { FastifyRequest, FastifyReply } from 'fastify';
import { Task } from '../models/TaskModel';
import { Column } from '../models/ColumnModel';
import mongoose, { Types } from 'mongoose';

export const tasks = async (req: FastifyRequest, res: FastifyReply):Promise<void> => {
    try{
        const tasks = await Task.find();
        res.status(200).send(tasks);
    }catch(error: any){
        console.error('Erro ao buscar tasks:', error);
        res.status(500).send({message: 'Erro ao buscar tasks', error: error.message});
    }
}

export const taskId = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
    try{
        const {id} = req.params;
        if(!id){
            res.status(400).send({message: 'ID da task é obrigatório'});
            return;
        }
        const task = await Task.findById(id);
        if(!task){
            res.status(404).send({message: 'Task não encontrada'});
            return;
        }
        res.status(200).send(task);
    }catch(error: any){
        console.error('Erro ao buscar task:', error);
        res.status(500).send({message: 'Erro ao buscar task', error: error.message});
    }
}

interface CreateTaskBody {
    name: string;
    description?: string;
    columnId: string;
    status?: string; // Novo campo opcional para o status
}

export const createTask = async (req: FastifyRequest<{ Body: CreateTaskBody }>, res: FastifyReply) => {
    try {
        const { name, description, columnId, status } = req.body;

        // Validação: Nome e columnId são obrigatórios
        if (!name || !columnId) {
            res.status(400).send({ message: 'Nome e ID da tarefa são obrigatórios.' });
            return;
        }

        // Verificar se o columnId é válido
        if (!mongoose.Types.ObjectId.isValid(columnId)) {
            res.status(400).send({ message: 'ID da coluna inválido.' });
            return;
        }

        const column = await Column.findById(columnId);
        if (!column) {
            res.status(404).send({ message: 'Coluna não encontrada.' });
            return;
        }

        const ownerIduser = req.session.user?.ownerId;
        console.log('userId da task =================>>>>>>>>>>> :', ownerIduser);

        if (!ownerIduser) {
            res.status(401).send({ message: 'Usuário não autenticado' });
            return;
        }

        const ownerId = new mongoose.Types.ObjectId(ownerIduser); // Convertendo ownerIduser para ObjectId corretamente

        // Criar nova tarefa com status padrão "pendente" caso não seja fornecido
        const newTask = new Task({
            name,
            description: description || '',
            columnId,
            status: status || 'pendente', // Valor padrão "pendente"
            assigneeId: ownerId,
        });

        await newTask.save();

        const taskIdAtual = newTask._id as mongoose.Types.ObjectId;

        // Associar a nova tarefa à coluna
        column.taskIds.push(taskIdAtual); // Já é ObjectId
        await column.save();

        res.status(201).send({
            message: 'Tarefa criada e associada à coluna com sucesso!',
            task: newTask,
        });
    } catch (error: any) {
        console.error('Erro ao criar tarefa:', error);
        res.status(500).send({ message: 'Erro ao criar tarefa', error: error.message });
    }
};


interface UpdateTaskBody {
    name?: string;
    description?: string;
    assigneeId?: string;
    columnId?: string; // O ID da coluna para mover a tarefa
    status?: 'pendente' | 'em execução' | 'finalizado'; // Novo campo opcional para status
}

export const updateTask = async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateTaskBody }>, res: FastifyReply) => {
    try {
        const { id } = req.params;
        const { name, description, assigneeId, columnId, status } = req.body;

        // Verifica se o ID da Task é válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'ID da Task inválido.' });
        }

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).send({ message: 'Task não encontrada.' });
        }

        // Atualizações opcionais dos campos da tarefa
        if (name) task.name = name;
        if (description) task.description = description;
        if (assigneeId) task.assigneeId = new mongoose.Schema.Types.ObjectId(assigneeId);

        // Validação do status (se fornecido)
        const validStatuses = ['pendente', 'em execução', 'finalizado'];
        if (status) {
            if (!validStatuses.includes(status)) {
                return res.status(400).send({ message: 'Status inválido. Use: pendente, em execução ou finalizado.' });
            }
            task.status = status;
        }

        // Atualização de coluna, se fornecida
        const taskIdAtual = task._id as mongoose.Types.ObjectId;

        if (columnId && mongoose.Types.ObjectId.isValid(columnId)) {
            const oldColumn = await Column.findOne({ taskIds: taskIdAtual });

            if (oldColumn) {
                oldColumn.taskIds = oldColumn.taskIds.filter((currentTaskId) => {
                    return currentTaskId instanceof mongoose.Types.ObjectId && !currentTaskId.equals(taskIdAtual);
                });
                await oldColumn.save();
            }

            task.columnId = new mongoose.Types.ObjectId(columnId);

            const newColumn = await Column.findById(columnId);
            if (!newColumn) {
                return res.status(404).send({ message: 'Coluna não encontrada.' });
            }

            newColumn.taskIds.push(taskIdAtual);
            await newColumn.save();
        } else if (columnId) {
            return res.status(400).send({ message: 'ID da Coluna inválido.' });
        }

        // Salva a tarefa com os dados completos
        await task.save();

        res.status(200).send({
            message: 'Task atualizada com sucesso!',
            task,
        });
    } catch (error: any) {
        console.error('Erro ao atualizar a Task:', error);
        res.status(500).send({ message: 'Erro ao atualizar a Task', error: error.message });
    }
};



export const deleteTask = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
    try {
        const { id } = req.params;

        // Validação do ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'ID da tarefa inválido.' });
        }

        // Remover a tarefa de todas as colunas onde ela está presente
        const columns = await Column.find({ taskIds: id });
        for (const column of columns) {
            column.taskIds = column.taskIds.filter((taskId) => !taskId.equals(id));
            await column.save();
        }

        // Deletar a tarefa
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).send({ message: 'Tarefa não encontrada.' });
        }

        res.status(200).send({ message: 'Tarefa deletada com sucesso.' });
    } catch (error: any) {
        console.error('Erro ao deletar a tarefa:', error);
        res.status(500).send({ message: 'Erro ao deletar a tarefa', error: error.message });
    }
};

