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
