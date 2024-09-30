import React, { useState } from 'react';
import { Switch, Tooltip } from 'antd';
import { MessageOutlined, FileImageOutlined } from '@ant-design/icons';

export enum Modo {
    TEXTO = 'texto',
    IMAGEM = 'imagem',
}

interface SwitchModoProps {
    modoAtual: Modo;
    setModoAtual: (modo: Modo) => void;
}

const SwitchModo: React.FC<SwitchModoProps> = ({ modoAtual, setModoAtual }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Modo Texto">
                <MessageOutlined style={{ marginRight: 8 }} />
            </Tooltip>
            <Switch
                checked={modoAtual === Modo.IMAGEM}
                onChange={() => setModoAtual(modoAtual === Modo.TEXTO ? Modo.IMAGEM : Modo.TEXTO)}
                style={{ backgroundColor: modoAtual === Modo.IMAGEM ? '#1890ff' : '#f0f0f0' }}
            />
            <Tooltip title="Modo Imagem">
                <FileImageOutlined style={{ marginLeft: 8 }} />
            </Tooltip>
        </div>
    );
};

export default SwitchModo;