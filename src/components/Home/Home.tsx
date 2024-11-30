import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './svg/svg';
import { IconeMenu, IconeUsuario } from './svg/svg';
import { ModalUsuario } from './ModalUsuario';
import { ModalHamburguerUsuario } from './ModalHamburguerUsuario';
import { Search } from './Search';
import './Home.css';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { click } from '@testing-library/user-event/dist/click';
import EditNoteIcon from '@mui/icons-material/EditNote';

interface Item {
    id: number;
    name: string;
}

interface User {
    email: string;
    iduser: string;
}

interface Column {
    _id: string | null | undefined;
    id: string;
    name: string;
    taskIds: string[];
}

interface Task {
    _id: string | null | undefined;
    id: string;
    name: string;
    columnId: string;
    description: string;
    status: string;
}

interface Board {
    id: string;
    name: string;
    columnIds: string[];
}

const Home: React.FC = () => {
    const [data, setData] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isHamburguerModalOpen, setIsHamburguerModalOpen] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
    const [board, setBoard] = useState<Board | null>(null);
    const [columns, setColumns] = useState<Column[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTask, setEditingTask] = useState<string | null>(null); // Controla qual tarefa está sendo editada
    const [editedTask, setEditedTask] = useState<{ name: string; description: string; status: string } | null>(null as { name: string; description: string;status: string } | null);
    const [editingColumn, setEditingColumn] = useState<string | null>(null); // Controla qual coluna está sendo editada
    const [editedColumnName, setEditedColumnName] = useState<string>("");
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {setAnchorEl(event.currentTarget);};
    const handleClose = () => {setAnchorEl(null);};
    const [anchorElTask, setAnchorElTask] = React.useState<null | HTMLElement>(null);
    const opentask = Boolean(anchorElTask);
    const handleClickEditTask = (event: React.MouseEvent<HTMLButtonElement>) => {setAnchorElTask(event.currentTarget);};
    const handleCloseEditTask = () => {setAnchorElTask(null);};

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleHamburguerModal = () => {
        setIsHamburguerModalOpen((prevState) => {
            const newState = !prevState;
            // Armazenar o estado no localStorage
            localStorage.setItem('isHamburguerModalOpen', newState.toString());
            return newState;
        });
    };

    useEffect(() => {
        const storedModalState = localStorage.getItem('isHamburguerModalOpen');
        if (storedModalState === 'true') {
            setIsHamburguerModalOpen(true); // Reabre o modal
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/user', { withCredentials: true });
                setUser(response.data);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };

        const fetchBoardData = async () => {
            if (!selectedBoardId || selectedBoardId === "null") {
                console.error("ID do board não é válido");
                return;
            }
        
            try {
                // Limpa as colunas e tarefas ao mudar de board
                setColumns([]);
                setTasks([]);
        
                // Buscar o board
                console.log("Buscando dados do board com ID", selectedBoardId);
                const boardResponse = await axios.get(`http://localhost:3000/boards/${selectedBoardId}`);
                setBoard(boardResponse.data);
        
                // Buscar as colunas associadas ao board
                const columnPromises = boardResponse.data.columnIds.map((columnId: string) =>
                    axios.get(`http://localhost:3000/columns/${columnId}`).catch((error) => {
                        console.error(`Erro ao buscar coluna com ID ${columnId}:`, error.response);
                        return null; // Retorne null ou algum valor padrão para lidar com falhas
                    })
                );
        
                const columnResponses = await Promise.all(columnPromises);
                columnResponses.forEach((response, index) => {
                    if (response === null) {
                        console.log(`Falha ao carregar coluna com ID ${boardResponse.data.columnIds[index]}`);
                    } else {
                        console.log(`Coluna carregada com sucesso:`, response.data);
                    }
                });
                const fetchedColumns = columnResponses.map((response) => response.data);
                setColumns(fetchedColumns);
        
                // Buscar todas as tarefas de cada coluna
                const taskPromises = fetchedColumns.map((column: Column) =>
                    axios.get('http://localhost:3000/tasks', {
                        params: { columnId: column._id },
                    })
                );
        
                const taskResponses = await Promise.all(taskPromises);
                const allTasks = taskResponses.flatMap((response) => response?.data || []);
                setTasks(allTasks);
                console.log("Tarefas carregadas com sucesso:", allTasks);
            } catch (error) {
                console.error("Erro ao carregar dados do board:", error);
            }
        };
                
        if (selectedBoardId) {
            fetchBoardData();
        }

        fetchUserData();
    }, [selectedBoardId]);

    const handleBoardClick = (boardId: string) => {
        setSelectedBoardId(boardId); // Atualiza o estado de selectedBoardId
    };

    const handleEditClick = (task: Task) => {
        setEditingTask(task._id || ""); // Define a tarefa que está sendo editada
        setEditedTask({ 
            name: task.name, 
            description: task.description, 
            status: task.status || "pendente" // Padrão para "pendente"
        });
    };

    const handleInputChange = (field: keyof { name: string; description: string; status: string }, value: string) => {
        if (!editedTask) return;
        setEditedTask({ ...editedTask, [field]: value });
    };

    const saveTaskChanges = async (taskId: string) => {
        if (!editedTask) return;

        try {
            await axios.put(`http://localhost:3000/tasks/${taskId}`, editedTask);
            // Atualiza localmente a tarefa alterada
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? { ...task, ...editedTask } : task
                )
            );
            setEditingTask(null); // Sai do modo de edição
            setEditedTask(null);
        } catch (error) {
            console.error("Erro ao salvar as alterações da tarefa:", error);
        }
    };

    const cancelEdit = () => {
        setEditingTask(null); // Cancela a edição
        setEditedTask(null); // Reseta os valores
    };

    const deleteTask = async (taskId: string, columnId: string) => {
        try {
            // 1. Atualiza o estado local para remover a tarefa da interface imediatamente
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    
            // 2. Atualiza o estado das colunas localmente, removendo a tarefa da lista da coluna
            setColumns((prevColumns) =>
                prevColumns.map((column) => {
                    if (column._id === columnId) {
                        return {
                            ...column,
                            taskIds: column.taskIds.filter((id) => id !== taskId),
                        };
                    }
                    return column;
                })
            );
    
            // 3. Envia as requisições para o backend para excluir a tarefa e atualizar a coluna
            const deleteTaskPromise = axios.delete(`http://localhost:3000/tasks/${taskId}`);
            const updateColumnPromise = axios.patch(`http://localhost:3000/columns/${columnId}`, {
                removeTaskId: taskId,
            });
    
            // 4. Aguarda as promessas serem resolvidas (sem bloquear a interface)
            const [deleteTaskResponse, updateColumnResponse] = await Promise.all([deleteTaskPromise, updateColumnPromise]);
    
            // 5. Verifica se a exclusão da tarefa foi bem-sucedida
            if (deleteTaskResponse.status === 200 && updateColumnResponse.status === 200) {
                console.log(`Tarefa ${taskId} removida com sucesso da coluna ${columnId}`);
            } else {
                console.error("Erro ao remover a tarefa do backend");
            }
        } catch (error) {
            console.error("Erro ao apagar a tarefa:", error);
            // Aqui você pode adicionar um feedback para o usuário
        }
    };
    
    

    const handleCreateTask = async (columnId: string) => {
        const defaultTask = {
            name: "Nova tarefa",
            description: "Descrição da tarefa",
            status: "pendente",
            columnId: columnId
        };
    
        try {
            // Envia a requisição para criar a tarefa
            const response = await axios.post("http://localhost:3000/tasks", defaultTask, {
                withCredentials: true, // Envia o cookie da sessão
            });

            // Adiciona a nova tarefa à lista de tarefas no estado
            setTasks((prevTasks) => [...prevTasks, response.data.task]);

            handleEditClick(response.data.task);

        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
        }
    };

    const handleDeleteColumn = async (columnId: string) => {
        try {
            // Envia a requisição para deletar a coluna
            const response = await axios.delete(`http://localhost:3000/columns/${columnId}`, {
                withCredentials: true, // Envia o cookie da sessão
            });
    
            // Remover a coluna do estado
            setColumns((prevColumns) => prevColumns.filter((column) => column._id !== columnId));

            await axios.put(
                `http://localhost:3000/boards/${selectedBoardId}`,
                { columnIdToRemove: columnId }, // Payload informando a coluna a ser removida
                { withCredentials: true }
            );
    
            console.log("Coluna deletada com sucesso:", response.data);
    
        } catch (error) {
            console.error("Erro ao deletar coluna:", error);
        }
    };
    

    const handleCreateColumn = async () => {
        const defaultColumn = {
            name: "Nova coluna",
            boardId: selectedBoardId
        };
    
        try {
            // Envia a requisição para criar a coluna
            const response = await axios.post("http://localhost:3000/columns", defaultColumn, {
                withCredentials: true, // Envia o cookie da sessão
            });

            // Adiciona a nova coluna
            setColumns((prevColumns) => [...prevColumns, response.data.column]);

        } catch (error) {
            console.error("Erro ao criar coluna:", error);
        }
    };

    const handleDragStart = (taskId: string) => {
        // Salva o ID da tarefa que está sendo arrastada
        console.log("Iniciando o arrasto da tarefa: ", taskId);
    };


    const handleDrop = async (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId"); // Pega o ID da tarefa arrastada
    
        if (taskId) {
            try {
                
                const response = await axios.put(`http://localhost:3000/tasks/${taskId}`, {
                    columnId: columnId
                });
    
                // Se a requisição for bem-sucedida, atualiza os dados localmente
                if (response.status === 200) {
                    setTasks((prevTasks) =>
                        prevTasks.map((task: any) =>
                            task._id === taskId ? { ...task, columnId: columnId } : task
                        )
                    );
                }
            } catch (error) {
                console.error("Erro ao mover a tarefa:", error);
            }
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessário para permitir o drop
    };

    const handleColumnEditClick = (columnId: string, columnName: string) => {
        setEditingColumn(columnId);
        setEditedColumnName(columnName);
    };

    const handleColumnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedColumnName(event.target.value);
    };

    const handleUpdateColumn = async (columnId: string) => {
        try {
            console.log(`Atualizando coluna com ID: ${columnId} para o novo nome: ${editedColumnName}`);
            const response = await axios.put(`http://localhost:3000/columns/${columnId}`, {
                name: editedColumnName,
            });
    
            if (response.status === 200) {
                // Atualiza o estado com o novo nome sem precisar recarregar a página
                setColumns((prevColumns) =>
                    prevColumns.map((column) =>
                        column._id === columnId ? { ...column, name: editedColumnName } : column
                    )
                );
            }
            cancelColumnEdit();
        } catch (error) {
            console.error("Erro ao atualizar a coluna:", error);
        }
    };

    const cancelColumnEdit = () => {
        setEditingColumn(null);
        setEditedColumnName("");
    };

    return (
        <div>
            <header>
                <div className="container-fluid">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-1">
                            <div onClick={toggleHamburguerModal} className="menu-botao">
                                <IconeMenu />
                            </div>
                        </div>
                        {board && (
                            <div className="col-5 d-flex align-items-center justify-content-center">
                                <span className="board-name-top">{board.name}</span>
                            </div>
                        )}
                        <div className="col-5">
                            <Search setData={setData} setLoading={setLoading} />
                        </div>
                        <div className="col-1">
                            <div onClick={toggleModal}>
                                <IconeUsuario />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className='section-home'>
               
                {selectedBoardId && board && (
                    <div className="board-details">
                    {columns.map((column) => (
                    <div
                        key={column._id || column.id}
                        className="column"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column._id!)}
                    >
                        <div className="mb-3">
                            <div className="column-header">
                                {editingColumn === column._id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedColumnName}
                                            onChange={handleColumnNameChange}
                                        />
                                        <button onClick={() => handleUpdateColumn(column._id!)}>Salvar</button>
                                        <button onClick={cancelColumnEdit}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h3 className='m-0'>{column.name}</h3>
                                            <div>
                                                <Button
                                                    id="basic-button"
                                                    aria-controls={open ? 'basic-menu' : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={open ? 'true' : undefined}
                                                    onClick={handleClick}
                                                >
                                                    <DragIndicatorIcon color="action" />
                                                </Button>
                                                <Menu
                                                    id="basic-menu"
                                                    anchorEl={anchorEl}
                                                    open={open}
                                                    onClose={handleClose}
                                                    MenuListProps={{
                                                    'aria-labelledby': 'basic-button',
                                                    }}
                                                >
                                                    <MenuItem onClick={handleClose}>
                                                        <button
                                                            className="dropdown-item"
                                                            onClick={() => handleColumnEditClick(column._id!, column.name)}
                                                        >
                                                            Editar Nome
                                                        </button>
                                                    </MenuItem>
                                                    <MenuItem onClick={handleClose}>
                                                        <button
                                                            className="dropdown-item"
                                                            onClick={() => handleDeleteColumn(column._id || "")}
                                                        >
                                                            Apagar
                                                        </button>
                                                    </MenuItem>
                                                    <MenuItem onClick={handleClose}>
                                                        <button
                                                            className="dropdown-item"
                                                            onClick={() => handleCreateTask(column._id || "")}
                                                        >
                                                            Criar Tarefa
                                                        </button>
                                                    </MenuItem>
                                                </Menu>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                            <ul className="list-unstyled">
                                {tasks
                                    .filter((task) => task.columnId === column._id)
                                    .map((task) => (
                                        <li
                                            key={task._id} // Assegure-se de que _id é único
                                            className="task d-flex justify-content-between align-items-start"
                                            draggable
                                            onDragStart={(e) => {
                                                console.log("Drag started", task._id);
                                                e.dataTransfer.setData("taskId", task._id!);
                                            }}
                                            onDragEnd={(e) => {
                                                console.log("Drag ended", task._id);
                                            }}
                                        >

                                            {editingTask === task._id ? (
                                                <div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={editedTask?.name || ""}
                                                            onChange={(e) =>
                                                                handleInputChange("name", e.target.value)
                                                            }
                                                            placeholder="Nome da tarefa"
                                                        />
                                                        <textarea
                                                            value={editedTask?.description || ""}
                                                            onChange={(e) =>
                                                                handleInputChange("description", e.target.value)
                                                            }
                                                            placeholder="Descrição da tarefa"
                                                            className="m-3 text-area-description-task p-3"
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <div className="div-select-status-task w-100 d-flex justify-content-start">
                                                            <select
                                                                className="mx-3 select-status-task"
                                                                value={editedTask?.status || "pendente"}
                                                                onChange={(e) =>
                                                                    handleInputChange("status", e.target.value)
                                                                }
                                                            >
                                                                <option value="pendente">Pendente</option>
                                                                <option value="em execução">Em execução</option>
                                                                <option value="finalizado">Finalizado</option>
                                                            </select>
                                                        </div>
                                                        <div className="d-flex justify-content-center">
                                                            <button
                                                                className="btn btn-primary btn-sm mx-2"
                                                                onClick={() => saveTaskChanges(task._id || "")}
                                                            >
                                                                Salvar
                                                            </button>
                                                            <button
                                                                className="btn btn-secondary btn-sm mx-2"
                                                                onClick={cancelEdit}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div onClick={() => handleEditClick(task)}>
                                                    <p>{task.name}</p>
                                                    <small>{task.description}</small>
                                                    <p>Status: {task.status}</p>
                                                </div>
                                            )}

                                                <Button
                                                    id="basic-button-edit-task"
                                                    aria-controls={open ? 'basic-menu-edit-task' : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={opentask ? 'true' : undefined}
                                                    onClick={handleClickEditTask}
                                                >
                                                    <EditNoteIcon />
                                                </Button>
                                                <Menu
                                                    id="basic-menu-edit-task"
                                                    anchorEl={anchorElTask}
                                                    open={opentask}
                                                    onClose={handleCloseEditTask}
                                                    MenuListProps={{
                                                    'aria-labelledby': 'basic-button-edit-task',
                                                    }}
                                                >
                                                    <MenuItem onClick={handleCloseEditTask}>
                                                        <button
                                                            className="btn btn-danger btn-sm mt-2"
                                                            onClick={(event) => {
                                                                event.stopPropagation(); 
                                                                deleteTask(task._id!, column._id! || "");
                                                            }}
                                                        >
                                                            Deletar
                                                        </button>
                                                    </MenuItem>
                                                </Menu>
                                            
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}
                    <div className="botao-new-column">
                        <button
                            className="btn btn-success btn-sm mx-3"
                            onClick={() => handleCreateColumn()}
                        >
                            Nova coluna
                        </button>
                    </div>
                </div>
                )}
            </section>

            {user && <ModalUsuario isOpen={isModalOpen} onClose={toggleModal} userName={user.email} userId={user.iduser} />}
            {user && <ModalHamburguerUsuario isOpen={isHamburguerModalOpen} onClose={toggleHamburguerModal} onBoardClick={handleBoardClick} />}
        </div>
    );
};

export default Home;
