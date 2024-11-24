import { FastifyInstance } from 'fastify';
import { index, register, login, logout } from '../controller/loginController';
import { getUserInfo, uploadProfilePic } from '../controller/userController';
import { updateUser } from '../controller/updateUserController';
import fastifyMulter from 'fastify-multer';
import path from 'path';
// importação dos controllers das tarefas
import {mainProjects, mainProjectId, createMainProject, updateMainProject, deleteMainProject} from '../controller/mainController'
import {boards, boardId, createBoard, updateBoard, deleteBoard} from '../controller/boardController'
import {columns, columnId, createColumn, updateColumn, deleteColumn} from '../controller/columnController'
import {tasks, taskId, createTask, updateTask, deleteTask} from '../controller/taskController'

const storage = fastifyMulter.diskStorage({
    destination: './uploads/',  // Pasta onde as imagens serão armazenadas
    filename: (req, file, cb) => {
        cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);  // Nome do arquivo com extensão
    }
});

const upload = fastifyMulter({ storage });

const routes = async (fastify: FastifyInstance) => {

    fastify.get('/', index);
    // ROTAS DE LOGIN/REGISTRO
    fastify.post('/login', login);
    fastify.post('/register', register);
    fastify.post('/logout', logout);
    // ROTAS DE USUARIO (UPDATE)
    fastify.get('/user', getUserInfo);
    fastify.put('/user/update', updateUser);
    fastify.post('/upload-profile-pic', { preHandler: upload.single('profilePic') }, uploadProfilePic);
    // ROTAS DO MAIN PROJECT
    fastify.get('/main-projects', mainProjects);
    fastify.get('/main-projects/:id', mainProjectId);
    fastify.post('/main-projects', createMainProject);
    fastify.put('/main-project/:id',updateMainProject);
    fastify.delete('/main-project/:id', deleteMainProject); 
    // ROTAS DAS BOARDS
    fastify.get('/boards', boards);
    fastify.get('/boards/:id', boardId);
    fastify.post('/boards', createBoard);
    fastify.put('/boards/:id', updateBoard);
    fastify.delete('/boards/:id', deleteBoard);
    // ROTAS DAS COLUMNS
    fastify.get('/columns', columns);
    fastify.get('/columns/:id', columnId);
    fastify.post('/columns', createColumn);
    fastify.put('/columns/:id', updateColumn);
    fastify.delete('/columns/:id', deleteColumn);
    // ROTAS DAS TASKS
    fastify.get('/tasks', tasks);
    fastify.get('/tasks/:id', taskId);
    fastify.post('/tasks', createTask);
    fastify.put('/tasks/:id', updateTask);
    fastify.delete('/tasks/:id', deleteTask);

    // ROTA PARA VERIFICAR SE O USUÁRIO ESTÁ LOGADO
    fastify.get('/session', async (request, reply) => {
        const user = request.session.user; 
        if (user) {
            return { user }; 
        } else {
            return reply.status(401).send({ message: 'Usuário não está logado' });
        }
    });
};

export default routes;