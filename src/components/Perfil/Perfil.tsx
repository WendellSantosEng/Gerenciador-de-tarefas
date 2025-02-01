import React, { useEffect, useState } from "react";
import axios from "axios";
import './Perfil.css';
import { useNavigate } from "react-router-dom";
import { IconeHome } from "./svg/svg";
import 'bootstrap/dist/css/bootstrap.min.css';
import { TextField, Button } from '@mui/material';
import Avatar from 'react-avatar';

interface User {
    email: string;
    iduser: string;
    password: string;
    name: string;
    image?: string;
}

export const PerfilUser: React.FC = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setSenha] = useState('');
    const [confirmPassword, setConfirmarSenha] = useState('');
    const [erroSenha, setErroSenha] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [imagem, setImagem] = useState<File | null>(null); // Estado para armazenar a imagem
    const [imagemPreview, setImagemPreview] = useState<string | null>(null); // Pré-visualização da imagem

    // Carregar os dados do usuário quando o componente for montado
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://206.189.179.210/user', { withCredentials: true });
                setUser(response.data);
                setNome(response.data.name); // Atualiza o nome inicial
                setEmail(response.data.email); // Atualiza o email inicial
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setErroSenha(true);
            return;
        }
        setErroSenha(false);

        try {
            const updatedUser = {
                name: nome || user?.name || '',
                email: email || user?.email || '',
                password: password || user?.password || '',
            };

            // Enviar apenas os dados de usuário sem a imagem para /user/update
            const response = await axios.put('http://206.189.179.210/user/update', updatedUser, { withCredentials: true });

            if (response.data.success) {
                alert('Dados atualizados com sucesso!');
                setUser((prevUser) => {
                    if (!prevUser) {
                        return { name: nome, email: email, iduser: '', password: '', image: '' };
                    }
                    return {
                        ...prevUser,
                        name: nome || prevUser.name,
                        email: email || prevUser.email,
                        image: prevUser.image, // Preserva a imagem existente
                    };
                });
            } else {
                alert('Erro ao atualizar os dados.');
            }
        } catch (error) {
            console.error('Erro ao atualizar dados do usuário:', error);
            alert('Erro ao atualizar os dados.');
        }
    };
    
    const navigate = useNavigate();
    const handlehome = () => navigate('/');

    // Exibe imagem de perfil do usuário ou padrão se não houver
    const userImage = user?.image ? `http://206.189.179.210/uploads/${user.image}` : "https://www.w3schools.com/w3images/avatar2.png";

    return (
        <div>
            <div className="header d-flex justify-content-start align-items-center">
                <div onClick={handlehome} className="icone-home mx-5">
                    <IconeHome />
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex justify-content-center">
                        <div className="box">
                            <div className="image-user d-flex justify-content-center">
                                {/* {imagemPreview ? (
                                    <img src={imagemPreview} alt="Pré-visualização da imagem" className="img-thumbnail" />
                                ) : (
                                    <img src={userImage} alt="Imagem de perfil" className="img-thumbnail" />
                                )} */}
                                {/* <div className="botao-pra-subir-imagem">
                                    <input type="file" accept="image/*" onChange={handleImageChange} />
                                    <Button variant="contained" color="secondary" onClick={handleImageUpload}>
                                        Enviar Imagem
                                    </Button>
                                </div> */}
                                <Avatar round="50%" name={user?.name} />
                            </div>
                            <div className="box-body">
                                <div className="row">   
                                    <div className="col-12">
                                        <div className="form-group">
                                            <TextField
                                                label="Nome"
                                                variant="outlined"
                                                placeholder={user?.name || 'Nome'}
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <TextField
                                                label="Email"
                                                type="email"
                                                variant="outlined"
                                                placeholder={user?.email || 'Email'}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <TextField
                                                label="Senha"
                                                type="password"
                                                variant="outlined"
                                                placeholder="Digite sua senha"
                                                value={password}
                                                onChange={(e) => setSenha(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <TextField
                                                label="Confirmar Senha"
                                                type="password"
                                                variant="outlined"
                                                placeholder="Repita sua senha"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                                error={erroSenha}
                                                helperText={erroSenha ? 'As senhas não correspondem' : ''}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmit}
                                            fullWidth
                                            style={{ marginTop: '10px' }}
                                        >
                                            Atualizar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfilUser;
