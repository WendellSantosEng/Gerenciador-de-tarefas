import { FastifyRequest, FastifyReply } from 'fastify';
import { Board } from '../models/BoardModel';
import { MainProject } from '../models/MainProject';
import mongoose from 'mongoose';

export const boards = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
    try{
        const boards = await Board.find();
        res.status(200).send(boards);
    }catch(error: any){
        console.error('Erro ao buscar boards:', error);
        res.status(500).send({message: 'Erro ao buscar boards', error: error.message});
    }
}

export const boardId = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply):Promise<void> => {
    try{
        const id = req.params.id;
        if (!id){
            res.status(400).send({message: 'ID da board é obrigatório'});
            return;
        }
        const board = await Board.findById(id);
        if (!board){
            res.status(404).send({message: 'Board não encontrada'});
            return;
        }
        res.status(200).send(board);
    }catch(error: any){
        console.error('Erro ao buscar board:', error);
        res.status(500).send({message: 'Erro ao buscar board', error: error.message});
    }
}

interface CreateBoardBody {
  name: string;
  mainProjectId: string;
  columnIds?: string[];
}

export const createBoard = async (req: FastifyRequest<{ Body: CreateBoardBody }>,res: FastifyReply) => {
  try {
    const { name, mainProjectId, columnIds } = req.body;

    // Validação: Nome da board e mainProjectId são obrigatórios
    if (!name || !mainProjectId) {
      res.status(400).send({ message: 'Nome e ID do projeto principal são obrigatórios' });
      return;
    }

    // Verificar se o mainProjectId é válido e existe
    if (!mongoose.Types.ObjectId.isValid(mainProjectId)) {
      res.status(400).send({ message: 'mainProjectId inválido' });
      return;
    }

    const mainProject = await MainProject.findById(mainProjectId);
    if (!mainProject) {
      res.status(404).send({ message: 'Projeto principal não encontrado' });
      return;
    }

    // Criar a nova Board
    const newBoard = new Board({
      name,
      mainProjectId: new mongoose.Types.ObjectId(mainProjectId),
      columnIds: columnIds?.map((id) => new mongoose.Types.ObjectId(id)) || [],
    });

    await newBoard.save();

    // Associar a nova Board ao projeto principal
    mainProject.boardIds.push(newBoard._id as mongoose.Types.ObjectId);
    await mainProject.save();

    // Responder com sucesso
    res.status(201).send({
      message: 'Board criada e associada ao projeto com sucesso!',
      board: newBoard,
    });
  } catch (error: any) {
    console.error('Erro ao criar board:', error);
    res.status(500).send({ message: 'Erro ao criar board', error: error.message });
  }
};

interface UpdateBoardBody {
  name?: string;
  columnIdToRemove?: string; // IDs das colunas associadas à board
}

export const updateBoard = async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateBoardBody }>,res: FastifyReply) => {
  try {
    const { id } = req.params;
    const { name, columnIdToRemove } = req.body;

    // Verifica se o ID da board é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'ID da board inválido.' });
    }

    // Busca a board no banco de dados
    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).send({ message: 'Board não encontrada.' });
    }

    // Atualiza os campos se fornecidos
    if (name) board.name = name;

    if (columnIdToRemove) {
      if (!mongoose.Types.ObjectId.isValid(columnIdToRemove)) {
        return res.status(400).send({ message: `columnId inválido: ${columnIdToRemove}` });
      }

      board.columnIds = board.columnIds.filter(
        (colId) => colId.toString() !== columnIdToRemove
      );
    }

    // Salva a board atualizada
    await board.save();

    res.status(200).send({
      message: 'Board atualizada com sucesso!',
      board,
    });
  } catch (error: any) {
    console.error('Erro ao atualizar a board:', error);
    res.status(500).send({ message: 'Erro ao atualizar a board', error: error.message });
  }
};

export const deleteBoard = async (req: FastifyRequest<{ Params: { id: string }, Body: { mainProjectId: string } }>, res: FastifyReply) => {
  try {
      const { id } = req.params;
      const { mainProjectId } = req.body;

      // Verifica se o ID da board e do projeto são válidos
      if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(mainProjectId)) {
          return res.status(400).send({ message: 'IDs inválidos.' });
      }

      if (!id) {
          return res.status(400).send({ message: 'ID da board é obrigatório' });
      }

      if (!mainProjectId) {
          return res.status(400).send({ message: 'ID do projeto é obrigatório' });
      }

      // Deleta a board
      const deletedBoard = await Board.findByIdAndDelete(id);

      if (!deletedBoard) {
          return res.status(404).send({ message: 'Board não encontrada' });
      }

      // Atualiza o projeto, removendo o ID da board do array
      await MainProject.findByIdAndUpdate(
          mainProjectId,
          { $pull: { boardIds: id } }, // Remove o ID da board do array 'boards' no projeto
          { new: true } // Retorna o documento atualizado
      );

      res.status(200).send({
          message: 'Board deletada com sucesso!',
          deletedBoard,
      });

  } catch (error: any) {
      console.error('Erro ao deletar Board:', error);
      res.status(500).send({ message: 'Erro ao deletar Board', error: error.message });
  }
};
