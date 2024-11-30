import React from 'react';
import { ReactComponent as MenuIcone } from './MenuIcone.svg'; 
import { ReactComponent as UsuarioIcone } from './UsuarioIcone.svg'; 
import { ReactComponent as PesquisaIcone } from './PesquisaIcone.svg'; 
import { ReactComponent as FecharIcone } from './FecharIcone.svg';
import { ReactComponent as OlhoIcone } from './OlhoIcone.svg';
import { ReactComponent as SairIcone } from './SairIcone.svg';
import { ReactComponent as CalendarioIcone } from './CalendarioIcone.svg';
import { ReactComponent as ConfigIcone } from './ConfigIcone.svg';
import { ReactComponent as ProjectIcone } from './ProjectIcone.svg';
import { ReactComponent as SetaIcone } from './SetaIcone.svg';

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

export const IconeCalendario = () => {
    return (
        <div>
            <CalendarioIcone width={50} height={50} fill="blue" />
        </div>
    );
}

export const IconeConfig = () => {
    return (
        <div>
            <ConfigIcone width={50} height={50} fill="blue" />
        </div>
    );
}

export const IconePojetos = () => {
    return (
        <div>
            <ProjectIcone width={50} height={50} fill="blue" />
        </div>
    );
}

interface IconeSetaProps {
    className?: string;
}

export const IconeSeta : React.FC<IconeSetaProps> = ({ className }) =>  {
    return (
        <div>
            <SetaIcone className={className} width={30} height={30} fill="blue" />
        </div>
    );
}