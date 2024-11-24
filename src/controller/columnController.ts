import { FastifyRequest, FastifyReply } from 'fastify';
import { Board } from '../models/BoardModel';
import { Column } from '../models/ColumnModel';
import mongoose, { Types } from 'mongoose';
import { taskId } from './taskController';

export const columns = async (req: FastifyRequest, res: FastifyReply) => {
    try{
        const columns = await Column.find();
        res.status(200).send(columns);
    }catch(error: any){
        console.error('Erro ao buscar colunas:', error);
        res.status(500).send({message: 'Erro ao buscar colunas', error: error.message});
    }
}

export const columnId = async (req: FastifyRequest<{Params: {id: string}}>, res: FastifyReply) => {
    try{
        const id = req.params.id;
        if (!id){
            res.status(400).send({message: 'ID da coluna é obrigatório'});
            return;
        }
        const column = await Column.findById(id);
        if (!column){
            res.status(404).send({message: 'Coluna não encontrada'});
            return;
        }
        res.status(200).send(column);
    }catch(error: any){
        console.error('Erro ao buscar coluna:', error);
        res.status(500).send({message: 'Erro ao buscar coluna', error: error.message});
    }
}

interface CreateColumnBody {
  name: string;
  boardId: string;
  taskIds?: string[];
}

export const createColumn = async (req: FastifyRequest<{ Body: CreateColumnBody }>,res: FastifyReply) => {
  try {
    const { name, boardId, taskIds } = req.body;

    // Validação: Nome e boardId são obrigatórios
    if (!name || !boardId) {
      res.status(400).send({ message: 'Nome e ID do quadro são obrigatórios.' });
      return;
    }

    // Verificar se o boardId é válido e existe
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      res.status(400).send({ message: 'ID do quadro inválido.' });
      return;
    }

    const board = await Board.findById(boardId);
    if (!board) {
      res.status(404).send({ message: 'Quadro não encontrado.' });
      return;
    }

    // Criar a nova coluna
    const newColumn = new Column({
      name,
      boardId: new Types.ObjectId(boardId),
      taskIds: taskIds ? taskIds.map((id) => new Types.ObjectId(id)) : [],
    });

    await newColumn.save();

    // Associar a nova coluna ao quadro
    board.columnIds.push(newColumn._id as Types.ObjectId);
    await board.save();

    res.status(201).send({
      message: 'Coluna criada e associada ao quadro com sucesso!',
      column: newColumn,
    });
  } catch (error: any) {
    console.error('Erro ao criar coluna:', error);
    res.status(500).send({ message: 'Erro ao criar coluna', error: error.message });
  }
};

interface UpdateColumnBody {
  name?: string;
  taskIds?: string[]; // IDs das tarefas associadas à coluna
  boardId?: string;   // boardId para mover a coluna entre os boards
  removeTaskId?: string; // ID da tarefa a ser removida
}

export const updateColumn = async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateColumnBody }>, res: FastifyReply) => {
  try {
    const { id } = req.params;
    const { name, taskIds, boardId, removeTaskId } = req.body;

    // Verifica se o ID da Coluna é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'ID da Coluna inválido.' });
    }

    // Busca a Coluna no banco de dados
    const column = await Column.findById(id);

    if (!column) {
      return res.status(404).send({ message: 'Coluna não encontrada.' });
    }

    // Garantir que o _id seja tratado corretamente como ObjectId
    const columnId = column._id as Types.ObjectId;

    // Atualiza os campos da coluna
    if (name) column.name = name;

    if (Array.isArray(taskIds)) {
      column.taskIds = taskIds.map((taskId) => {
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
          throw new Error(`Task ID inválido: ${taskId}`);
        }
        return new Types.ObjectId(taskId); // Garantindo a tipagem correta
      });
    }

    // Remove uma tarefa específica do array taskIds
    if (removeTaskId) {
      if (!mongoose.Types.ObjectId.isValid(removeTaskId)) {
        return res.status(400).send({ message: 'ID da tarefa inválido.' });
      }

      column.taskIds = column.taskIds.filter((taskId) => !taskId.equals(removeTaskId));
    }

    let oldBoard = null;

    // Se um boardId for fornecido, mova a coluna para o novo quadro
    if (boardId && mongoose.Types.ObjectId.isValid(boardId)) {
      // Buscar o board antigo para remover a coluna dele
      oldBoard = await Board.findOne({ columnIds: columnId });

      // Atualizar o boardId da coluna
      column.boardId = new Types.ObjectId(boardId); // Garantindo que o boardId seja um ObjectId

      // Se havia um board antigo, remover a coluna dele
      if (oldBoard) {
        oldBoard.columnIds = oldBoard.columnIds.filter(colId => !colId.equals(columnId));
        await oldBoard.save();
      }

      // Adicionar a coluna ao novo board
      const newBoard = await Board.findById(boardId);
      if (!newBoard) {
        return res.status(404).send({ message: 'Board não encontrado.' });
      }
      newBoard.columnIds.push(columnId); // Adiciona a coluna ao novo board
      await newBoard.save();
    } else if (boardId) {
      return res.status(400).send({ message: 'ID do Board inválido.' });
    }

    // Salvar a coluna atualizada
    await column.save();

    res.status(200).send({
      message: 'Coluna atualizada com sucesso!',
      column,
    });
  } catch (error: any) {
    console.error('Erro ao atualizar a Coluna:', error);
    res.status(500).send({ message: 'Erro ao atualizar a Coluna', error: error.message });
  }
};



export const deleteColumn = async (req: FastifyRequest<{Params: {id: string}}>, res: FastifyReply) => {
    try{
        const {id} = req.params;
        if(!id){
            res.status(400).send({message: 'ID da coluna é obrigatório'});
            return;
        }
        const deletedColumn = await Column.findByIdAndDelete(id);
        if(!deletedColumn){
            res.status(404).send({message: 'Coluna não encontrada'});
            return;
        }
        res.status(200).send({message: 'Coluna deletada com sucesso'});
    }catch(error: any){
        console.error('Erro ao deletar coluna:', error);
        res.status(500).send({message: 'Erro ao deletar coluna', error: error.message});
    }
}
