import React from "react";
import axios from "axios";
import './Search.css';
import { IconePesquisa } from './svg/svg';

interface SearchProps {
    setData: React.Dispatch<React.SetStateAction<any[]>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Search: React.FC<SearchProps> = ({ setData, setLoading }) => {
    const [search, setSearch] = React.useState("");

    const handleSearch = async () => {
        setLoading(true);
        try {
            // Aqui você pode descomentar para fazer a requisição ao endpoint /searchhome
            // const response = await axios.get(`/searchhome?query=${search}`);
            // setData(response.data);
        } catch (error) {
            console.error("Erro ao buscar:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="barra-pesquisa d-flex align-items-center">
            <div onClick={handleSearch}>
                <IconePesquisa />
            </div>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Digite sua pesquisa..."
            />
        </div>
    );
};