import React, { useEffect, useState }  from "react";
import axios from "axios";
import './ModalUsuario.css';
import { IconeFechar, IconeOlho, IconeSair } from './svg/svg';
import Avatar from 'react-avatar';

interface ModalUsuarioProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    userId: string;
}

interface User {
    email: string;
    iduser: string;
    password: string;
    name: string;
    image?: string;
}


export const ModalUsuario: React.FC<ModalUsuarioProps> = ({ isOpen, onClose, userName, userId }) => {

    const [user, setUser] = useState<User | null>(null);

    const handleLogout = async () => {
        try {   
            const response = await axios.post('http://206.189.179.210/logout', {}, { withCredentials: true });
            console.log(response.data.success); 
            window.location.href = '/login'; 
        } catch (error) {
            console.error('Erro ao sair:', error); 
        }
    }; 

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://206.189.179.210/user', { withCredentials: true });
                setUser(response.data);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };

        fetchUserData();
    }, []);

    const handlePerfil = () => {
        window.location.href = '/perfil';
    }
    
    return(
        <div className={`modal-usuario ${isOpen ? 'open' : ''}`}>
            <div className="cabecalho-modal">
                <div className="svg-fechar-icon" onClick={onClose}>
                    <IconeFechar /> 
                </div>
            </div>
            <div className="modal-body">
                <div className="d-flex justify-content-center">
                    <Avatar round="50%" name={user?.name} />
                </div>
                <div className="d-flex flex-column align-items-center info-user">
                    <p className="info-user-text">ID: {userId}</p>
                    <p className="info-user-text">USUARIO: {userName}</p>
                </div>
                <div className="botoes-modal2">
                    <div onClick={handlePerfil} id="ver-perfil-button" className=" p-1 px-3 d-flex align-items-center mb-4">
                        <IconeOlho />
                        <p className="texto-botao-modal-user mx-3 mb-0">VER PERFIL</p>
                    </div>
                    <div onClick={handleLogout} id="sair-button" className=" p-2 px-3 d-flex align-items-center">
                        <IconeSair />
                        <p className="texto-botao-modal-user mx-3 mb-0">SAIR</p>
                    </div>
                </div>
            </div>
        </div>
    );
}