
## Instalação
1. Clone o repositório:
    ```sh
    git clone <repository-url>
    ```
2. Navegue até o diretório do projeto:
    ```sh
    cd <project-directory>
    ```
3. Instale as dependências:
    ```sh
    npm install
    ```

## Configuração
1. Crie um arquivo `.env` no diretório raiz e adicione as variáveis de ambiente necessárias. Você pode usar o arquivo `example.env` como referência.

## Executando o Projeto
1. Inicie o servidor de desenvolvimento:
    ```sh
    npm run dev
    ```

## Componentes do Projeto

### Modelos
- **BoardModel**: Define o esquema para quadros.
    - Arquivo: [src/models/BoardModel.js](src/models/BoardModel.js)
    - Exemplo de uso:
    ```javascript
    const boardSchema = new mongoose.Schema({
        name: { type: String, required: true },
        mainProjectId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'MainProject' },
        columnIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }],
    });
    const Board = mongoose.model('Board', boardSchema);
    ```
- **ColumnModel**: Define o esquema para colunas.
    - Arquivo: [src/models/ColumnModel.js](src/models/ColumnModel.js)
- **LoginModel**: Define o esquema para login de usuários.
    - Arquivo: [src/models/LoginModel.js](src/models/LoginModel.js)
- **MainProjectModel**: Define o esquema para projetos principais.
    - Arquivo: [src/models/MainProjectModel.js](src/models/MainProjectModel.js)
- **TaskModel**: Define o esquema para tarefas.
    - Arquivo: [src/models/TaskModel.js](src/models/TaskModel.js)

### Controladores
- **boardController**: Lida com operações relacionadas a quadros.
    - Arquivo: [src/controller/boardController.js](src/controller/boardController.js)
    - Funções principais:
        - `boards`: Retorna todos os quadros.
        - `boardId`: Retorna um quadro pelo ID.
        - `createBoard`: Cria um novo quadro.
        - `updateBoard`: Atualiza um quadro existente.
        - `deleteBoard`: Deleta um quadro.
- **columnController**: Lida com operações relacionadas a colunas.
    - Arquivo: [src/controller/columnController.js](src/controller/columnController.js)
- **loginController**: Lida com autenticação de usuários.
    - Arquivo: [src/controller/loginController.js](src/controller/loginController.js)
- **mainController**: Lida com operações relacionadas a projetos principais.
    - Arquivo: [src/controller/mainController.js](src/controller/mainController.js)
- **taskController**: Lida com operações relacionadas a tarefas.
    - Arquivo: [src/controller/taskController.js](src/controller/taskController.js)
- **updateUserController**: Lida com operações de atualização de usuários.
    - Arquivo: [src/controller/updateUserController.js](src/controller/updateUserController.js)
- **userController**: Lida com operações relacionadas a usuários.
    - Arquivo: [src/controller/userController.js](src/controller/userController.js)

### Rotas
- Define os endpoints da API para a aplicação.
    - Arquivo: [src/routes/routes.js](src/routes/routes.js)
    - Exemplo de rotas:
    ```javascript
    fastify.get('/boards', boardController.boards);
    fastify.get('/boards/:id', boardController.boardId);
    fastify.post('/boards', boardController.createBoard);
    fastify.put('/boards/:id', boardController.updateBoard);
    fastify.delete('/boards/:id', boardController.deleteBoard);
    ```

### Middlewares
- Middlewares personalizados para a aplicação.
    - Arquivo: [src/middlewares/middleware.js](src/middlewares/middleware.js)
    - Exemplo de middleware:
    ```javascript
    const authenticate = async (request, reply) => {
        if (!request.session.user) {
            return reply.code(401).send({ error: 'Você precisa estar logado.' });
        }
        reply.send({ message: 'Você está autenticado.' });
    };
    ```

## Variáveis de Ambiente
- **DATABASE**: URL do MongoDB.
- **SESSION_SECRET**: Segredo para sessões.
- **NODE_ENV**: Ambiente de execução (desenvolvimento, produção, etc).

## Licença
Este projeto está licenciado sob a Licença MIT.
