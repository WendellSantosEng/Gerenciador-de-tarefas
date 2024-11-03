import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './svg/svg';
import { IconeMenu, IconeUsuario } from './svg/svg';
import { ModalUsuario } from './ModalUsuario';
import { Search } from './Search';
import './Home.css';

interface Item {
    id: number;
    name: string;
}

interface User {
    email: string;
    iduser: string;
}

const Home: React.FC = () => {
    const [data, setData] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/user', { withCredentials: true });
                setUser(response.data);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <header>
                <div className="container-fluid">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-1">
                            <div className="menu-botao">
                                <IconeMenu />
                            </div>
                        </div>
                        <div className="offset-5 col-5">
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
            <div>
                {loading ? (
                    <div>Carregando...</div>
                ) : (
                    <ul>
                        {data.map((item) => (
                            <li key={item.id}>{item.name}</li>
                        ))}
                    </ul>
                )}
            </div>

            {user && <ModalUsuario isOpen={isModalOpen} onClose={toggleModal} userName={user.email} userId={user.iduser} />}
        </div>
    );
};

export default Home;