import React from "react";
import axios from "axios";
import './ModalUsuario.css';
import { IconeFechar, IconeOlho, IconeSair } from './svg/svg';

interface ModalUsuarioProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    userId: string;
}

export const ModalUsuario: React.FC<ModalUsuarioProps> = ({ isOpen, onClose, userName, userId }) => {

    const handleLogout = async () => {
        try {   
            const response = await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
            console.log(response.data.success); 
            window.location.href = '/login'; 
        } catch (error) {
            console.error('Erro ao sair:', error); 
        }
    }; 

    const handlePerfil = () => {
        window.location.href = '/perfil';
    }
    
    return(
        <div className={`modal-usuario ${isOpen ? 'open' : ''}`}>
            <div className="cabecalho-modal">
                <div onClick={onClose}>
                    <IconeFechar /> 
                </div>
            </div>
            <div className="modal-body">
                <div className="d-flex justify-content-center">
                    <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" className="avatar" />
                </div>
                <div className="d-flex flex-column align-items-center info-user">
                    <p className="info-user-text">ID: {userId}</p>
                    <p className="info-user-text">USUARIO: {userName}</p>
                </div>
                <div className="botoes-modal">
                    <div onClick={handlePerfil} className="ver-perfil-button p-1 px-3 d-flex align-items-center mb-4">
                        <IconeOlho />
                        <p className="texto-botao-modal-user mx-3 mb-0">VER PERFIL</p>
                    </div>
                    <div onClick={handleLogout} className="sair-button p-2 px-3 d-flex align-items-center">
                        <IconeSair />
                        <p className="texto-botao-modal-user mx-3 mb-0">SAIR</p>
                    </div>
                </div>
            </div>
        </div>
    );
}