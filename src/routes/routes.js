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
const loginController_1 = require("../controller/loginController");
const userController_1 = require("../controller/userController");
const updateUserController_1 = require("../controller/updateUserController");
const fastify_multer_1 = __importDefault(require("fastify-multer"));
const path_1 = __importDefault(require("path"));
// importação dos controllers das tarefas
const mainController_1 = require("../controller/mainController");
const boardController_1 = require("../controller/boardController");
const columnController_1 = require("../controller/columnController");
const taskController_1 = require("../controller/taskController");
const storage = fastify_multer_1.default.diskStorage({
    destination: './uploads/', // Pasta onde as imagens serão armazenadas
    filename: (req, file, cb) => {
        cb(null, `image-${Date.now()}${path_1.default.extname(file.originalname)}`); // Nome do arquivo com extensão
    }
});
const upload = (0, fastify_multer_1.default)({ storage });
const routes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get('/', loginController_1.index);
    // ROTAS DE LOGIN/REGISTRO
    fastify.post('/login', loginController_1.login);
    fastify.post('/register', loginController_1.register);
    fastify.post('/logout', loginController_1.logout);
    // ROTAS DE USUARIO (UPDATE)
    fastify.get('/user', userController_1.getUserInfo);
    fastify.put('/user/update', updateUserController_1.updateUser);
    fastify.post('/upload-profile-pic', { preHandler: upload.single('profilePic') }, userController_1.uploadProfilePic);
    // ROTAS DO MAIN PROJECT
    fastify.get('/main-projects', mainController_1.mainProjects);
    fastify.get('/main-projects/:id', mainController_1.mainProjectId);
    fastify.post('/main-projects', mainController_1.createMainProject);
    fastify.put('/main-project/:id', mainController_1.updateMainProject);
    fastify.delete('/main-project/:id', mainController_1.deleteMainProject);
    // ROTAS DAS BOARDS
    fastify.get('/boards', boardController_1.boards);
    fastify.get('/boards/:id', boardController_1.boardId);
    fastify.post('/boards', boardController_1.createBoard);
    fastify.put('/boards/:id', boardController_1.updateBoard);
    fastify.delete('/boards/:id', boardController_1.deleteBoard);
    // ROTAS DAS COLUMNS
    fastify.get('/columns', columnController_1.columns);
    fastify.get('/columns/:id', columnController_1.columnId);
    fastify.post('/columns', columnController_1.createColumn);
    fastify.put('/columns/:id', columnController_1.updateColumn);
    fastify.delete('/columns/:id', columnController_1.deleteColumn);
    // ROTAS DAS TASKS
    fastify.get('/tasks', taskController_1.tasks);
    fastify.get('/tasks/:id', taskController_1.taskId);
    fastify.post('/tasks', taskController_1.createTask);
    fastify.put('/tasks/:id', taskController_1.updateTask);
    fastify.delete('/tasks/:id', taskController_1.deleteTask);
    // ROTA PARA VERIFICAR SE O USUÁRIO ESTÁ LOGADO
    fastify.get('/session', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const user = request.session.user;
        if (user) {
            return { user };
        }
        else {
            return reply.status(401).send({ message: 'Usuário não está logado' });
        }
    }));
});
exports.default = routes;
