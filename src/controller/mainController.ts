import { FastifyRequest, FastifyReply } from 'fastify';
import { MainProject } from '../models/MainProject';
import mongoose, { Types } from 'mongoose';

interface GetMainProjectByIdRequest extends FastifyRequest {
    params: {
        id: string;
    };
}

export const mainProjects = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
    try{
        const mainProjects = await MainProject.find();
        res.status(200).send(mainProjects);
    }catch(error: any){
     res.status(500).send({message: 'Erro ao buscar projetos principais', error: error.message});   
    }
}

export const mainProjectId = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply):Promise<void> => {
    try{
        const id = req.params.id;
        const mainProject = await MainProject.findById(id);
        if (!mainProject){
            res.status(404).send({message: 'Projeto não encontrado'});
            return;
        }
        res.status(200).send(mainProject);
    }catch(error: any){
        res.status(500).send({message: 'Erro ao buscar projeto principal', error: error.message});
    }
}

interface CreateMainProjectBody {
  name: string;
  description?: string;
  ownerId: Types.ObjectId;
  boardIds?: string[];
}

export const createMainProject = async (req: FastifyRequest<{ Body: CreateMainProjectBody }>,res: FastifyReply) => {
  try {
    const { name, description, boardIds } = req.body;

    // Valida campos obrigatórios
    if (!name) {
      res.status(400).send({ message: 'Nome do projeto é obrigatório' });
      return;
    }

    const ownerIduser = req.session.user?.ownerId;

    console.log('userId =================>>>>>>>>>>> :', ownerIduser);

    if (!ownerIduser) {
        res.status(401).send({ message: 'Usuário não autenticado' });
        return;
    }

    const ownerId = new mongoose.Types.ObjectId(ownerIduser);

    const boardObjectIds = boardIds?.map((id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`boardId inválido: ${id}`);
        }
        return new mongoose.Types.ObjectId(id);
      });

    // Cria o documento do projeto
    const newProject = new MainProject({
      name,
      description,
      ownerId: ownerId, // Agora ownerId é um ObjectId válido
      boardIds: boardObjectIds || [], // Garante que boardIds seja um array de ObjectId
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Salva o projeto
    await newProject.save();

    // Responde com sucesso
    res.status(201).send({
      message: 'Projeto criado com sucesso!',
      project: newProject,
    });
  } catch (error: any) {
    if (error.message?.includes('boardId inválido')) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send({
        message: 'Erro ao criar projeto principal',
        error: error.message,
      });
    }
    console.error('Erro ao criar projeto:', error);
  }
};


interface UpdateMainProjectBody {
    name?: string;
    description?: string;
    boardIds?: string[];
}

export const updateMainProject = async (req: FastifyRequest<{Params:{id : string}; Body: UpdateMainProjectBody}>, res: FastifyReply) => {
    try{
        const {id} = req.params;
        const {name, description, boardIds} = req.body;

        if(!id){
            res.status(400).send({message: 'ID do projeto é obrigatório'});
            return;
        }

        const project = await MainProject.findById(id);

        if(!project){
            res.status(404).send({message: 'Projeto não encontrado'});
            return;
        }

        if(name != undefined) project.name = name;
        if(description != undefined) project.description = description;
        if (Array.isArray(boardIds)) {
            project.boardIds = boardIds.map((id) => new mongoose.Types.ObjectId(id));
        }
          
        project.updatedAt = new Date();

        await project.save();

        res.status(200).send({
            message: 'Projeto atualizado com sucesso!',
            project
        });

    }catch(error: any){
        console.error('Erro ao atualizar projeto principal:', error);
        res.status(500).send({message: 'Erro ao atualizar projeto principal', error: error.message});
    }
}

export const deleteMainProject = async (req: FastifyRequest<{Params:{id: string}}>, res: FastifyReply) => {
  try{
      const {id} = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).send({ message: 'ID inválido.' });
      }
      if (!id){
          res.status(400).send({message: 'ID do projeto é obrigatório'});
          return;
      }

      const deletedProject = await MainProject.findByIdAndDelete(req.params.id);

      if (!deletedProject){
          res.status(404).send({message: 'Projeto não encontrado'});
          return;
      }

      res.status(200).send({message: 'Projeto deletado com sucesso!', project: deletedProject,});

  }catch(error: any){
      console.error('Erro ao deletar projeto principal:', error);
      res.status(500).send({message: 'Erro ao deletar projeto principal', error: error.message});
  }
}

