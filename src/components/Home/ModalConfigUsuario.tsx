import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import './ModalConfigUsuario.css';
import '../../index.css';
import { IconeFechar } from './svg/svg';

interface ModalConfigUsuarioProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    userId: string;
}

export const ModalConfigUsuario: React.FC<ModalConfigUsuarioProps> = ({ isOpen, onClose, userName, userId }) => {
    const [selectedColor, setSelectedColor] = useState<string>('#ffffff');
    const [activePickerIndex, setActivePickerIndex] = useState<number | null>(null);
    const [colors, setColors] = useState<string[]>([]); // Começa vazio
    const [section2Colors, setSection2Colors] = useState<string[]>([]); // Começa vazio
    const [activePickerIndex2, setActivePickerIndex2] = useState<number | null>(null);

    // Função para carregar cores do localStorage
    useEffect(() => {
        const savedColors = localStorage.getItem('section1Colors');
        const savedSection2Colors = localStorage.getItem('section2Colors');
        if (savedColors) setColors(JSON.parse(savedColors));
        else setColors(['#080808', '#080808', '#080808']); // Valor default se não houver cores salvas

        if (savedSection2Colors) setSection2Colors(JSON.parse(savedSection2Colors));
        else setSection2Colors(['#404040', '#404040']); // Valor default se não houver cores salvas
    }, []);

    // Função para confirmar a escolha da cor e salvar no localStorage
    const confirmColor = (index: number, section: string) => {
        if (section === 'section1') {
            const updatedColors = [...colors];
            updatedColors[index] = selectedColor;
            setColors(updatedColors);
            updateCSSVariables(updatedColors, 'section1');
            localStorage.setItem('section1Colors', JSON.stringify(updatedColors)); // Salva as cores no localStorage
        } else if (section === 'section2') {
            const updatedColors = [...section2Colors];
            updatedColors[index] = selectedColor;
            setSection2Colors(updatedColors);
            updateCSSVariables(updatedColors, 'section2');
            localStorage.setItem('section2Colors', JSON.stringify(updatedColors)); // Salva as cores no localStorage
        }
        setActivePickerIndex(null);
        setActivePickerIndex2(null);
    };

    const updateCSSVariables = (colors: string[], section: string) => {
        const root = document.documentElement;
        colors.forEach((color, index) => {
            root.style.setProperty(`--${section}-color-${index + 1}`, color);
        });
    };

    useEffect(() => {
        updateCSSVariables(colors, 'section1');
        updateCSSVariables(section2Colors, 'section2');
    }, [colors, section2Colors]);

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
    };

    return (
        <div className={`modal-config ${isOpen ? 'open' : ''}`}>
            <div className="cabecalho-modal">
                <div className="svg-fechar-icon" onClick={onClose}>
                    <IconeFechar />
                </div>
            </div>
            <div className="modal-content-config d-flex flex-column justify-content-between">
                <div className="cores">
                    <div className="titulo-cores">EDITAR CORES DE FUNDO - SEÇÃO 1</div>
                    <div className="box-cores d-flex justify-content-around">
                        {colors.map((color, index) => (
                            <div
                                key={`${color}-${index}`} // Combinação para gerar um identificador único
                                className="cor-bolinha"
                                style={{
                                    backgroundColor: color,
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    position: 'relative',
                                }}
                                onClick={() => {
                                    setActivePickerIndex(index);
                                    setSelectedColor(color);
                                }}
                            >
                                {activePickerIndex === index && (
                                    <div
                                        className="picker-container"
                                        style={{ position: 'absolute', zIndex: 1000 }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <HexColorPicker color={selectedColor} onChange={handleColorChange} />
                                        <button onClick={() => confirmColor(index, 'section1')}>OK</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="about-config">
                    <h4>Sobre</h4>
                    <h6>
                        Este site foi desenvolvido como parte de um projeto acadêmico da disciplina <strong>Gerência de Projeto de Software</strong>. Inspirado no Trello, ele é um gerenciador de tarefas completo, projetado para facilitar a organização e o acompanhamento de projetos pessoais e em equipe. Utilizando <strong>React</strong> no frontend e <strong>Node.js</strong> no backend, o projeto aplica conceitos de desenvolvimento reativo e interativo, oferecendo uma plataforma eficiente para gerenciamento de tarefas e colaboração em tempo real. A integração entre essas tecnologias possibilita uma experiência dinâmica e fluída, permitindo aos usuários gerenciar suas tarefas de forma prática e colaborativa.
                    </h6>
                    <h6>
                        <br />
                        © 2024 Nome do Projeto. Todos os direitos reservados.
                    </h6>
                    <h6>
                        <br />
                        Desenvolvido por Wendell Santos.<br />
                        Para mais informações, entre em contato: wendellsdev@gmail.com.
                    </h6>
                </div>
            </div>
        </div>
    );
};
