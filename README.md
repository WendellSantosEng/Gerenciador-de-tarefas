# Gerenciador de Tarefas

![React](https://img.shields.io/badge/frontend-React-blue)
![Node.js](https://img.shields.io/badge/backend-Node.js-green)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue)
![Bootstrap](https://img.shields.io/badge/css-Bootstrap-purple)
![Fastify](https://img.shields.io/badge/web%20framework-Fastify-lightgrey)
![React Router](https://img.shields.io/badge/router-React%20Router-orange)
![Axios](https://img.shields.io/badge/http%20client-Axios-yellow)
![MongoDB](https://img.shields.io/badge/database-MongoDB-brightgreen)

## Sobre o Projeto

Este é o meu primeiro projeto fullstack criado do zero usando **React**, **Node.js**, **TypeScript** e várias outras tecnologias. O objetivo deste projeto é criar um gerenciador de tarefas como parte de um trabalho da faculdade.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Node.js**: Ambiente de execução JavaScript server-side.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática.
- **Bootstrap**: Framework CSS para desenvolvimento responsivo e rápido.
- **Fastify**: Framework web para Node.js focado em performance.
- **React Router DOM**: Biblioteca para roteamento em aplicações React.
- **Axios**: Cliente HTTP baseado em Promises para fazer requisições.
- **MongoDB**: Banco de dados NoSQL orientado a documentos.

## Funcionalidades

- Adicionar, editar e remover tarefas.
- Marcar tarefas como concluídas.
- Visualizar lista de tarefas pendentes e concluídas.
- Projeto totalmente inspirado no Trello e em suas vertentes.

## Instalação

1. Clone o repositório:
    ```sh
    git clone https://github.com/WendellSantosEng/Gerenciador-de-tarefas.git
    ```
2. Navegue até o diretório do projeto:
    ```sh
    cd Gerenciador-de-tarefas
    ```
3. Instale as dependências:
    ```sh
    npm install
    ```

## Uso

1. Inicie o servidor de desenvolvimento:
    ```sh
    npm start
    ```
2. Abra [http://localhost:3000](http://localhost:3000) para ver o projeto no navegador.

## Estrutura do Projeto

- **src/**: Contém todos os arquivos fonte do projeto.
  - **components/**: Componentes reutilizáveis da interface.
  - **pages/**: Páginas da aplicação.
  - **services/**: Serviços para comunicação com APIs.
  - **styles/**: Arquivos de estilo CSS.
  - **App.tsx**: Componente principal da aplicação.
  - **index.tsx**: Ponto de entrada do React.

## Rotas

O projeto utiliza o React Router DOM para gerenciamento de rotas. Aqui estão as principais rotas definidas no projeto:

- `/`: Página inicial que exibe as tarefas (requer autenticação).
- `/login`: Página de login para autenticação do usuário.
- `/perfil`: Página de perfil do usuário (requer autenticação).

As rotas são definidas no arquivo [routes.tsx](https://github.com/WendellSantosEng/Gerenciador-de-tarefas/blob/main/src/Router/routes.tsx):

```tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login/Login';
import Home from '../components/Home/Home';
import { PerfilUser } from '../components/Perfil/Perfil';

interface AppRouterProps {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppRouter: React.FC<AppRouterProps> = ({ isAuthenticated , setIsAuthenticated }) => {
    return (
        <Routes>
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path='/perfil' element={isAuthenticated ? <PerfilUser /> : <Navigate to="/login" />} />
        </Routes>
    );
}

export default AppRouter;
