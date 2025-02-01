import React, { useEffect, useState } from "react";
import './ModalHamburguerUsuario.css';
import { IconeSeta } from './svg/svg';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { ModalConfigUsuario } from './ModalConfigUsuario';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import CloseIcon from '@mui/icons-material/Close';

interface ModalHamburguerUsuarioProps {
    isOpen: boolean;
    onClose: () => void;
    onBoardClick: (boardId: string) => void;
}

interface Task {
    date: Date;
    message: string;
}

interface User {
    ownerId: string;
    email: string;
    iduser: string;
}

interface Board {
    _id: string;
    name: string;
    mainProjectId: string;
}

interface ProjectWithBoards {
    _id: string;
    name: string;
    ownerId : string;
    boards: Board[];
}


export const ModalHamburguerUsuario: React.FC<ModalHamburguerUsuarioProps> = ({ isOpen, onClose, onBoardClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [date, setDate] = useState<Date | null>(new Date());
    const [selectedTaskMessage, setSelectedTaskMessage] = useState<string | null>(null);
    const [selectedTaskDate, setSelectedTaskDate] = useState<Date | null>(null);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [projectsWithBoards, setProjectsWithBoards] = useState<ProjectWithBoards[]>([]);
    const [newBoardName, setNewBoardName] = useState("");
    const [isCreatingBoard, setIsCreatingBoard] = useState(false);
    const [newProjectName, setNewProjectName] = useState(""); // Novo estado para o nome do projeto
    const [isCreatingProject, setIsCreatingProject] = useState(false);

    const [tasks, setTasks] = useState<Task[]>([
        { date: new Date(2025, 1, 10), message: "Reunião importante" },
        { date: new Date(2025, 1, 11), message: "Entrega do projeto" },
    ]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://206.189.179.210/user', { withCredentials: true });
                setUser(response.data);
                console.log('Dados do usuário:', response.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Erro ao buscar dados do usuário:', error.response || error.message);
                } else {
                    console.error('Erro ao buscar dados do usuário:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchProjectsAndBoards = async (userId: any) => {
            try {
                if (!userId) {
                    console.error('Usuário não encontrado!');
                    return;
                }
            
                const [projectsResponse, boardsResponse] = await Promise.all([
                    axios.get('http://206.189.179.210/main-projects'),
                    axios.get('http://206.189.179.210/boards'),
                ]);
            
                let projects = projectsResponse.data;
                const boards = boardsResponse.data;
            
                // Filtra os projetos para exibir apenas os que pertencem ao usuário logado
                projects = projects.filter((project: any) => {
                    const isOwner = project.ownerId === user?.ownerId;
                    return isOwner;
                });
            
                console.log('Projetos filtrados para o usuário:', projects);
            
                const projectsWithBoards = projects.map((project: any) => {
                    const filteredBoards = boards.filter((board: any) => board.mainProjectId === project._id);
                    return {
                        ...project,
                        boards: filteredBoards,
                    };
                });
            
                setProjectsWithBoards(projectsWithBoards);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        // Quando o usuário é carregado, chama a função para buscar projetos e boards
        if (user && user.iduser) {
            fetchProjectsAndBoards(user.iduser);
        }
    }, [user]); // Esse useEffect vai rodar toda vez que o estado do `user` mudar

    

    const toggleConfigModal = () => {
        setIsConfigModalOpen(!isConfigModalOpen);
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (isDropdownOpen) {
            setSelectedTaskMessage(null);
            setSelectedTaskDate(null);
        }
    };

    const handleTileClick = (date: Date) => {
        const task = tasks.find(task => 
            task.date.getFullYear() === date.getFullYear() &&
            task.date.getMonth() === date.getMonth() &&
            task.date.getDate() === date.getDate()
        );
        if (task) {
            setSelectedTaskMessage(task.message); // Exibe a mensagem da tarefa
            setSelectedTaskDate(task.date); // Armazena a data da tarefa
        } else {
            setSelectedTaskMessage(null); // Limpa a mensagem se não houver tarefa
            setSelectedTaskDate(null); // Limpa a data da tarefa
        }
    };

    const getTileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const task = tasks.find(task => task.date.toDateString() === date.toDateString());
            if (task) {
                return (
                    <div className="task-indicator" onClick={() => handleTileClick(date)}>
                        {/* Exibe a mensagem da tarefa no próprio calendário */}
                        <span className="task-message-calendar">{task.message}</span>
                    </div>
                );
            }
        }
        return null;
    };

    const handleProjectClick = (projectId: string) => {
        setSelectedProjectId(selectedProjectId === projectId ? null : projectId);
    };
    

    const handleCreateBoard = async () => {
        if (newBoardName.trim()) {
            console.log('Criando nova board:', newBoardName);
            console.log('Projeto selecionado:', selectedProjectId);
            try {
                // Crie a board no servidor
                const response = await axios.post('http://206.189.179.210/boards', {
                    name: newBoardName,
                    mainProjectId: selectedProjectId,
                });
    
                // Crie a board localmente para adicionar ao projeto
                const newBoard = response.data; // Supondo que a resposta contenha a board criada
    
                // Atualize o estado de projectsWithBoards
                setProjectsWithBoards((prevProjects) => {
                    return prevProjects.map((project) => {
                        if (project._id === selectedProjectId) {
                            // Adiciona a nova board ao projeto correto
                            return {
                                ...project,
                                boards: [...project.boards, newBoard],
                            };
                        }
                        return project;
                    });
                });
    
                // Limpa o campo de nome da nova board e fecha a criação
                setNewBoardName("");
                setIsCreatingBoard(false);
    
                // Recarrega a página para garantir que tudo seja atualizado
                window.location.reload();
    
            } catch (error) {
                console.error('Erro ao criar a nova board:', error);
            }
        }
    };
    
    const handleCreateProject = async () => {
        if (newProjectName.trim()) {
            console.log('Criando novo projeto:', newProjectName);
            try {
                // Criação do projeto no servidor
                const response = await axios.post(
                    'http://206.189.179.210/main-projects', 
                    { name: newProjectName },
                    { withCredentials: true }
                );

                // Adiciona o novo projeto à lista
                const newProject = response.data;
                setProjectsWithBoards((prevProjects) => [...prevProjects, newProject]);

                // Limpa o campo de nome e fecha a criação
                setNewProjectName("");
                setIsCreatingProject(false);

                // Recarrega a página para garantir que tudo seja atualizado
                window.location.reload();
            } catch (error) {
                console.error('Erro ao criar o novo projeto:', error);
            }
        }
    };

    const handleDeleteProject = async (projectId: string) => {

        const isConfirmed = window.confirm("Você tem certeza que deseja excluir esta tarefa?");
        if (!isConfirmed) {
            return;
        }

        console.log('Deletando projeto:', projectId);
        try {
            // Deletar o projeto no servidor
            await axios.delete(`http://206.189.179.210/main-project/${projectId}`, { withCredentials: true });

            // Atualizar a lista de projetos
            setProjectsWithBoards((prevProjects) => prevProjects.filter((project) => project._id !== projectId));

            // Recarrega a página para garantir que tudo seja atualizado
            window.location.reload();
        } catch (error) {
            console.error('Erro ao deletar o projeto:', error);
        }
    }

    const handleDeleteBoard = async (boardId: string) => {

        const isConfirmed = window.confirm("Você tem certeza que deseja excluir esta tarefa?");
        if (!isConfirmed) {
            return;
        }

        console.log('Deletando board:', boardId);
        try {
            // Deletar a board no servidor
            await axios.delete(`http://206.189.179.210/boards/${boardId}`, {
                data: { mainProjectId: selectedProjectId },
                withCredentials: true
            });

            // Atualizar a lista de projetos
            setProjectsWithBoards((prevProjects) => {
                return prevProjects.map((project) => {
                    return {
                        ...project,
                        boards: project.boards.filter((board) => board._id !== boardId),
                    };
                });
            });

            // Recarrega a página para garantir que tudo seja atualizado
            window.location.reload();
        } catch (error) {
            console.error('Erro ao deletar a board:', error);
        }
    }

    return (
        <div className={`modal-hamburguer ${isOpen ? 'open' : ''}`}>
            <div className="cabecalho-modal">
                <div onClick={onClose}>
                    <CloseIcon sx={{ fontSize: 40 }}/>
                </div>
            </div>
            <div className="modal-body d-flex flex-column justify-content-between">
                <div className="projects">
                    <div className="botoes-modal d-flex align-items-center px-2 my-2">
                        <StackedBarChartIcon sx={{ fontSize: 40 }} />
                        <p className="texto-botao-modal-hamburguer mx-3 mb-0">PROJETOS</p>
                    </div>

                    <div className="projetos-container px-4">

                            {projectsWithBoards && projectsWithBoards.length > 0 ? (
                                projectsWithBoards.map((project) => (
                                    <div key={project._id} className="project">
                                        <div
                                            onClick={() => handleProjectClick(project._id)}
                                            className="botoes-modal d-flex justify-content-between align-items-center px-2 my-2"
                                        >
                                            <p className="texto-botao-modal-hamburguer projetos-title mx-3 mb-0">{project.name}</p>
                                            <div className="icones d-flex ">
                                                <button
                                                    className="btn btn-danger btn-sm mx-3"
                                                    onClick={() => handleDeleteProject(project._id || "")}
                                                >
                                                    -
                                                </button>
                                                <IconeSeta
                                                    className={`seta-icon ${selectedProjectId === project._id ? "rotated" : ""}`}
                                                />
                                            </div>
                                        </div>
                                        {selectedProjectId === project._id && (
                                            <div className="boards-dropdown px-4 py-3">
                                                {project.boards && project.boards.length > 0 ? (
                                                    project.boards.map((board) => (
                                                        <div key={board._id} className="d-flex justify-content-between align-items-center">
                                                            <div
                                                                key={board._id}  // A chave está sendo aplicada para cada board individual
                                                                className="board-item"
                                                                onClick={() => {
                                                                    onBoardClick(board._id);
                                                                    onClose();
                                                                }}
                                                            >
                                                                {board.name}
                                                                
                                                            </div>
                                                                <button
                                                                className="btn btn-danger btn-sm mx-3"
                                                                onClick={() => handleDeleteBoard(board._id || "")}
                                                            >
                                                                -
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>Sem boards associadas</p>
                                                )}

                                                {isCreatingBoard ? (
                                                    <div className="d-flex flex-column">
                                                        <div className="d-flex">
                                                            <input
                                                                type="text"
                                                                className="form-control my-2 mx-0"
                                                                placeholder="Nome da board"
                                                                value={newBoardName}
                                                                onChange={(e) => setNewBoardName(e.target.value)}
                                                            />
                                                            <button
                                                                className="btn btn-primary my-2 ml-2"
                                                                onClick={handleCreateBoard}
                                                            >
                                                                OK
                                                            </button>
                                                        </div>
                                                        <button
                                                            className="botao-cancelar-create my-2"
                                                            onClick={() => setIsCreatingBoard(false)} // Cancela a criação da board
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="botao-create-board d-flex align-items-center px-2 my-2"
                                                        onClick={() => setIsCreatingBoard(true)} // Inicia a criação da board
                                                    >
                                                        <p className="texto-botao-modal-hamburguer mx-3 mb-0">+ NOVA BOARD</p>
                                                    </button>
                                                )}

                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>Sem projetos disponíveis</p>
                            )}

                            {isCreatingProject ? (
                                <div>
                                    <input
                                        type="text"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        placeholder="Nome do novo projeto"
                                    />
                                    <div className="d-flex justify-content-around mt-2">
                                        <button className='botao-salvar-edit' onClick={handleCreateProject}>Criar Projeto</button>
                                        <button className='botao-cancelar-edit' onClick={() => setIsCreatingProject(false)}>Cancelar</button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    className="botao-create-board d-flex align-items-center px-2 my-4 w-100"
                                    onClick={() => setIsCreatingProject(true)}
                                >
                                    <p className="texto-botao-modal-hamburguer mx-3 mb-0">+ Criar Novo Projeto</p>
                                </button>
                            )}

                    </div>
                </div>

                <div className="demais-botoes">

                    {/* <div className="botoes-modal d-flex align-items-center px-2 my-2" onClick={toggleDropdown}>
                        <CalendarMonthIcon sx={{ fontSize: 40 }} />
                        <p className="texto-botao-modal-hamburguer mx-3 mb-0">CALENDÁRIO</p>
                    </div>
                    {isDropdownOpen && (
                        <div className="dropdown-calendar">
                            <Calendar
                                onChange={handleDateChange}
                                value={date}
                                view="month"
                                prevLabel="‹"
                                nextLabel="›"
                                tileContent={getTileContent}
                            />
                        </div>
                    )} */}
                    {selectedTaskMessage && selectedTaskDate && (
                        <div className="task-message">
                            <strong>Data:</strong> {selectedTaskDate.toLocaleDateString()} <br />
                            <strong>Tarefa:</strong> {selectedTaskMessage}
                        </div>
                    )}

                    <div onClick={toggleConfigModal} className="botoes-modal d-flex align-items-center px-2 my-2">
                        <SettingsSuggestIcon  sx={{ fontSize: 40 }} />
                        <p className="texto-botao-modal-hamburguer mx-3 mb-0">CONFIGURAÇÕES</p>
                    </div>
                </div>

                {user && <ModalConfigUsuario isOpen={isConfigModalOpen} onClose={toggleConfigModal} userName={""} userId={""} />}
            </div>
        </div>
    );
};
