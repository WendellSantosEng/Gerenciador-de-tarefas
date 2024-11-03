import React from 'react';
import { ReactComponent as MenuIcone } from './MenuIcone.svg'; 
import { ReactComponent as UsuarioIcone } from './UsuarioIcone.svg'; 
import { ReactComponent as PesquisaIcone } from './PesquisaIcone.svg'; 
import { ReactComponent as FecharIcone } from './FecharIcone.svg';
import { ReactComponent as OlhoIcone } from './OlhoIcone.svg';
import { ReactComponent as SairIcone } from './SairIcone.svg';

export const IconeMenu = () => {
    return (
        <div>
            <MenuIcone width={50} height={50} fill="red" />
        </div>
    );
};

export const IconeUsuario = () => {
    return (
        <div>
            <UsuarioIcone width={50} height={50} fill="blue" />
        </div>
    );
}

export const IconePesquisa = () => {
    return (
        <div>
            <PesquisaIcone width={50} height={50} fill="blue" />
        </div>
    );
}

export const IconeFechar = () => {
    return (
        <div>
            <FecharIcone width={50} height={50} fill="blue" />
        </div>
    );
}

export const IconeOlho = () => {
    return (
        <div>
            <OlhoIcone width={40} height={40} fill="blue" />
        </div>
    );
}

export const IconeSair = () => {
    return (
        <div>
            <SairIcone width={36} height={36} fill="blue" />
        </div>
    );
}