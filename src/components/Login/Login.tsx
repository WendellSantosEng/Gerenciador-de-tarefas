import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface LoginProps {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(
                'http://localhost:3000/login', 
                { email, password },
                { 
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true 
                }
            );
            console.log(response.data);
            if (response.status === 200) {
                setIsAuthenticated(true); 
                navigate('/');
              }
        } catch (error) {
            console.error('Erro ao fazer login!', error);
            setErrorMessage('Falha ao fazer login. Verifique suas credenciais.');
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validação simples
        if (!registerEmail || !registerPassword) {
            setErrorMessage('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/register', 
                { email: registerEmail, password: registerPassword },
                { 
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true 
                }
            );
            console.log(response.data);
            setSuccessMessage('Conta criada com sucesso! Você pode fazer login agora.');
        } catch (error) {
            console.error('Erro ao registrar usuário!', error);
            setErrorMessage('Erro ao criar conta. Tente novamente.');
        }
    };

    return (
        <section className='secao-login'>
            <div className="topo-login"></div>
            <div className="container-fluid">
                <div className="row justify-content-around">
                    {/* Formulário de Login */}
                    <div className="col-5">
                        <form onSubmit={handleLoginSubmit}>
                            <div className="login-div d-flex flex-column">
                                <p className='title-login'>Faça login</p>
                                <div className='email-div'>
                                    <label>Email:</label>
                                    <input 
                                        className='w-100 input-login'
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                    />
                                </div>
                                <div className='password-div'>
                                    <label>Password:</label>
                                    <input 
                                        className='w-100 input-login'
                                        type="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="row d-flex justify-content-center">
                                <div className="botao-login col-6 mt-4">
                                    <button type="submit">ENTRAR</button>
                                </div>
                            </div>
                            {errorMessage && <div className="text-danger">{errorMessage}</div>}
                        </form>
                    </div>

                    {/* Formulário de Registro */}
                    <div className="col-5">
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="login-div d-flex flex-column">
                                <p className='title-login'>Crie uma conta</p>
                                <div className='email-div'>
                                    <label>Email:</label>
                                    <input 
                                        className='w-100 input-login'
                                        type="email" 
                                        value={registerEmail} 
                                        onChange={(e) => setRegisterEmail(e.target.value)} 
                                    />
                                </div>
                                <div className='password-div'>
                                    <label>Password:</label>
                                    <input 
                                        className='w-100 input-login'
                                        type="password" 
                                        value={registerPassword} 
                                        onChange={(e) => setRegisterPassword(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="row d-flex justify-content-center">
                                <div className="botao-login col-6 mt-4">
                                    <button type="submit">CRIAR CONTA</button>
                                </div>
                            </div>
                            {errorMessage && <div className="text-danger">{errorMessage}</div>}
                            {successMessage && <div className="text-success">{successMessage}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;