# Projeto de Gerenciamento de Tarefas

Este projeto é um gerenciador de tarefas inspirado no Trello, desenvolvido utilizando React no frontend e Node.js no backend. Ele permite a organização e acompanhamento de projetos pessoais e em equipe, oferecendo uma plataforma eficiente para gerenciamento de tarefas e colaboração em tempo real.

## Estrutura do Projeto

```plaintext
.dist/
.gitignore
build/
public/
src/
  App.css
  App.tsx
  components/
    Home/
      Home.css
      Home.tsx
      ModalConfigUsuario.css
      ModalConfigUsuario.tsx
      Search.css
      Search.tsx
      svg/
        svg.tsx
    Login/
      Login.css
      Login.tsx
    Perfil/
      Perfil.css
      Perfil.tsx
  index.css
  index.tsx
  react-app-env.d.ts
  Router/
    routes.tsx
tsconfig.json
package.json
README.md
```

## Funcionalidades

### Home

O componente principal da aplicação, onde os usuários podem visualizar e gerenciar suas tarefas e colunas.

- **Home.tsx**: Contém a lógica principal para exibição e manipulação de colunas e tarefas.
- **Home.css**: Estilos para o componente Home.
- **ModalConfigUsuario.tsx**: Modal para configuração do usuário.
- **ModalConfigUsuario.css**: Estilos para o modal de configuração do usuário.
- **Search.tsx**: Componente de busca.
- **Search.css**: Estilos para o componente de busca.
- **svg/svg.tsx**: Ícones SVG utilizados na aplicação.

### Login

Componente de autenticação onde os usuários podem fazer login ou registrar-se.

- **Login.tsx**: Lógica de autenticação.
- **Login.css**: Estilos para o componente de login.

### Perfil

Componente onde os usuários podem visualizar e editar suas informações de perfil.

- **Perfil.tsx**: Lógica para exibição e edição do perfil do usuário.
- **Perfil.css**: Estilos para o componente de perfil.

### Router

Configuração das rotas da aplicação.

- **routes.tsx**: Define as rotas e a lógica de navegação da aplicação.

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```
2. Navegue até o diretório do projeto:
   ```sh
   cd seu-repositorio
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```

## Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm start`

Executa a aplicação em modo de desenvolvimento.\
Abra [http://localhost:3000](http://localhost:3000) para visualizá-la no navegador.

### `npm test`

Inicia o executor de testes no modo interativo.\
Veja a seção sobre [testes](https://facebook.github.io/create-react-app/docs/running-tests) para mais informações.

### `npm run build`

Compila a aplicação para produção na pasta 

build

.\
Agrupa corretamente o React no modo de produção e otimiza a compilação para o melhor desempenho.

### `npm run eject`

**Nota: esta é uma operação sem retorno. Uma vez que você `eject`, você não pode voltar!**

Se você não estiver satisfeito com a ferramenta de construção e as escolhas de configuração, você pode `eject` a qualquer momento. Este comando removerá a dependência única de construção do seu projeto.

## Configuração do Projeto

### 

tsconfig.json



Configurações do compilador TypeScript.

### 

.gitignore



Arquivos e diretórios a serem ignorados pelo Git.

## Dependências

- **React**: Biblioteca para construção de interfaces de usuário.
- **Axios**: Cliente HTTP baseado em Promises para o navegador e Node.js.
- **Bootstrap**: Framework CSS para desenvolvimento de interfaces responsivas.
- **React Router DOM**: Biblioteca para controle de rotas no React.
- **Material UI**: Biblioteca de componentes React para um desenvolvimento ágil e estiloso.

## Contato

Desenvolvido por Wendell Santos.\
Para mais informações, entre em contato: wendellsdev@gmail.com.

## Licença

Este projeto é licenciado sob os termos da licença MIT.
